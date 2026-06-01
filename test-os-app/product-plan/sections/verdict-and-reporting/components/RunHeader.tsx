import { Play, ExternalLink, CheckCircle2, XCircle, Clock, Cpu } from 'lucide-react'
import type { RunSummary } from '../types'

interface RunHeaderProps {
  run: RunSummary
  onRunValidation?: () => void
  onExportReport?: () => void
}

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000)
  const m = Math.floor(s / 60)
  const rem = s % 60
  return m > 0 ? `${m}m ${rem}s` : `${s}s`
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

export function RunHeader({ run, onRunValidation, onExportReport }: RunHeaderProps) {
  const passRate = Math.round((run.passed / run.totalTests) * 100)

  return (
    <div className="border-b border-zinc-800 bg-zinc-900/40 px-6 py-5 shrink-0">
      {/* Run meta */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span
          className="text-[10px] font-mono text-zinc-500"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {run.id}
        </span>
        <span className="text-zinc-700">·</span>
        <span
          className="text-[10px] text-zinc-500"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {formatTimestamp(run.timestamp)}
        </span>
        <span className="text-[10px] font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {run.buildAgent}
        </span>
        <span className="text-[10px] font-mono border border-zinc-700 text-zinc-500 px-1.5 py-0.5 rounded"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {run.executor}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onRunValidation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 text-xs transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Play className="w-3 h-3" strokeWidth={2} />
            Run Validation
          </button>
          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 text-xs transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <ExternalLink className="w-3 h-3" strokeWidth={2} />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 flex-wrap mb-3">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
          <span
            className="text-lg font-bold text-zinc-200 tabular-nums"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {run.totalTests}
          </span>
          <span className="text-xs text-zinc-500">tests</span>
        </div>

        <div className="h-4 w-px bg-zinc-800" />

        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
          <span
            className="text-lg font-bold text-emerald-400 tabular-nums"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {run.passed}
          </span>
          <span className="text-xs text-zinc-500">passed</span>
        </div>

        <div className="flex items-center gap-1.5">
          <XCircle className="w-3.5 h-3.5 text-red-400" strokeWidth={2} />
          <span
            className="text-lg font-bold text-red-400 tabular-nums"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {run.failed}
          </span>
          <span className="text-xs text-zinc-500">failed</span>
        </div>

        <div className="h-4 w-px bg-zinc-800" />

        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
          <span
            className="text-sm font-mono text-zinc-400 tabular-nums"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {formatDuration(run.durationMs)}
          </span>
        </div>
      </div>

      {/* Pass rate bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden max-w-sm">
          <div
            className={`h-full rounded-full transition-all ${run.failed > 0 ? 'bg-emerald-500' : 'bg-cyan-500'}`}
            style={{ width: `${passRate}%` }}
          />
        </div>
        <span
          className={`text-xs font-mono tabular-nums ${run.failed > 0 ? 'text-emerald-400' : 'text-cyan-400'}`}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {passRate}%
        </span>
      </div>
    </div>
  )
}
