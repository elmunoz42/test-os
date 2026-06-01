import { useState } from 'react'
import { AlertTriangle, GitCompare, History, ShieldCheck, Terminal } from 'lucide-react'
import type {
  VerdictAndReportingProps,
  ActiveTab,
  Epic,
  TestCase,
} from '@/../product/sections/verdict-and-reporting/types'
import { RunHeader } from './RunHeader'
import { ResultTree } from './ResultTree'
import { TestCaseSlideOver } from './TestCaseSlideOver'
import { HistoryTab } from './HistoryTab'
import { CompareAgentsTab } from './CompareAgentsTab'

// ── Helpers ──────────────────────────────────────────────────────────────────

function findTestCase(epics: Epic[], id: string): TestCase | null {
  for (const epic of epics) {
    for (const section of epic.sections) {
      for (const story of section.stories) {
        for (const tc of story.testCases) {
          if (tc.id === id) return tc
        }
      }
    }
  }
  return null
}

// ── Run Validation Modal ─────────────────────────────────────────────────────

function RunValidationModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const cmd = './run-tests.sh'

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(cmd) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-4 h-4 text-cyan-400" strokeWidth={1.5} />
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Run Validation
          </h3>
        </div>
        <p className="text-xs text-zinc-400 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          SSH into your EC2 instance and run:
        </p>
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 mb-4">
          <code className="text-sm text-cyan-300 flex-1 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {cmd}
          </code>
          <button
            onClick={handleCopy}
            className={`text-xs px-2.5 py-1.5 rounded border transition-colors shrink-0 ${
              copied
                ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                : 'text-zinc-400 border-zinc-700 hover:text-zinc-200 hover:border-zinc-600'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:text-zinc-200 hover:border-zinc-600 transition-colors"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}

// ── Collapsible flag/gap sections ────────────────────────────────────────────

function CollapsibleSection({
  title,
  count,
  accent,
  children,
}: {
  title: string
  count: number
  accent: 'amber' | 'violet'
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const colors = {
    amber: { border: 'border-amber-500/25', bg: 'bg-amber-500/8', text: 'text-amber-400', badge: 'border-amber-500/30 bg-amber-500/15 text-amber-300' },
    violet: { border: 'border-violet-500/25', bg: 'bg-violet-500/8', text: 'text-violet-400', badge: 'border-violet-500/30 bg-violet-500/15 text-violet-300' },
  }
  const c = colors[accent]

  if (count === 0) return null

  return (
    <div className={`border ${c.border} rounded-lg overflow-hidden`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-2.5 px-4 py-3 ${open ? c.bg : 'hover:bg-zinc-800/20'} transition-colors text-left`}
      >
        {accent === 'amber' ? (
          <AlertTriangle className={`w-3.5 h-3.5 ${c.text} shrink-0`} strokeWidth={1.5} />
        ) : (
          <ShieldCheck className={`w-3.5 h-3.5 ${c.text} shrink-0`} strokeWidth={1.5} />
        )}
        <span className={`text-xs font-semibold ${c.text}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {title}
        </span>
        <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${c.badge}`}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {count}
        </span>
        <span className={`ml-auto text-[10px] ${c.text} opacity-60`}>
          {open ? 'collapse' : 'expand'}
        </span>
      </button>
      {open && <div className={`${c.bg} border-t ${c.border}`}>{children}</div>}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function VerdictAndReporting({
  latestRun,
  runs,
  epics,
  thinAssertions,
  coverageGaps,
  agentComparisons,
  activeTestCaseId: initialActiveId,
  activeTab: initialTab,
  onSelectTestCase,
  onClosePanel,
  onEmitFixPrompt,
  onRunValidation,
  onExportReport,
  onSelectRun,
  onTabChange,
}: VerdictAndReportingProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab)
  const [activeTestCaseId, setActiveTestCaseId] = useState<string | null>(initialActiveId)
  const [showRunModal, setShowRunModal] = useState(false)
  const [activeRunId, setActiveRunId] = useState(latestRun.id)

  const hasMultipleAgents = new Set(runs.map((r) => r.buildAgent)).size > 1
  const thinAssertionIds = new Set(thinAssertions.map((t) => t.testCaseId))
  const activeTestCase = activeTestCaseId ? findTestCase(epics, activeTestCaseId) : null

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  const handleSelectTestCase = (id: string) => {
    setActiveTestCaseId(id)
    onSelectTestCase?.(id)
  }

  const handleClosePanel = () => {
    setActiveTestCaseId(null)
    onClosePanel?.()
  }

  const handleRunValidation = () => {
    setShowRunModal(true)
    onRunValidation?.()
  }

  const handleExportReport = () => {
    window.open('/report.html', '_blank')
    onExportReport?.()
  }

  const handleSelectRun = (runId: string) => {
    setActiveRunId(runId)
    onSelectRun?.(runId)
  }

  const tabs = [
    { id: 'verdict' as ActiveTab, label: 'Verdict', icon: ShieldCheck },
    { id: 'history' as ActiveTab, label: 'History', icon: History },
    ...(hasMultipleAgents ? [{ id: 'compare' as ActiveTab, label: 'Compare Agents', icon: GitCompare }] : []),
  ]

  return (
    <div className="flex h-full bg-zinc-950 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Page header + tabs */}
        <div className="px-6 pt-5 pb-0 shrink-0">
          <div className="mb-4">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Phase 03
            </p>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Verdict & Reporting
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-zinc-800">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                    isActive
                      ? 'border-cyan-400 text-cyan-300'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'verdict' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <RunHeader
              run={latestRun}
              onRunValidation={handleRunValidation}
              onExportReport={handleExportReport}
            />
            <div className="flex-1 overflow-y-auto">
              {/* Flags + gaps */}
              <div className="px-4 py-4 space-y-3">
                <CollapsibleSection
                  title="Thin-Assertion Flags"
                  count={thinAssertions.length}
                  accent="amber"
                >
                  <div className="divide-y divide-amber-500/10">
                    {thinAssertions.map((flag) => (
                      <div key={flag.testCaseId} className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-mono text-amber-400/70"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {flag.testCaseId}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {flag.testCaseTitle}
                        </p>
                        <p className="text-[11px] text-zinc-500 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {flag.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Coverage Gaps"
                  count={coverageGaps.length}
                  accent="violet"
                >
                  <div className="divide-y divide-violet-500/10">
                    {coverageGaps.map((gap) => (
                      <div key={gap.sectionId} className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-zinc-200"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {gap.sectionName}
                          </span>
                          <span className="text-[10px] text-violet-400/60 font-mono"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {gap.epicName}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {gap.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              </div>

              {/* Result tree */}
              <div className="border-t border-zinc-800">
                <div className="px-4 py-2 flex items-center gap-2">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Results
                  </p>
                  <p className="text-[10px] text-zinc-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Click a test case to inspect
                  </p>
                </div>
                <ResultTree
                  epics={epics}
                  activeTestCaseId={activeTestCaseId}
                  thinAssertionIds={thinAssertionIds}
                  onSelectTestCase={handleSelectTestCase}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryTab runs={runs} activeRunId={activeRunId} onSelectRun={handleSelectRun} />
        )}

        {activeTab === 'compare' && (
          <CompareAgentsTab agentComparisons={agentComparisons} runs={runs} />
        )}
      </div>

      {/* Slide-over */}
      {activeTestCase && (
        <TestCaseSlideOver
          testCase={activeTestCase}
          onClose={handleClosePanel}
          onEmitFixPrompt={onEmitFixPrompt}
        />
      )}

      {/* Run validation modal */}
      {showRunModal && <RunValidationModal onClose={() => setShowRunModal(false)} />}
    </div>
  )
}
