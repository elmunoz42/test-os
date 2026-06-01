import { useCallback, useEffect, useState } from 'react'
import {
  createInitialFoundationState,
  type FoundationState,
} from '../../data/foundationSample'
import type { FoundationStep, StepStatus } from './types'

const STORAGE_KEY = 'test-os.foundation.v1'

function getStoredState(): FoundationState {
  if (typeof window === 'undefined') {
    return createInitialFoundationState()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialFoundationState()

    const parsed = JSON.parse(raw) as FoundationState
    if (!parsed.phase || !Array.isArray(parsed.steps) || parsed.steps.length !== 5) {
      return createInitialFoundationState()
    }

    return parsed
  } catch {
    return createInitialFoundationState()
  }
}

function getStepFields(step: FoundationStep) {
  return Object.fromEntries(step.editableFields.map((field) => [field.key, field.value]))
}

function updateStepStatuses(steps: FoundationStep[], confirmedIndex: number) {
  return steps.map((step, index) => {
    let status: StepStatus = 'locked'

    if (index <= confirmedIndex) {
      status = 'complete'
    } else if (index === confirmedIndex + 1) {
      status = 'active'
    }

    return { ...step, status }
  })
}

export function useFoundationState() {
  const [state, setState] = useState<FoundationState>(getStoredState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const editField = useCallback((stepId: string, fieldKey: string, value: string) => {
    setState((current) => ({
      ...current,
      steps: current.steps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              editableFields: step.editableFields.map((field) =>
                field.key === fieldKey ? { ...field, value } : field
              ),
            }
          : step
      ),
    }))
  }, [])

  const confirmStep = useCallback((stepId: string, fields: Record<string, string>) => {
    setState((current) => {
      if (current.phase.status === 'locked') return current

      const stepIndex = current.steps.findIndex((step) => step.id === stepId)
      if (stepIndex === -1) return current

      const confirmedAt = new Date().toISOString()
      const hydratedSteps = current.steps.map((step, index) => {
        if (index !== stepIndex) return step

        const nextFields = { ...getStepFields(step), ...fields }

        return {
          ...step,
          confirmedAt,
          editableFields: step.editableFields.map((field) => ({
            ...field,
            value: nextFields[field.key] ?? field.value,
          })),
        }
      })

      const steps = updateStepStatuses(hydratedSteps, stepIndex)
      const allConfirmed = stepIndex === current.steps.length - 1

      return {
        phase: {
          ...current.phase,
          status: allConfirmed ? 'all_confirmed' : 'in_progress',
          currentStepIndex: allConfirmed ? current.steps.length : stepIndex + 2,
        },
        steps,
      }
    })
  }, [])

  const approveAndLock = useCallback(() => {
    setState((current) => {
      const allComplete = current.steps.every((step) => step.status === 'complete')
      if (!allComplete) return current

      return {
        phase: {
          ...current.phase,
          status: 'locked',
          lockedAt: new Date().toISOString(),
          currentStepIndex: current.steps.length,
        },
        steps: current.steps.map((step) => ({ ...step, status: 'complete' })),
      }
    })
  }, [])

  const reset = useCallback(() => {
    setState(createInitialFoundationState())
  }, [])

  return {
    phase: state.phase,
    steps: state.steps,
    editField,
    confirmStep,
    approveAndLock,
    reset,
  }
}
