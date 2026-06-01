import { useEffect, useState } from 'react'
import type { DeploymentAndAutomationProps, DeploymentMode } from './types'
import { SetupWizard } from './SetupWizard'
import { StatusDashboard } from './StatusDashboard'

export function DeploymentAndAutomation({
  mode: initialMode,
  steps: initialSteps,
  instanceStatus,
  cronConfig,
  logLines,
  onConfirmStep,
  onCopyCommand,
  onRefreshLog,
}: DeploymentAndAutomationProps) {
  const [mode, setMode] = useState<DeploymentMode>(initialMode)
  const [steps, setSteps] = useState(initialSteps)

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    setSteps(initialSteps)
  }, [initialSteps])

  const handleConfirmStep = (stepId: string) => {
    const updated = steps.map((s, i, arr) => {
      if (s.id === stepId) {
        return { ...s, status: 'complete' as const, confirmedAt: new Date().toISOString() }
      }
      // Unlock the next step
      const prev = arr[i - 1]
      if (prev?.id === stepId && s.status === 'locked') return { ...s, status: 'active' as const }
      return s
    })
    setSteps(updated)
    onConfirmStep?.(stepId)
    // If all steps confirmed, switch to deployed view
    if (updated.every((s) => s.status === 'complete')) {
      setTimeout(() => setMode('deployed'), 400)
    }
  }

  return (
    <div className="min-h-full bg-zinc-950" style={{ fontFamily: "'Inter', sans-serif" }}>
      {mode === 'setup' ? (
        <SetupWizard
          steps={steps}
          onConfirmStep={handleConfirmStep}
          onCopyCommand={onCopyCommand}
        />
      ) : (
        <StatusDashboard
          instanceStatus={instanceStatus}
          cronConfig={cronConfig}
          logLines={logLines}
          onRefreshLog={onRefreshLog}
        />
      )}
    </div>
  )
}
