import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Lock, RotateCcw } from 'lucide-react'
import { AppShell } from './components/shell'
import { TestFoundation } from './features/test-foundation'
import { useFoundationState } from './features/test-foundation/useFoundationState'
import { SectionValidation } from './features/section-validation'
import { useSectionValidationState } from './features/section-validation/useSectionValidationState'

const ROUTES = {
  foundation: '/foundation',
  validation: '/validation',
  verdict: '/verdict',
  deployment: '/deployment',
  runs: '/runs',
  inspector: '/inspector',
  settings: '/settings',
  help: '/help',
} as const

const routeTitles: Record<string, string> = {
  [ROUTES.validation]: 'Section Validation',
  [ROUTES.verdict]: 'Verdict & Reporting',
  [ROUTES.deployment]: 'Deployment & Automation',
  [ROUTES.runs]: 'Run History',
  [ROUTES.inspector]: 'Suite Inspector',
  [ROUTES.settings]: 'Settings',
  [ROUTES.help]: 'Help / Docs',
}

function normalizePath(pathname: string) {
  return Object.values(ROUTES).includes(pathname as (typeof ROUTES)[keyof typeof ROUTES])
    ? pathname
    : ROUTES.foundation
}

function useLocalRoute() {
  const [activeHref, setActiveHref] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    if (window.location.pathname !== activeHref) {
      window.history.replaceState({}, '', activeHref)
    }

    const onPopState = () => setActiveHref(normalizePath(window.location.pathname))
    window.addEventListener('popstate', onPopState)

    return () => window.removeEventListener('popstate', onPopState)
  }, [activeHref])

  const navigate = (href: string) => {
    const nextHref = normalizePath(href)
    window.history.pushState({}, '', nextHref)
    setActiveHref(nextHref)
  }

  return { activeHref, navigate }
}

function LockedRoutePlaceholder({
  title,
  foundationLocked,
  validationComplete,
  onGoFoundation,
}: {
  title: string
  foundationLocked: boolean
  validationComplete: boolean
  onGoFoundation: () => void
}) {
  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8">
      <div className="max-w-3xl border border-zinc-800 bg-zinc-900/50 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/10">
            <Lock className="h-5 w-5 text-violet-300" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
              Future milestone
            </p>
            <h1 className="mt-1 font-heading text-2xl font-bold text-white">{title}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
              This route is visible in the shell now, but implementation is intentionally held for
              its own milestone. Test Foundation remains the active section for this pass.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 font-mono text-xs text-zinc-500">
                foundation: {foundationLocked ? 'locked' : 'in progress'}
              </span>
              <span className="rounded border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 font-mono text-xs text-zinc-500">
                validation: {validationComplete ? 'complete' : 'authoring'}
              </span>
              <button
                onClick={onGoFoundation}
                className="inline-flex items-center gap-2 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20"
              >
                Back to Foundation
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function App() {
  const { activeHref, navigate } = useLocalRoute()
  const foundation = useFoundationState()
  const validation = useSectionValidationState()
  const isFoundationLocked = foundation.phase.status === 'locked'
  const runCount = useMemo(
    () => (validation.phaseComplete ? 2 : isFoundationLocked ? 1 : 0),
    [isFoundationLocked, validation.phaseComplete]
  )

  return (
    <AppShell
      activeHref={activeHref}
      onNavigate={navigate}
      onLogout={() => undefined}
      runCount={runCount}
      user={{ name: 'Alex Morgan', email: 'alex@test-os.local' }}
    >
      {activeHref === ROUTES.foundation ? (
        <div className="relative">
          <TestFoundation
            phase={foundation.phase}
            steps={foundation.steps}
            onEditField={foundation.editField}
            onConfirmStep={foundation.confirmStep}
            onApproveAndLock={foundation.approveAndLock}
          />
          <button
            type="button"
            onClick={foundation.reset}
            className="fixed bottom-4 right-4 inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/95 px-3 py-2 text-xs font-medium text-zinc-400 shadow-xl shadow-black/30 transition hover:border-zinc-700 hover:text-zinc-200"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.8} />
            Reset demo state
          </button>
        </div>
      ) : activeHref === ROUTES.validation ? (
        <div className="relative h-full">
          <SectionValidation
            epics={validation.epics}
            suites={validation.suites}
            stories={validation.stories}
            screenshots={validation.screenshots}
            activeSuiteId={validation.activeSuiteId}
            activeStoryId={validation.activeStoryId}
            filter={validation.filter}
            shapeSuiteContent={validation.shapeSuiteContent}
            suiteFixturesContent={validation.suiteFixturesContent}
            onSelectSuite={validation.selectSuite}
            onSelectStory={validation.selectStory}
            onFilterChange={validation.updateFilter}
            onMarkComplete={validation.markComplete}
            onResetSuite={validation.resetSuite}
            onToggleStep={validation.toggleStep}
          />
          <button
            type="button"
            onClick={validation.resetDemoState}
            className="fixed bottom-4 right-4 inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/95 px-3 py-2 text-xs font-medium text-zinc-400 shadow-xl shadow-black/30 transition hover:border-zinc-700 hover:text-zinc-200"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.8} />
            Reset validation demo
          </button>
        </div>
      ) : (
        <LockedRoutePlaceholder
          title={routeTitles[activeHref] ?? 'Test OS'}
          foundationLocked={isFoundationLocked}
          validationComplete={validation.phaseComplete}
          onGoFoundation={() => navigate(ROUTES.foundation)}
        />
      )}
    </AppShell>
  )
}
