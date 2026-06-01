export type TestStatus = 'passed' | 'failed' | 'skipped'

export type RunStatus = 'completed' | 'running' | 'failed'

export type ActiveTab = 'verdict' | 'compare' | 'history'

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

export interface VerdictAndReportingProps {
  latestRun: RunSummary
  runs: RunSummary[]
  epics: Epic[]
  thinAssertions: ThinAssertionFlag[]
  coverageGaps: CoverageGap[]
  agentComparisons: AgentComparison[]
  activeTestCaseId: string | null
  activeTab: ActiveTab
  /** Called when the user clicks a test case row to open the slide-over panel */
  onSelectTestCase?: (testCaseId: string) => void
  /** Called when the user closes the slide-over panel */
  onClosePanel?: () => void
  /** Called when the user emits a fix prompt for a test case */
  onEmitFixPrompt?: (testCaseId: string) => void
  /** Called when the user triggers the Run Validation action */
  onRunValidation?: () => void
  /** Called when the user clicks Export Report */
  onExportReport?: () => void
  /** Called when the user selects a past run from the history table */
  onSelectRun?: (runId: string) => void
  /** Called when the active tab changes */
  onTabChange?: (tab: ActiveTab) => void
}
