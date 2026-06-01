import { useState } from 'react'
import { Check, X } from 'lucide-react'
import type { AgentComparison, RunSummary, TestStatus } from '@/../product/sections/verdict-and-reporting/types'

interface CompareAgentsTabProps {
  agentComparisons: AgentComparison[]
  runs: RunSummary[]
}

function StatusCell({ status }: { status: TestStatus | undefined }) {
  if (!status) return <td className="px-3 py-2.5 text-center"><span className="text-zinc-700 text-[10px]">—</span></td>
  return (
    <td className="px-3 py-2.5 text-center">
      {status === 'passed' ? (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-500/15 border border-emerald-500/30">
          <Check className="w-3 h-3 text-emerald-500" strokeWidth={2.5} />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-red-500/15 border border-red-500/30">
          <X className="w-3 h-3 text-red-400" strokeWidth={2.5} />
        </span>
      )}
    </td>
  )
}

export function CompareAgentsTab({ agentComparisons, runs }: CompareAgentsTabProps) {
  const [failedOnly, setFailedOnly] = useState(false)

  const agents = [...new Set(runs.map((r) => r.buildAgent))].sort()

  const filtered = failedOnly
    ? agentComparisons.filter((c) => Object.values(c.results).some((s) => s === 'failed'))
    : agentComparisons

  const disagreements = agentComparisons.filter(
    (c) => new Set(Object.values(c.results)).size > 1
  ).length

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Controls */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {agents.length} agents
          </span>
          <span className="text-zinc-700">·</span>
          <span className={`text-[10px] font-mono ${disagreements > 0 ? 'text-amber-400' : 'text-zinc-500'}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {disagreements} disagreements
          </span>
        </div>
        <label className="ml-auto flex items-center gap-2 cursor-pointer">
          <span className="text-[10px] text-zinc-500" style={{ fontFamily: "'Inter', sans-serif" }}>
            Failed only
          </span>
          <button
            onClick={() => setFailedOnly((v) => !v)}
            className={`w-8 h-4 rounded-full transition-colors ${failedOnly ? 'bg-cyan-500' : 'bg-zinc-700'}`}
          >
            <span
              className={`block w-3 h-3 rounded-full bg-white m-0.5 transition-transform ${failedOnly ? 'translate-x-4' : ''}`}
            />
          </button>
        </label>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-800 sticky top-0 bg-zinc-950">
              <th className="px-4 py-3 text-left font-medium text-zinc-600 uppercase tracking-wider text-[10px] w-1/2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Test Case
              </th>
              {agents.map((agent) => (
                <th key={agent} className="px-3 py-3 text-center">
                  <span className="text-[10px] font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {agent}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {filtered.map((row) => {
              const isDisagreement = new Set(Object.values(row.results)).size > 1
              return (
                <tr key={row.testCaseId}
                  className={`transition-colors ${isDisagreement ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-zinc-800/20'}`}>
                  <td className="px-4 py-2.5">
                    <p className="text-zinc-300 text-[11px] leading-tight mb-0.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                      {row.testCaseTitle}
                    </p>
                    <p className="text-zinc-600 text-[10px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                      {row.storyTitle}
                    </p>
                  </td>
                  {agents.map((agent) => (
                    <StatusCell key={agent} status={row.results[agent]} />
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-24 text-zinc-600 text-xs"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            No {failedOnly ? 'failed' : ''} test cases to display
          </div>
        )}
      </div>
    </div>
  )
}
