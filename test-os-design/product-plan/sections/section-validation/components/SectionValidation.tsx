import { useState } from 'react'
import { PanelLeftClose, PanelLeftOpen, CheckCircle2 } from 'lucide-react'
import type { SectionValidationProps, SuiteFilter } from '../types'
import { SuiteListPanel } from './SuiteListPanel'
import { SuiteDetail } from './SuiteDetail'

export function SectionValidation({
  epics,
  suites: initialSuites,
  stories,
  screenshots,
  activeSuiteId: initialActiveSuiteId,
  activeStoryId: initialActiveStoryId,
  filter: initialFilter,
  shapeSuiteContent,
  suiteFixturesContent,
  maxScreenshotsPerStory = 5,
  onSelectSuite,
  onMarkComplete,
  onResetSuite,
  onFilterChange,
  onSelectStory,
  onToggleStep,
}: SectionValidationProps) {
  const [suites, setSuites] = useState(initialSuites)
  const [activeSuiteId, setActiveSuiteId] = useState(initialActiveSuiteId)
  const [activeStoryId, setActiveStoryId] = useState(initialActiveStoryId)
  const [filter, setFilter] = useState<SuiteFilter>(initialFilter)
  const [leftOpen, setLeftOpen] = useState(true)
  const [phaseComplete, setPhaseComplete] = useState(false)

  const activeSuite = suites.find((s) => s.id === activeSuiteId) ?? null
  const suiteStories = stories.filter((s) => s.suiteId === activeSuiteId)
  const suiteScreenshots = screenshots.filter((ss) =>
    suiteStories.some((s) => s.id === ss.storyId)
  )

  const handleSelectSuite = (suiteId: string) => {
    setActiveSuiteId(suiteId)
    onSelectSuite?.(suiteId)
  }

  const handleFilterChange = (f: SuiteFilter) => {
    setFilter(f)
    onFilterChange?.(f)
  }

  const handleSelectStory = (storyId: string) => {
    setActiveStoryId(storyId)
    onSelectStory?.(storyId)
  }

  const handleMarkComplete = (suiteId: string) => {
    setSuites((prev) =>
      prev.map((s) =>
        s.id === suiteId
          ? { ...s, status: 'complete', completedAt: new Date().toISOString() }
          : s
      )
    )
    onMarkComplete?.(suiteId)
    const remaining = suites.filter((s) => s.id !== suiteId && s.status !== 'complete')
    if (remaining.length === 0) setPhaseComplete(true)
    else {
      const next = remaining[0]
      if (next) setActiveSuiteId(next.id)
    }
  }

  const handleResetSuite = (suiteId: string) => {
    setSuites((prev) =>
      prev.map((s) =>
        s.id === suiteId
          ? {
              ...s,
              status: 'not_started',
              completedAt: null,
              steps: s.steps.map((step) => ({ ...step, status: 'not_started' as const })),
            }
          : s
      )
    )
    onResetSuite?.(suiteId)
  }

  return (
    <div
      className="flex h-full bg-zinc-950"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Phase complete overlay banner */}
      {phaseComplete && (
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border-b border-emerald-500/25">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={1.5} />
          <span
            className="text-sm font-semibold text-emerald-300"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Section Validation complete
          </span>
          <span className="text-xs text-zinc-500">All suites authored — Verdict & Reporting is now unlocked</span>
        </div>
      )}

      {/* Left panel toggle (mobile) */}
      <div className="md:hidden absolute top-3 left-3 z-10">
        <button
          onClick={() => setLeftOpen((v) => !v)}
          className="p-2 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {leftOpen ? (
            <PanelLeftClose className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <PanelLeftOpen className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Left panel (suite list) */}
      <aside
        className={`
          shrink-0 border-r border-zinc-800 overflow-hidden transition-all duration-200
          ${leftOpen ? 'w-60' : 'w-0'}
          hidden md:flex md:flex-col
        `}
      >
        <SuiteListPanel
          epics={epics}
          suites={suites}
          activeSuiteId={activeSuiteId}
          filter={filter}
          onSelectSuite={handleSelectSuite}
          onFilterChange={handleFilterChange}
        />
      </aside>

      {/* Right panel (suite detail) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {activeSuite ? (
          <SuiteDetail
            suite={activeSuite}
            epics={epics}
            stories={suiteStories}
            screenshots={suiteScreenshots}
            activeStoryId={activeStoryId}
            maxScreenshotsPerStory={maxScreenshotsPerStory}
            shapeSuiteContent={shapeSuiteContent?.suiteId === activeSuiteId ? shapeSuiteContent : undefined}
            suiteFixturesContent={suiteFixturesContent?.suiteId === activeSuiteId ? suiteFixturesContent : undefined}
            onMarkComplete={handleMarkComplete}
            onResetSuite={handleResetSuite}
            onSelectStory={handleSelectStory}
            onToggleStep={onToggleStep}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 p-8">
            <div className="w-12 h-12 rounded-xl border border-zinc-800 flex items-center justify-center">
              <PanelLeftOpen className="w-5 h-5 text-zinc-600" strokeWidth={1} />
            </div>
            <p
              className="text-sm font-medium text-zinc-400"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Select a suite
            </p>
            <p className="text-xs text-zinc-600 max-w-xs">
              Choose a section from the left panel to start authoring its test suite.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
