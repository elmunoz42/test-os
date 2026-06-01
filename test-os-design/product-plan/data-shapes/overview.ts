// =============================================================================
// UI Data Shapes — Combined Reference
//
// These types define the data that UI components expect to receive as props.
// They are a frontend contract, not a database schema. How you model, store,
// and fetch this data is an implementation decision.
// =============================================================================

// -----------------------------------------------------------------------------
// From: sections/test-foundation
// -----------------------------------------------------------------------------

export type PhaseStatus = 'not_started' | 'in_progress' | 'all_confirmed' | 'locked'
export type StepStatus = 'locked' | 'active' | 'complete'
export type FieldType = 'text' | 'textarea' | 'url' | 'select'

export interface EditableField {
  key: string
  label: string
  value: string
  type: FieldType
  options?: string[]
}

export interface FoundationStep {
  id: string
  order: number
  label: string
  command: string
  artifact: string
  status: StepStatus
  confirmedAt: string | null
  description: string
  generatedContent: string
  editableFields: EditableField[]
}

export interface FoundationPhase {
  id: string
  status: PhaseStatus
  lockedAt: string | null
  currentStepIndex: number
}

// -----------------------------------------------------------------------------
// From: sections/section-validation
// -----------------------------------------------------------------------------

export type SuiteStatus = 'not_started' | 'in_progress' | 'complete'
export type Priority = 'high' | 'medium' | 'low'
export type StepId = 'shape-suite' | 'suite-fixtures' | 'author-tests' | 'capture-evidence'

export interface ValidationStepInfo {
  id: StepId
  command: string
  label: string
  description: string
  status: 'not_started' | 'in_progress' | 'complete'
}

export interface SectionSuite {
  id: string
  name: string
  epicId: string
  priority: Priority
  steps: ValidationStepInfo[]
  status: SuiteStatus
  completedAt: string | null
  lastModifiedAt: string | null
}

export interface UserStory {
  id: string
  suiteId: string
  title: string
  description: string
  priority: Priority
  captureScreenshot: boolean
  source: string
  gherkin: string
}

export interface Screenshot {
  id: string
  storyId: string
  storyTitle: string
  stepIndex: number
  captureStep: string
  imagePlaceholder: string
  capturedAt: string
}

// -----------------------------------------------------------------------------
// From: sections/verdict-and-reporting
// -----------------------------------------------------------------------------

export type TestStatus = 'passed' | 'failed' | 'skipped'
export type RunStatus = 'completed' | 'running' | 'failed'

export interface TestCase {
  id: string
  title: string
  status: TestStatus
  gherkin: string
  expectedBehavior: Record<string, unknown>
  actualResult: Record<string, unknown> | null
  errorMessage: string | null
  thinAssertionFlag: boolean
  screenshotUrl: string | null
  fixPrompt: string | null
}

export interface Story {
  id: string
  title: string
  passed: number
  failed: number
  testCases: TestCase[]
}

export interface Section {
  id: string
  name: string
  passed: number
  failed: number
  stories: Story[]
}

export interface Epic {
  id: string
  name: string
  passed: number
  failed: number
  sections: Section[]
}

export interface RunSummary {
  id: string
  timestamp: string
  buildAgent: string
  executor: string
  totalTests: number
  passed: number
  failed: number
  skipped: number
  durationMs: number
  status: RunStatus
}

export interface ThinAssertionFlag {
  testCaseId: string
  testCaseTitle: string
  storyTitle: string
  reason: string
}

export interface CoverageGap {
  sectionId: string
  sectionName: string
  epicName: string
  reason: string
}

export interface AgentComparison {
  testCaseId: string
  testCaseTitle: string
  storyTitle: string
  results: Record<string, TestStatus>
}

// -----------------------------------------------------------------------------
// From: sections/deployment-and-automation
// -----------------------------------------------------------------------------

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
