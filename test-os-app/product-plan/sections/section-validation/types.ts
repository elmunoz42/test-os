export type SuiteStatus = 'not_started' | 'in_progress' | 'complete'

export type StepStatus = 'not_started' | 'in_progress' | 'complete'

export type Priority = 'high' | 'medium' | 'low'

export type StepId = 'shape-suite' | 'suite-fixtures' | 'author-tests' | 'capture-evidence'

export interface Epic {
  id: string
  name: string
}

export interface ValidationStepInfo {
  id: StepId
  command: string
  label: string
  description: string
  status: StepStatus
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

export interface SuiteFilter {
  query: string
  epicId: string | null
  status: SuiteStatus | null
}

export interface ShapeSuiteContent {
  suiteId: string
  scopeDescription: string
  priority: Priority
  coverageNotes: string
}

export interface SuiteFixturesContent {
  suiteId: string
  fixtureJson: string
}

export interface SectionValidationProps {
  epics: Epic[]
  suites: SectionSuite[]
  stories: UserStory[]
  screenshots: Screenshot[]
  activeSuiteId: string | null
  activeStoryId: string | null
  filter: SuiteFilter
  shapeSuiteContent?: ShapeSuiteContent
  suiteFixturesContent?: SuiteFixturesContent
  /** Maximum screenshots Hermes captures per story. Defaults to 5. */
  maxScreenshotsPerStory?: number
  /** Called when the user selects a suite from the left panel */
  onSelectSuite?: (suiteId: string) => void
  /** Called when the user marks a suite as complete */
  onMarkComplete?: (suiteId: string) => void
  /** Called when the user resets a suite back to not_started */
  onResetSuite?: (suiteId: string) => void
  /** Called when the search query or epic/status filter changes */
  onFilterChange?: (filter: SuiteFilter) => void
  /** Called when the user selects a story in the author-tests accordion step */
  onSelectStory?: (storyId: string) => void
  /** Called when an accordion step is toggled open or closed */
  onToggleStep?: (suiteId: string, stepId: StepId) => void
}
