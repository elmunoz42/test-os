import { useState } from 'react'
import { X, ClipboardCopy, Check, AlertTriangle } from 'lucide-react'
import type { TestCase } from '@/../product/sections/verdict-and-reporting/types'

// ── Gherkin syntax highlighting ─────────────────────────────────────────────

function GherkinLine({ line }: { line: string }) {
  const trimmed = line.trimStart()
  let cls = 'text-zinc-400'
  if (/^(Feature:|Scenario:|Background:|Scenario Outline:)/.test(trimmed)) {
    cls = 'text-cyan-400 font-semibold'
  } else if (/^(Given|When|Then|And|But)\b/.test(trimmed)) {
    cls = 'text-violet-400'
  } else if (/^@/.test(trimmed)) {
    cls = 'text-emerald-400 text-[10px]'
  } else if (trimmed === '') {
    return <div className="h-1.5" />
  }
  return (
    <div className={`leading-relaxed ${cls}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>
      {line}
    </div>
  )
}

// ── Expected vs Actual JSON comparison ──────────────────────────────────────

function JsonBlock({
  label,
  data,
  compareWith,
  variant,
}: {
  label: string
  data: Record<string, unknown> | null
  compareWith?: Record<string, unknown> | null
  variant: 'expected' | 'actual'
}) {
  if (!data) return null
  const accentClass = variant === 'expected' ? 'text-cyan-400/80' : 'text-zinc-400'
  const borderClass = variant === 'expected' ? 'border-zinc-700' : 'border-zinc-700'

  return (
    <div>
      <p
        className={`text-[10px] uppercase tracking-widest mb-1.5 ${accentClass}`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {label}
      </p>
      <div className={`bg-zinc-950 border ${borderClass} rounded-lg px-3 py-2.5 space-y-1`}>
        {Object.entries(data).map(([key, value]) => {
          const expected = compareWith?.[key]
          const mismatch = variant === 'actual' && compareWith && JSON.stringify(value) !== JSON.stringify(expected)
          return (
            <div key={key} className="flex items-start gap-2 font-mono text-[11px]">
              <span className="text-zinc-600 shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {key}:
              </span>
              <span
                className={mismatch ? 'text-red-400 font-semibold' : 'text-zinc-300'}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {JSON.stringify(value)}
              </span>
              {mismatch && <span className="text-red-500/60 text-[10px] ml-auto shrink-0">✗ mismatch</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Slide-over panel ─────────────────────────────────────────────────────────

interface TestCaseSlideOverProps {
  testCase: TestCase | null
  onClose?: () => void
  onEmitFixPrompt?: (testCaseId: string) => void
}

export function TestCaseSlideOver({ testCase, onClose, onEmitFixPrompt }: TestCaseSlideOverProps) {
  const [copied, setCopied] = useState(false)

  if (!testCase) return null

  const isFail = testCase.status === 'failed'

  const handleEmitFixPrompt = async () => {
    if (testCase.fixPrompt) {
      try {
        await navigator.clipboard.writeText(testCase.fixPrompt)
      } catch {
        // fallback: just call the callback
      }
    }
    onEmitFixPrompt?.(testCase.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className="fixed inset-0 bg-black/40 z-20 md:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] z-30 flex flex-col bg-zinc-950 border-l border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-zinc-800 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="text-[10px] font-mono text-zinc-600"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {testCase.id}
              </span>
              <span
                className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${
                  isFail
                    ? 'text-red-400 border-red-500/30 bg-red-500/10'
                    : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                }`}
              >
                {testCase.status}
              </span>
              {testCase.thinAssertionFlag && (
                <span className="text-[10px] font-mono text-amber-400 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" strokeWidth={2} />
                  thin
                </span>
              )}
            </div>
            <h3
              className="text-sm font-semibold text-white leading-snug"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {testCase.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Error message */}
          {testCase.errorMessage && (
            <div className="flex gap-2 p-3 rounded-lg bg-red-500/8 border border-red-500/25">
              <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" strokeWidth={2} />
              <p
                className="text-xs text-red-300 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {testCase.errorMessage}
              </p>
            </div>
          )}

          {/* Gherkin */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p
                className="text-[10px] uppercase tracking-widest text-zinc-500"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Gherkin
              </p>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-zinc-800/50 bg-zinc-900/80">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
              </div>
              <div className="px-4 py-3">
                {testCase.gherkin.split('\n').map((line, i) => (
                  <GherkinLine key={i} line={line} />
                ))}
              </div>
            </div>
          </div>

          {/* Expected / Actual */}
          <div className="space-y-3">
            <JsonBlock
              label="Expected"
              data={testCase.expectedBehavior as Record<string, unknown>}
              variant="expected"
            />
            {testCase.actualResult && (
              <JsonBlock
                label="Actual"
                data={testCase.actualResult as Record<string, unknown>}
                compareWith={testCase.expectedBehavior as Record<string, unknown>}
                variant="actual"
              />
            )}
          </div>

          {/* Screenshot placeholder */}
          {testCase.screenshotUrl && (
            <div>
              <p
                className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Screenshot
              </p>
              <div className="h-32 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                <p
                  className="text-xs text-zinc-600"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {testCase.screenshotUrl}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Fix Prompt CTA */}
        {testCase.fixPrompt && (
          <div className="px-5 py-4 border-t border-zinc-800 shrink-0">
            <button
              onClick={handleEmitFixPrompt}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                copied
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                  : 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-400'
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardCopy className="w-4 h-4" strokeWidth={1.5} />
                  Emit Fix Prompt
                </>
              )}
            </button>
            <p
              className="text-[10px] text-zinc-600 text-center mt-1.5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Oracle values are redacted from this prompt
            </p>
          </div>
        )}
      </div>
    </>
  )
}
