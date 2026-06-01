import sampleData from '../../product-plan/sections/deployment-and-automation/sample-data.json'
import type {
  CronConfig,
  DeploymentMode,
  InstanceStatus,
  LogLine,
  SetupStep,
} from '../features/deployment-and-automation/types'

export interface DeploymentState {
  mode: DeploymentMode
  steps: SetupStep[]
  instanceStatus: InstanceStatus | null
  cronConfig: CronConfig | null
  logLines: LogLine[]
  copiedCommands: string[]
  lastRefreshAt: string | null
}

export function createInitialDeploymentState(): DeploymentState {
  return {
    mode: sampleData.mode as DeploymentMode,
    steps: sampleData.steps as SetupStep[],
    instanceStatus: sampleData.instanceStatus as InstanceStatus,
    cronConfig: sampleData.cronConfig as CronConfig,
    logLines: sampleData.logLines as LogLine[],
    copiedCommands: [],
    lastRefreshAt: null,
  }
}
