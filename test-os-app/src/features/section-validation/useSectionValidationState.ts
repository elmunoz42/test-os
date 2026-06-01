import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createInitialValidationState,
  type ValidationState,
} from '../../data/validationSample'
import type { SectionSuite, StepId, SuiteFilter } from './types'

const STORAGE_KEY = 'test-os.section-validation.v2'

function getStoredState(): ValidationState {
  if (typeof window === 'undefined') {
    return createInitialValidationState()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialValidationState()

    const parsed = JSON.parse(raw) as ValidationState
    if (!Array.isArray(parsed.suites) || !Array.isArray(parsed.epics)) {
      return createInitialValidationState()
    }

    return parsed
  } catch {
    return createInitialValidationState()
  }
}

function findFirstStoryForSuite(state: ValidationState, suiteId: string | null) {
  if (!suiteId) return null
  return state.stories.find((story) => story.suiteId === suiteId)?.id ?? null
}

function findNextUnfinishedSuite(suites: SectionSuite[], currentSuiteId: string) {
  return (
    suites.find((suite) => suite.id !== currentSuiteId && suite.status !== 'complete') ??
    suites.find((suite) => suite.id === currentSuiteId) ??
    null
  )
}

export function useSectionValidationState() {
  const [state, setState] = useState<ValidationState>(getStoredState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const phaseComplete = useMemo(
    () => state.suites.length > 0 && state.suites.every((suite) => suite.status === 'complete'),
    [state.suites]
  )

  const selectSuite = useCallback((suiteId: string) => {
    setState((current) => ({
      ...current,
      activeSuiteId: suiteId,
      activeStoryId:
        current.stories.find((story) => story.suiteId === suiteId)?.id ?? current.activeStoryId,
    }))
  }, [])

  const selectStory = useCallback((storyId: string) => {
    setState((current) => ({
      ...current,
      activeStoryId: storyId,
    }))
  }, [])

  const updateFilter = useCallback((filter: SuiteFilter) => {
    setState((current) => ({
      ...current,
      filter,
    }))
  }, [])

  const markComplete = useCallback((suiteId: string) => {
    setState((current) => {
      const completedAt = new Date().toISOString()
      const suites = current.suites.map((suite) =>
        suite.id === suiteId
          ? {
              ...suite,
              status: 'complete' as const,
              completedAt,
              lastModifiedAt: completedAt,
            }
          : suite
      )
      const nextSuite = findNextUnfinishedSuite(suites, suiteId)
      const activeSuiteId = nextSuite?.id ?? suiteId

      return {
        ...current,
        suites,
        activeSuiteId,
        activeStoryId: findFirstStoryForSuite({ ...current, suites }, activeSuiteId),
      }
    })
  }, [])

  const resetSuite = useCallback((suiteId: string) => {
    setState((current) => {
      const resetAt = new Date().toISOString()

      return {
        ...current,
        activeSuiteId: suiteId,
        activeStoryId: null,
        suites: current.suites.map((suite) =>
          suite.id === suiteId
            ? {
                ...suite,
                status: 'not_started',
                completedAt: null,
                lastModifiedAt: resetAt,
                steps: suite.steps.map((step) => ({ ...step, status: 'not_started' as const })),
              }
            : suite
        ),
        stories: current.stories.filter((story) => story.suiteId !== suiteId),
        screenshots: current.screenshots.filter((screenshot) =>
          current.stories.some(
            (story) => story.id === screenshot.storyId && story.suiteId !== suiteId
          )
        ),
        shapeSuiteContent:
          current.shapeSuiteContent?.suiteId === suiteId ? undefined : current.shapeSuiteContent,
        suiteFixturesContent:
          current.suiteFixturesContent?.suiteId === suiteId
            ? undefined
            : current.suiteFixturesContent,
      }
    })
  }, [])

  const toggleStep = useCallback((suiteId: string, stepId: StepId) => {
    setState((current) => ({
      ...current,
      activeSuiteId: suiteId,
      activeStoryId:
        stepId === 'author-tests'
          ? current.activeStoryId ?? findFirstStoryForSuite(current, suiteId)
          : current.activeStoryId,
    }))
  }, [])

  const resetDemoState = useCallback(() => {
    setState(createInitialValidationState())
  }, [])

  return {
    ...state,
    phaseComplete,
    selectSuite,
    selectStory,
    updateFilter,
    markComplete,
    resetSuite,
    toggleStep,
    resetDemoState,
  }
}
