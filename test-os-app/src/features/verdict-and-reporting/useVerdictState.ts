import { useCallback, useEffect, useMemo, useState } from 'react'
import { createInitialVerdictState, type VerdictState } from '../../data/verdictSample'
import type { ActiveTab } from './types'

const STORAGE_KEY = 'test-os.verdict-and-reporting.v1'

function getStoredState(): VerdictState {
  if (typeof window === 'undefined') {
    return createInitialVerdictState()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialVerdictState()

    const parsed = JSON.parse(raw) as VerdictState
    if (!Array.isArray(parsed.runs) || !Array.isArray(parsed.epics)) {
      return createInitialVerdictState()
    }

    return parsed
  } catch {
    return createInitialVerdictState()
  }
}

export function useVerdictState() {
  const [state, setState] = useState<VerdictState>(getStoredState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const selectedRun = useMemo(
    () => state.runs.find((run) => run.id === state.activeRunId) ?? state.latestRun,
    [state.activeRunId, state.latestRun, state.runs]
  )

  const selectTab = useCallback((activeTab: ActiveTab) => {
    setState((current) => ({
      ...current,
      activeTab,
    }))
  }, [])

  const selectTestCase = useCallback((activeTestCaseId: string) => {
    setState((current) => ({
      ...current,
      activeTestCaseId,
    }))
  }, [])

  const closePanel = useCallback(() => {
    setState((current) => ({
      ...current,
      activeTestCaseId: null,
    }))
  }, [])

  const selectRun = useCallback((activeRunId: string) => {
    setState((current) => {
      const run = current.runs.find((candidate) => candidate.id === activeRunId)
      if (!run) return current

      return {
        ...current,
        activeRunId,
        latestRun: run,
        activeTab: 'verdict',
      }
    })
  }, [])

  const emitFixPrompt = useCallback((testCaseId: string) => {
    setState((current) => ({
      ...current,
      emittedFixPromptIds: Array.from(new Set([...current.emittedFixPromptIds, testCaseId])),
      lastActionAt: new Date().toISOString(),
    }))
  }, [])

  const noteRunValidation = useCallback(() => {
    setState((current) => ({
      ...current,
      lastActionAt: new Date().toISOString(),
    }))
  }, [])

  const noteExportReport = useCallback(() => {
    setState((current) => ({
      ...current,
      lastActionAt: new Date().toISOString(),
    }))
  }, [])

  const resetDemoState = useCallback(() => {
    setState(createInitialVerdictState())
  }, [])

  return {
    ...state,
    latestRun: selectedRun,
    selectTab,
    selectTestCase,
    closePanel,
    selectRun,
    emitFixPrompt,
    noteRunValidation,
    noteExportReport,
    resetDemoState,
  }
}
