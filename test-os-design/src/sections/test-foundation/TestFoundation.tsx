import { useState } from 'react'
import data from '@/../product/sections/test-foundation/data.json'
import { TestFoundation } from './components/TestFoundation'
import type { FoundationPhase, FoundationStep } from '@/../product/sections/test-foundation/types'

export default function TestFoundationPreview() {
  const [steps, setSteps] = useState<FoundationStep[]>(data.steps as FoundationStep[])
  const [phase, setPhase] = useState<FoundationPhase>(data.phase as FoundationPhase)

  const handleConfirmStep = (stepId: string) => {
    setSteps((prev) => {
      const updated = prev.map((s) =>
        s.id === stepId
          ? { ...s, status: 'complete' as const, confirmedAt: new Date().toISOString() }
          : s
      )
      const currentIndex = updated.findIndex((s) => s.id === stepId)
      if (currentIndex + 1 < updated.length) {
        updated[currentIndex + 1] = { ...updated[currentIndex + 1], status: 'active' as const }
      }
      const allComplete = updated.every((s) => s.status === 'complete')
      if (allComplete) {
        setPhase((p) => ({ ...p, status: 'all_confirmed' }))
      }
      return updated
    })
    console.log('Confirmed step:', stepId)
  }

  const handleEditField = (stepId: string, fieldKey: string, value: string) => {
    console.log('Field edited:', { stepId, fieldKey, value })
  }

  const handleApproveAndLock = () => {
    setPhase({ ...phase, status: 'locked', lockedAt: new Date().toISOString() })
    setSteps((prev) => prev.map((s) => ({ ...s, status: 'complete' as const })))
    console.log('Foundation approved and locked')
  }

  return (
    <TestFoundation
      phase={phase}
      steps={steps}
      onConfirmStep={handleConfirmStep}
      onEditField={handleEditField}
      onApproveAndLock={handleApproveAndLock}
    />
  )
}
