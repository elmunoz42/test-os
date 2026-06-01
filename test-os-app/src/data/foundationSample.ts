import sampleData from '../../product-plan/sections/test-foundation/sample-data.json'
import type { FoundationPhase, FoundationStep, StepStatus } from '../features/test-foundation/types'

export interface FoundationState {
  phase: FoundationPhase
  steps: FoundationStep[]
}

function toTestOsCommand(command: string) {
  const commandName = command.replace(/^\//, '')
  return `/test-os:${commandName}`
}

export function createInitialFoundationState(): FoundationState {
  const steps = (sampleData.steps as FoundationStep[]).map((step, index) => {
    const status: StepStatus = index === 0 ? 'active' : 'locked'

    return {
      ...step,
      command: toTestOsCommand(step.command),
      status,
      confirmedAt: null,
    }
  })

  return {
    phase: {
      ...(sampleData.phase as FoundationPhase),
      status: 'in_progress',
      lockedAt: null,
      currentStepIndex: 1,
    },
    steps,
  }
}
