import { useState } from 'react'
import {
  ChevronDown,
  Check,
  MoreHorizontal,
  CheckCircle2,
  RotateCcw,
  Camera,
  ImageOff,
} from 'lucide-react'
import type {
  SectionSuite,
  Epic,
  UserStory,
  Screenshot,
  ShapeSuiteContent,
  SuiteFixturesContent,
  StepId,
  Priority,
} from '../types'

// ── Gherkin syntax highlighter ─────────────────────────────────────────────

function GherkinLine({ line }: { line: string }) {
  const trimmed = line.trimStart()
  let cls = 'text-zinc-400'
  if (/^(Feature:|Scenario:|Background:|Scenario Outline:)/.test(trimmed)) {
    cls = 'text-cyan-400 font-semibold'
  } else if (/^(Given|When|Then|And|But)\b/.test(trimmed)) {
    cls = 'text-violet-400'
  } else if (/^@/.test(trimmed)) {
    cls = 'text-emerald-400 text-[11px]'
  } else if (/^\s*#/.test(trimmed)) {
    cls = 'text-zinc-600 italic'
  } else if (trimmed === '') {
    return <div className="h-2" />
  }
  return (
    <div className={`leading-relaxed ${cls}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>
      {line || ' '}
    </div>
  )
}

function GherkinViewer({ gherkin }: { gherkin: string }) {
  return (
    <div className="h-full bg-zinc-950 overflow-y-auto">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-zinc-800/50 bg-zinc-900/50">
        <span className="w-2 h-2 rounded-full bg-red-500/50" />
        <span className="w-2 h-2 rounded-full bg-amber-500/50" />
        <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
        <span
          className="ml-2 text-[9px] text-zinc-600"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          .feature
        </span>
      </div>
      <div className="px-4 py-3">
        {gherkin.split('\n').map((line, i) => (
          <GherkinLine key={i} line={line} />
        ))}
      </div>
    </div>
  )
}

// ── Author Tests step body ──────────────────────────────────────────────────

function priorityDot(priority: Priority) {
  const colors: Record<Priority, string> = {
    high: 'text-red-400',
    medium: 'text-amber-400',
    low: 'text-zinc-500',
  }
  return <span className={`text-[9px] font-mono uppercase ${colors[priority]}`}>{priority}</span>
}

interface AuthorTestsBodyProps {
  stories: UserStory[]
  activeStoryId: string | null
  onSelectStory?: (storyId: string) => void
}

function AuthorTestsBody({ stories, activeStoryId, onSelectStory }: AuthorTestsBodyProps) {
  const activeStory = stories.find((s) => s.id === activeStoryId) ?? stories[0] ?? null

  if (stories.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-center px-4">
        <p className="text-xs text-zinc-600" style={{ fontFamily: "'Inter', sans-serif" }}>
          Complete /shape-suite first to generate stories.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-72 border-t border-zinc-800">
      {/* Story list */}
      <div className="w-48 shrink-0 border-r border-zinc-800 overflow-y-auto">
        {stories.map((story) => {
          const isActive = story.id === (activeStoryId ?? stories[0]?.id)
          return (
            <button
              key={story.id}
              onClick={() => onSelectStory?.(story.id)}
              className={`
                w-full text-left px-3 py-2.5 border-b border-zinc-800/50 transition-colors group relative
                ${isActive ? 'bg-cyan-500/8' : 'hover:bg-zinc-800/40'}
              `}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-cyan-400 rounded-r-full" />
              )}
              <p
                className={`text-[11px] font-medium leading-tight mb-1 ${isActive ? 'text-zinc-100' : 'text-zinc-300'}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {story.title}
              </p>
              <div className="flex items-center gap-1.5">
                {priorityDot(story.priority)}
                {story.captureScreenshot && (
                  <Camera className="w-2.5 h-2.5 text-violet-500/70 ml-auto" strokeWidth={1.5} />
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Gherkin preview */}
      <div className="flex-1 overflow-hidden">
        {activeStory ? (
          <GherkinViewer gherkin={activeStory.gherkin} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-zinc-600">Select a story to view its Gherkin</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Capture Evidence step body ──────────────────────────────────────────────

interface CaptureEvidenceBodyProps {
  screenshots: Screenshot[]
  stories: UserStory[]
  maxScreenshotsPerStory?: number
}

function CaptureEvidenceBody({ screenshots, stories, maxScreenshotsPerStory = 5 }: CaptureEvidenceBodyProps) {
  const captureStories = stories.filter((s) => s.captureScreenshot)

  if (captureStories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-28 gap-2 border-t border-zinc-800 text-center px-4">
        <ImageOff className="w-6 h-6 text-zinc-700" strokeWidth={1} />
        <p className="text-xs text-zinc-600" style={{ fontFamily: "'Inter', sans-serif" }}>
          No stories marked for screenshot capture.
        </p>
      </div>
    )
  }

  return (
    <div className="border-t border-zinc-800 divide-y divide-zinc-800/60">
      {captureStories.map((story) => {
        const storyScreenshots = screenshots
          .filter((ss) => ss.storyId === story.id)
          .sort((a, b) => a.stepIndex - b.stepIndex)
        const capturedCount = storyScreenshots.length

        return (
          <div key={story.id} className="px-4 py-3">
            {/* Story row header */}
            <div className="flex items-center gap-2 mb-2.5">
              <p
                className="text-[11px] font-medium text-zinc-300 truncate flex-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {story.title}
              </p>
              <span
                className={`text-[9px] font-mono shrink-0 tabular-nums ${
                  capturedCount === maxScreenshotsPerStory
                    ? 'text-cyan-400'
                    : capturedCount > 0
                      ? 'text-zinc-400'
                      : 'text-zinc-600'
                }`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {capturedCount}/{maxScreenshotsPerStory}
              </span>
            </div>

            {/* Filmstrip: maxScreenshotsPerStory slots */}
            <div className="flex gap-1.5">
              {Array.from({ length: maxScreenshotsPerStory }).map((_, i) => {
                const ss = storyScreenshots.find((s) => s.stepIndex === i + 1)
                return ss ? (
                  <div
                    key={i}
                    className="flex-1 min-w-0 rounded border border-zinc-700 overflow-hidden group cursor-pointer hover:border-cyan-500/40 transition-colors"
                    title={ss.captureStep}
                  >
                    {/* Placeholder thumbnail */}
                    <div className="h-12 bg-zinc-900 flex items-center justify-center relative">
                      <Camera className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-500/60 transition-colors" strokeWidth={1.5} />
                      <span
                        className="absolute top-1 left-1.5 text-[8px] font-mono text-zinc-600 group-hover:text-zinc-400"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <p
                      className="px-1.5 py-1 text-[8px] text-zinc-500 leading-tight truncate bg-zinc-900/50"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {ss.captureStep}
                    </p>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="flex-1 min-w-0 rounded border border-dashed border-zinc-800 overflow-hidden"
                  >
                    <div className="h-12 flex items-center justify-center">
                      <span
                        className="text-[8px] font-mono text-zinc-700"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <div className="h-5 bg-zinc-900/20" />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main SuiteDetail component ──────────────────────────────────────────────

interface SuiteDetailProps {
  suite: SectionSuite
  epics: Epic[]
  stories: UserStory[]
  screenshots: Screenshot[]
  activeStoryId: string | null
  maxScreenshotsPerStory?: number
  shapeSuiteContent?: ShapeSuiteContent
  suiteFixturesContent?: SuiteFixturesContent
  onMarkComplete?: (suiteId: string) => void
  onResetSuite?: (suiteId: string) => void
  onSelectStory?: (storyId: string) => void
  onToggleStep?: (suiteId: string, stepId: StepId) => void
}

export function SuiteDetail({
  suite,
  epics,
  stories,
  screenshots,
  activeStoryId,
  maxScreenshotsPerStory = 5,
  shapeSuiteContent,
  suiteFixturesContent,
  onMarkComplete,
  onResetSuite,
  onSelectStory,
  onToggleStep,
}: SuiteDetailProps) {
  const epic = epics.find((e) => e.id === suite.epicId)
  const allStepsDone = suite.steps.every((s) => s.status === 'complete')
  const [actionsOpen, setActionsOpen] = useState(false)
  const [openSteps, setOpenSteps] = useState<Set<StepId>>(() => {
    const firstActive = suite.steps.find((s) => s.status === 'in_progress')
    return new Set(firstActive ? [firstActive.id as StepId] : [])
  })

  const toggleStep = (stepId: StepId) => {
    setOpenSteps((prev) => {
      const next = new Set(prev)
      next.has(stepId) ? next.delete(stepId) : next.add(stepId)
      return next
    })
    onToggleStep?.(suite.id, stepId)
  }

  const stepStatusIcon = (status: string) => {
    if (status === 'complete')
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" strokeWidth={2} />
    if (status === 'in_progress')
      return (
        <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
          <span className="animate-ping absolute h-3 w-3 rounded-full bg-cyan-400 opacity-30" />
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
        </span>
      )
    return (
      <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-zinc-700 flex items-center justify-center">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
      </span>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Suite header */}
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-zinc-800 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2
              className="text-lg font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {suite.name}
            </h2>
            {epic && (
              <span
                className="text-[10px] text-violet-400 font-mono border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 rounded"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {epic.name}
              </span>
            )}
            {suite.status === 'complete' && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <Check className="w-2.5 h-2.5" strokeWidth={2.5} />
                complete
              </span>
            )}
          </div>
          <p
            className="text-xs text-zinc-500 mt-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {suite.steps.filter((s) => s.status === 'complete').length}/4 steps done
          </p>
        </div>

        {/* Actions */}
        <div className="relative shrink-0">
          <button
            onClick={() => setActionsOpen((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors text-xs"
          >
            <MoreHorizontal className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
          {actionsOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-10">
              <button
                disabled={!allStepsDone}
                onClick={() => {
                  setActionsOpen(false)
                  onMarkComplete?.(suite.id)
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${
                  allStepsDone
                    ? 'text-emerald-400 hover:bg-zinc-800'
                    : 'text-zinc-600 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                <span>Mark complete</span>
                {!allStepsDone && (
                  <span className="ml-auto text-[9px] text-zinc-700 font-mono">4/4 required</span>
                )}
              </button>
              <div className="border-t border-zinc-800" />
              <button
                onClick={() => {
                  setActionsOpen(false)
                  onResetSuite?.(suite.id)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-red-400 hover:bg-zinc-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                Reset suite
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Accordion */}
      <div className="flex-1 overflow-y-auto">
        {suite.steps.map((step) => {
          const isOpen = openSteps.has(step.id as StepId)

          return (
            <div key={step.id} className="border-b border-zinc-800">
              <button
                onClick={() => toggleStep(step.id as StepId)}
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-800/30 transition-colors text-left"
              >
                {stepStatusIcon(step.status)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[10px] text-violet-400 font-mono"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {step.command}
                    </span>
                    <span
                      className="text-sm font-semibold text-zinc-200"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {step.label}
                    </span>
                  </div>
                  <p
                    className="text-[11px] text-zinc-500 mt-0.5 leading-tight"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {step.description}
                  </p>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-zinc-600 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  strokeWidth={1.5}
                />
              </button>

              {isOpen && (
                <div className="bg-zinc-900/30">
                  {step.id === 'shape-suite' && shapeSuiteContent && (
                    <div className="px-5 py-4 space-y-3">
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Scope</p>
                        <p className="text-xs text-zinc-300 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{shapeSuiteContent.scopeDescription}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Coverage Notes</p>
                        <p className="text-xs text-zinc-400 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{shapeSuiteContent.coverageNotes}</p>
                      </div>
                    </div>
                  )}

                  {step.id === 'suite-fixtures' && suiteFixturesContent && (
                    <div className="bg-zinc-950 border-t border-zinc-800 overflow-x-auto">
                      <pre
                        className="px-5 py-4 text-[11px] text-zinc-400 leading-relaxed max-h-48 overflow-y-auto"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {suiteFixturesContent.fixtureJson}
                      </pre>
                    </div>
                  )}

                  {step.id === 'author-tests' && (
                    <AuthorTestsBody
                      stories={stories}
                      activeStoryId={activeStoryId}
                      onSelectStory={onSelectStory}
                    />
                  )}

                  {step.id === 'capture-evidence' && (
                    <CaptureEvidenceBody
                      screenshots={screenshots}
                      stories={stories}
                      maxScreenshotsPerStory={maxScreenshotsPerStory}
                    />
                  )}

                  {step.id !== 'shape-suite' &&
                    step.id !== 'suite-fixtures' &&
                    step.id !== 'author-tests' &&
                    step.id !== 'capture-evidence' && (
                      <div className="px-5 py-4">
                        <p className="text-xs text-zinc-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Content coming soon.
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>
          )
        })}

        {/* Phase-complete banner */}
        {suite.status === 'complete' && (
          <div className="m-4 flex items-center gap-3 px-4 py-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={1.5} />
            <p className="text-xs text-emerald-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Suite sealed · all 4 steps complete
            </p>
            {suite.completedAt && (
              <span
                className="ml-auto text-[10px] text-zinc-600 shrink-0"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {new Date(suite.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
