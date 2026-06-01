import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import type { RunSummary } from './types'

interface HistoryTabProps {
  runs: RunSummary[]
  activeRunId: string
  onSelectRun?: (runId: string) => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000)
  const m = Math.floor(s / 60)
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`
}

export function HistoryTab({ runs, activeRunId, onSelectRun }: HistoryTabProps) {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-zinc-800 sticky top-0 bg-zinc-950">
            {['Run ID', 'Date', 'Agent', 'Passed', 'Failed', 'Duration', 'Status'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left font-medium text-zinc-600 uppercase tracking-wider text-[10px]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {runs.map((run) => {
            const isActive = run.id === activeRunId
            return (
              <tr
                key={run.id}
                onClick={() => onSelectRun?.(run.id)}
                className={`cursor-pointer transition-colors group ${
                  isActive ? 'bg-cyan-500/8' : 'hover:bg-zinc-800/30'
                }`}
              >
                <td className="px-4 py-3">
                  <span
                    className={`font-mono text-[10px] ${isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {run.id.replace('run-', '')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-zinc-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatDate(run.timestamp)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {run.buildAgent}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-emerald-400 font-mono tabular-nums font-semibold"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {run.passed}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-mono tabular-nums font-semibold ${run.failed > 0 ? 'text-red-400' : 'text-zinc-600'}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {run.failed}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-zinc-500 font-mono"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatDuration(run.durationMs)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {run.status === 'completed' && run.failed === 0 && (
                    <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                      <CheckCircle2 className="w-3 h-3" strokeWidth={2} /> pass
                    </span>
                  )}
                  {run.status === 'completed' && run.failed > 0 && (
                    <span className="flex items-center gap-1 text-red-400 text-[10px]">
                      <XCircle className="w-3 h-3" strokeWidth={2} /> fail
                    </span>
                  )}
                  {run.status === 'running' && (
                    <span className="flex items-center gap-1 text-cyan-400 text-[10px]">
                      <Loader2 className="w-3 h-3 animate-spin" strokeWidth={2} /> running
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
