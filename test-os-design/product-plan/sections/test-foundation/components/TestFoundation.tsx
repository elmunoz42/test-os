import { useState } from 'react'
import { ShieldCheck, Lock } from 'lucide-react'
import type { TestFoundationProps } from '../types'
import { StepPipeline } from './StepPipeline'
import { CompletedStepRow, LockedStepRow, ActiveStepPanel } from './StepPanel'

export function TestFoundation({
  phase,
  steps,
  onConfirmStep,
  onEditField,
  onApproveAndLock,
}: TestFoundationProps) {
  // Local field value state — initialized from props, updated optimistically
  const [fieldValues, setFieldValues] = useState<Record<string, Record<string, string>>>(() =>
    Object.fromEntries(
      steps.map((step) => [
        step.id,
        Object.fromEntries(step.editableFields.map((f) => [f.key, f.value])),
      ])
    )
  )

  const handleFieldChange = (stepId: string, fieldKey: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [stepId]: { ...prev[stepId], [fieldKey]: value },
    }))
    onEditField?.(stepId, fieldKey, value)
  }

  const handleConfirmStep = (stepId: string) => {
    onConfirmStep?.(stepId, fieldValues[stepId] ?? {})
  }

  const isLocked = phase.status === 'locked'
  const allConfirmed =
    phase.status === 'all_confirmed' || steps.every((s) => s.status === 'complete')

  return (
    <div
      className="min-h-full bg-zinc-950"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Foundation Locked Banner */}
      {isLocked && (
        <div className="flex items-center gap-3 px-6 py-3 bg-cyan-500/10 border-b border-cyan-500/20">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0" strokeWidth={1.5} />
          <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
            <span
              className="text-sm font-semibold text-cyan-300"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Foundation Locked
            </span>
            {phase.lockedAt && (
              <span
                className="text-xs text-zinc-500"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                sealed {new Date(phase.lockedAt).toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-500 shrink-0">Section Validation is now unlocked</span>
        </div>
      )}

      {/* Page header */}
      <div className="px-6 pt-8 pb-2">
        <p
          className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Phase 01
        </p>
        <h1
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Test Foundation
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
          Establish the validation charter, coverage map, oracle data, testing standards, and
          executor config before any test authoring begins. Steps must be completed in order.
        </p>
      </div>

      {/* Step pipeline */}
      <StepPipeline steps={steps} />

      {/* Steps */}
      <div className="px-6 pb-8 flex flex-col gap-3 max-w-3xl">
        {steps.map((step) => {
          if (step.status === 'complete') {
            return <CompletedStepRow key={step.id} step={step} />
          }
          if (step.status === 'active') {
            return (
              <ActiveStepPanel
                key={step.id}
                step={step}
                fieldValues={fieldValues[step.id] ?? {}}
                onFieldChange={(key, val) => handleFieldChange(step.id, key, val)}
                onConfirm={() => handleConfirmStep(step.id)}
              />
            )
          }
          return <LockedStepRow key={step.id} step={step} />
        })}

        {/* Approve & Lock CTA */}
        {allConfirmed && !isLocked && (
          <div className="mt-4 border border-cyan-500/30 rounded-xl overflow-hidden bg-zinc-900">
            <div className="px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 shrink-0">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-base font-bold text-white mb-1"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    All 5 steps confirmed
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Locking the foundation seals all 5 artifacts and makes them read-only.
                    Section Validation will become accessible. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between gap-4">
                <p
                  className="text-xs text-zinc-600"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  5/5 steps · oracle data secured · hermes config ready
                </p>
                <button
                  onClick={onApproveAndLock}
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-sm font-bold
                    bg-cyan-500/20 border border-cyan-500/60 text-cyan-300
                    hover:bg-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]
                    transition-all"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <ShieldCheck className="w-4 h-4" strokeWidth={2} />
                  Approve &amp; Lock Foundation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
