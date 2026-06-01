import { useState } from 'react'
import { ChevronRight, Check, X, AlertTriangle } from 'lucide-react'
import type { Epic, TestCase } from '../types'

interface ResultTreeProps {
  epics: Epic[]
  activeTestCaseId: string | null
  thinAssertionIds: Set<string>
  onSelectTestCase?: (testCaseId: string) => void
}

function passBar(passed: number, total: number) {
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0
  const hasFail = passed < total
  return (
    <div className="flex items-center gap-2 ml-auto">
      <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
        <div
          className={`h-full rounded-full ${hasFail ? 'bg-emerald-500' : 'bg-cyan-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`text-[10px] font-mono tabular-nums shrink-0 ${hasFail ? 'text-red-400' : 'text-emerald-500'}`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {passed}/{passed + (total - passed)}
      </span>
    </div>
  )
}

export function ResultTree({
  epics,
  activeTestCaseId,
  thinAssertionIds,
  onSelectTestCase,
}: ResultTreeProps) {
  // Default: expand epics/sections that have failures
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const ids = new Set<string>()
    for (const epic of epics) {
      if (epic.failed > 0) {
        ids.add(epic.id)
        for (const section of epic.sections) {
          if (section.failed > 0) {
            ids.add(section.id)
            for (const story of section.stories) {
              if (story.failed > 0) ids.add(story.id)
            }
          }
        }
      }
    }
    return ids
  })

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="divide-y divide-zinc-800/50">
      {epics.map((epic) => {
        const epicOpen = expanded.has(epic.id)
        const epicFailed = epic.failed > 0
        const epicTotal = epic.passed + epic.failed

        return (
          <div key={epic.id}>
            {/* Epic row */}
            <button
              onClick={() => toggle(epic.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-3 hover:bg-zinc-800/30 transition-colors text-left relative group ${epicFailed ? 'border-l-2 border-red-500/40' : ''}`}
            >
              <ChevronRight
                className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${epicOpen ? 'rotate-90' : ''}`}
                strokeWidth={2}
              />
              <span
                className={`text-sm font-bold ${epicFailed ? 'text-zinc-100' : 'text-zinc-300'}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {epic.name}
              </span>
              {passBar(epic.passed, epicTotal)}
            </button>

            {epicOpen && epic.sections.map((section) => {
              const secOpen = expanded.has(section.id)
              const secFailed = section.failed > 0
              const secTotal = section.passed + section.failed

              return (
                <div key={section.id}>
                  {/* Section row */}
                  <button
                    onClick={() => toggle(section.id)}
                    className={`w-full flex items-center gap-2.5 pl-9 pr-4 py-2.5 hover:bg-zinc-800/20 transition-colors text-left relative ${secFailed ? 'border-l-2 border-red-500/30' : ''}`}
                  >
                    <ChevronRight
                      className={`w-3 h-3 text-zinc-600 shrink-0 transition-transform ${secOpen ? 'rotate-90' : ''}`}
                      strokeWidth={2}
                    />
                    <span
                      className={`text-xs font-semibold ${secFailed ? 'text-zinc-200' : 'text-zinc-400'}`}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {section.name}
                    </span>
                    {passBar(section.passed, secTotal)}
                  </button>

                  {secOpen && section.stories.map((story) => {
                    const storyOpen = expanded.has(story.id)
                    const storyFailed = story.failed > 0

                    return (
                      <div key={story.id}>
                        {/* Story row */}
                        <button
                          onClick={() => toggle(story.id)}
                          className={`w-full flex items-center gap-2 pl-14 pr-4 py-2 hover:bg-zinc-800/20 transition-colors text-left relative ${storyFailed ? 'border-l-2 border-red-500/20' : ''}`}
                        >
                          <ChevronRight
                            className={`w-3 h-3 text-zinc-700 shrink-0 transition-transform ${storyOpen ? 'rotate-90' : ''}`}
                            strokeWidth={2}
                          />
                          {storyFailed ? (
                            <X className="w-3 h-3 text-red-400 shrink-0" strokeWidth={2.5} />
                          ) : (
                            <Check className="w-3 h-3 text-emerald-500/60 shrink-0" strokeWidth={2.5} />
                          )}
                          <span
                            className={`text-xs ${storyFailed ? 'text-zinc-300' : 'text-zinc-500'} truncate flex-1`}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {story.title}
                          </span>
                          <span
                            className={`text-[9px] font-mono shrink-0 tabular-nums ${storyFailed ? 'text-red-400' : 'text-zinc-600'}`}
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {story.passed}/{story.passed + story.failed}
                          </span>
                        </button>

                        {storyOpen && story.testCases.map((tc: TestCase) => {
                          const isActive = tc.id === activeTestCaseId
                          const isFail = tc.status === 'failed'
                          const isThin = thinAssertionIds.has(tc.id)

                          return (
                            <button
                              key={tc.id}
                              onClick={() => onSelectTestCase?.(tc.id)}
                              className={`
                                w-full flex items-center gap-2 pl-20 pr-4 py-2 text-left transition-all relative group
                                ${isActive ? 'bg-cyan-500/8' : 'hover:bg-zinc-800/20'}
                                ${isFail ? 'border-l-2 border-red-500/40' : ''}
                              `}
                            >
                              {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-cyan-400 rounded-r-full" />
                              )}
                              {isFail ? (
                                <X className="w-3 h-3 text-red-400 shrink-0" strokeWidth={2.5} />
                              ) : (
                                <Check className="w-3 h-3 text-emerald-500 shrink-0" strokeWidth={2.5} />
                              )}
                              <span
                                className="text-[10px] font-mono text-zinc-600 shrink-0 w-24 truncate"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                              >
                                {tc.id}
                              </span>
                              <span
                                className={`text-[11px] flex-1 min-w-0 truncate ${isFail ? 'text-zinc-300' : 'text-zinc-500'}`}
                                style={{ fontFamily: "'Inter', sans-serif" }}
                              >
                                {tc.title}
                              </span>
                              {isThin && (
                                <AlertTriangle
                                  className="w-3 h-3 text-amber-400/80 shrink-0"
                                  strokeWidth={2}
                                  title="Thin assertion"
                                />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
