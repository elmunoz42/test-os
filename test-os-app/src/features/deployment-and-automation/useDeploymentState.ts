import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createInitialDeploymentState,
  type DeploymentState,
} from '../../data/deploymentSample'

const STORAGE_KEY = 'test-os.deployment-and-automation.v1'

function getStoredState(): DeploymentState {
  if (typeof window === 'undefined') {
    return createInitialDeploymentState()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialDeploymentState()

    const parsed = JSON.parse(raw) as DeploymentState
    if (!Array.isArray(parsed.steps) || !Array.isArray(parsed.logLines)) {
      return createInitialDeploymentState()
    }

    return parsed
  } catch {
    return createInitialDeploymentState()
  }
}

export function useDeploymentState() {
  const [state, setState] = useState<DeploymentState>(getStoredState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const isDeployed = useMemo(
    () => state.mode === 'deployed' || state.steps.every((step) => step.status === 'complete'),
    [state.mode, state.steps]
  )

  const confirmStep = useCallback((stepId: string) => {
    setState((current) => {
      const confirmedAt = new Date().toISOString()
      const stepIndex = current.steps.findIndex((step) => step.id === stepId)
      if (stepIndex === -1) return current

      const steps = current.steps.map((step, index) => {
        if (index < stepIndex) return { ...step, status: 'complete' as const }
        if (index === stepIndex) return { ...step, status: 'complete' as const, confirmedAt }
        if (index === stepIndex + 1) return { ...step, status: 'active' as const }
        return { ...step, status: 'locked' as const }
      })

      const allComplete = steps.every((step) => step.status === 'complete')

      return {
        ...current,
        mode: allComplete ? 'deployed' : 'setup',
        steps,
        logLines: allComplete
          ? [
              ...current.logLines,
              {
                timestamp: confirmedAt,
                level: 'info' as const,
                message: 'Deployment setup confirmed in Test OS UI',
              },
            ]
          : current.logLines,
      }
    })
  }, [])

  const copyCommand = useCallback((command: string) => {
    setState((current) => ({
      ...current,
      copiedCommands: Array.from(new Set([...current.copiedCommands, command])),
    }))
  }, [])

  const refreshLog = useCallback(() => {
    setState((current) => {
      const now = new Date().toISOString()
      return {
        ...current,
        lastRefreshAt: now,
        logLines: [
          ...current.logLines,
          {
            timestamp: now,
            level: 'info',
            message: 'Log refresh requested from Test OS dashboard',
          },
        ],
      }
    })
  }, [])

  const resetDemoState = useCallback(() => {
    setState(createInitialDeploymentState())
  }, [])

  return {
    ...state,
    isDeployed,
    confirmStep,
    copyCommand,
    refreshLog,
    resetDemoState,
  }
}
