import { Check, Lock } from 'lucide-react'
import type { FoundationStep } from '../types'

interface StepPipelineProps {
  steps: FoundationStep[]
}

export function StepPipeline({ steps }: StepPipelineProps) {
  return (
    <div className="flex items-start justify-center gap-0 px-6 py-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start">
          {/* Node + label */}
          <div className="flex flex-col items-center gap-2 w-20">
            <div
              className={`
                relative flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300
                ${
                  step.status === 'complete'
                    ? 'bg-cyan-500/15 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : step.status === 'active'
                      ? 'bg-zinc-900 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.4)]'
                      : 'bg-zinc-900/50 border-zinc-700/50'
                }
              `}
            >
              {step.status === 'complete' ? (
                <Check className="w-4 h-4 text-cyan-400" strokeWidth={2.5} />
              ) : step.status === 'active' ? (
                <>
                  <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-25" />
                  <span
                    className="text-[11px] font-bold text-cyan-300"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {String(step.order).padStart(2, '0')}
                  </span>
                </>
              ) : (
                <Lock className="w-3.5 h-3.5 text-zinc-600" strokeWidth={2} />
              )}
            </div>
            <span
              className={`text-[10px] text-center leading-tight px-1 transition-colors ${
                step.status === 'complete'
                  ? 'text-cyan-400/80'
                  : step.status === 'active'
                    ? 'text-zinc-200'
                    : 'text-zinc-600'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {step.label}
            </span>
          </div>

          {/* Connector */}
          {index < steps.length - 1 && (
            <div className="flex items-center mt-4 w-6 shrink-0">
              <div
                className={`w-full h-px transition-colors duration-500 ${
                  step.status === 'complete' ? 'bg-cyan-500/40' : 'bg-zinc-800'
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
