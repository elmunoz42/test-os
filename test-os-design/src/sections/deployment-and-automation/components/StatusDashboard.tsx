import { useState } from 'react'
import { RefreshCw, Wifi, WifiOff, Clock, Calendar, Server } from 'lucide-react'
import type { InstanceStatus, CronConfig, LogLine, InstanceState } from '@/../product/sections/deployment-and-automation/types'

// ── Instance state chip ───────────────────────────────────────────────────────

function StateChip({ state }: { state: InstanceState }) {
  const cfg: Record<InstanceState, { dot: string; text: string; border: string; bg: string; Icon: typeof Wifi }> = {
    running: { dot: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', Icon: Wifi },
    stopped: { dot: 'bg-red-500',     text: 'text-red-400',     border: 'border-red-500/30',     bg: 'bg-red-500/10',     Icon: WifiOff },
    pending: { dot: 'bg-amber-500',   text: 'text-amber-400',   border: 'border-amber-500/30',   bg: 'bg-amber-500/10',   Icon: Server },
    unknown: { dot: 'bg-zinc-500',    text: 'text-zinc-400',    border: 'border-zinc-700',       bg: 'bg-zinc-800/50',    Icon: Server },
  }
  const c = cfg[state]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold ${c.text} ${c.border} ${c.bg}`}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${state === 'running' ? 'animate-pulse' : ''}`} />
      {state}
    </span>
  )
}

// ── Info chip ─────────────────────────────────────────────────────────────────

function InfoChip({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50">
      <Icon className="w-3 h-3 text-zinc-500 shrink-0" strokeWidth={1.5} />
      <span className="text-[9px] text-zinc-600 uppercase tracking-wide shrink-0"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {label}
      </span>
      <span className="text-[11px] font-mono text-zinc-300"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {value}
      </span>
    </div>
  )
}

// ── Log line ──────────────────────────────────────────────────────────────────

function LogLineRow({ line }: { line: LogLine }) {
  const levelColors = {
    info:  'text-zinc-500',
    warn:  'text-amber-400',
    error: 'text-red-400',
  }
  const msgColors = {
    info:  'text-zinc-300',
    warn:  'text-amber-300',
    error: 'text-red-300',
  }
  const time = new Date(line.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })

  return (
    <div className="flex items-start gap-3 py-0.5 hover:bg-zinc-800/20 px-1 rounded transition-colors">
      <span className="text-zinc-700 shrink-0 tabular-nums text-[11px]"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {time}
      </span>
      <span className={`text-[10px] font-bold uppercase w-8 shrink-0 ${levelColors[line.level]}`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {line.level}
      </span>
      <span className={`text-[11px] flex-1 leading-relaxed ${msgColors[line.level]}`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {line.message}
      </span>
    </div>
  )
}

// ── Main StatusDashboard ──────────────────────────────────────────────────────

interface StatusDashboardProps {
  instanceStatus: InstanceStatus | null
  cronConfig: CronConfig | null
  logLines: LogLine[]
  onRefreshLog?: () => void
}

function formatNextRun(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short',
  })
}

export function StatusDashboard({ instanceStatus, cronConfig, logLines, onRefreshLog }: StatusDashboardProps) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    onRefreshLog?.()
    setTimeout(() => setRefreshing(false), 1200)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Phase label + title */}
      <div className="px-6 pt-6 pb-4 shrink-0">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Phase 04
        </p>
        <h1 className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Deployment & Automation
        </h1>
        <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Runner active — nightly runs scheduled
        </p>
      </div>

      {/* Status header chips */}
      <div className="px-6 pb-4 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          {instanceStatus && (
            <>
              <StateChip state={instanceStatus.state} />
              <InfoChip icon={Server} label="id" value={instanceStatus.instanceId} />
              <InfoChip icon={Server} label="region" value={instanceStatus.region} />
              {instanceStatus.publicIp && (
                <InfoChip icon={Wifi} label="ip" value={instanceStatus.publicIp} />
              )}
            </>
          )}
          {cronConfig && (
            <>
              <InfoChip icon={Clock} label="cron" value={cronConfig.expression} />
              <InfoChip icon={Calendar} label="next" value={formatNextRun(cronConfig.nextRunAt)} />
            </>
          )}
        </div>
      </div>

      {/* Log pane */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Log toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-zinc-800 shrink-0">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            cron.log
          </p>
          {cronConfig?.lastRunAt && (
            <span className="text-[10px] text-zinc-600"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              last run: {new Date(cronConfig.lastRunAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          )}
          <button
            onClick={handleRefresh}
            className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 text-[11px] transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} strokeWidth={1.5} />
            Refresh
          </button>
        </div>

        {/* Log output */}
        <div className="flex-1 overflow-y-auto bg-zinc-950 px-5 py-3">
          {logLines.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-zinc-700 text-xs"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              No log output yet. Waiting for next cron run.
            </div>
          ) : (
            <div className="space-y-0.5">
              {logLines.map((line, i) => (
                <LogLineRow key={i} line={line} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
