export type DeploymentMode = 'setup' | 'deployed'

export type SetupStepStatus = 'locked' | 'active' | 'complete'

export type InstanceState = 'running' | 'stopped' | 'pending' | 'unknown'

export type LogLevel = 'info' | 'warn' | 'error'

export interface SetupCommand {
  label: string
  command: string
  comment: string | null
}

export interface SetupStep {
  id: string
  order: number
  title: string
  description: string
  status: SetupStepStatus
  confirmedAt: string | null
  commands: SetupCommand[]
}

export interface InstanceStatus {
  instanceId: string
  region: string
  state: InstanceState
  publicIp: string | null
  tag: string
}

export interface CronConfig {
  expression: string
  nextRunAt: string | null
  lastRunAt: string | null
  scriptPath: string
}

export interface LogLine {
  timestamp: string
  level: LogLevel
  message: string
}

export interface DeploymentAndAutomationProps {
  mode: DeploymentMode
  steps: SetupStep[]
  instanceStatus: InstanceStatus | null
  cronConfig: CronConfig | null
  logLines: LogLine[]
  /** Called when the user confirms a setup step to advance the wizard */
  onConfirmStep?: (stepId: string) => void
  /** Called when the user clicks a copy button for a shell command */
  onCopyCommand?: (command: string) => void
  /** Called when the user clicks Refresh Log */
  onRefreshLog?: () => void
}
