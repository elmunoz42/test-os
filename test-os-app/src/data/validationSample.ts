import sampleData from '../../product-plan/sections/section-validation/sample-data.json'
import type {
  Epic,
  Screenshot,
  SectionSuite,
  ShapeSuiteContent,
  SuiteFilter,
  SuiteFixturesContent,
  UserStory,
  ValidationStepInfo,
} from '../features/section-validation/types'

export interface ValidationState {
  activeSuiteId: string | null
  activeStoryId: string | null
  filter: SuiteFilter
  epics: Epic[]
  suites: SectionSuite[]
  stories: UserStory[]
  screenshots: Screenshot[]
  shapeSuiteContent?: ShapeSuiteContent
  suiteFixturesContent?: SuiteFixturesContent
}

function toTestOsCommand(command: string) {
  const commandName = command.replace(/^\//, '')
  return `/test-os:${commandName}`
}

function normalizeText(value: string) {
  return value
    .replace(/\/shape-suite/g, '/test-os:shape-suite')
    .replace(/\/suite-fixtures/g, '/test-os:suite-fixtures')
    .replace(/\/author-tests/g, '/test-os:author-tests')
    .replace(/\/capture-evidence/g, '/test-os:capture-evidence')
}

function normalizeSuite(suite: SectionSuite): SectionSuite {
  return {
    ...suite,
    steps: suite.steps.map((step: ValidationStepInfo) => ({
      ...step,
      command: toTestOsCommand(step.command),
    })),
  }
}

function normalizeStory(story: UserStory): UserStory {
  return {
    ...story,
    title: normalizeText(story.title),
    description: normalizeText(story.description),
    source: normalizeText(story.source),
    gherkin: normalizeText(story.gherkin),
  }
}

function normalizeScreenshot(screenshot: Screenshot): Screenshot {
  return {
    ...screenshot,
    storyTitle: normalizeText(screenshot.storyTitle),
    captureStep: normalizeText(screenshot.captureStep),
  }
}

export function createInitialValidationState(): ValidationState {
  return {
    activeSuiteId: sampleData.activeSuiteId,
    activeStoryId: sampleData.activeStoryId,
    filter: sampleData.filter as SuiteFilter,
    epics: sampleData.epics as Epic[],
    suites: (sampleData.suites as SectionSuite[]).map(normalizeSuite),
    stories: (sampleData.stories as UserStory[]).map(normalizeStory),
    screenshots: (sampleData.screenshots as Screenshot[]).map(normalizeScreenshot),
    shapeSuiteContent: {
      ...(sampleData.shapeSuiteContent as ShapeSuiteContent),
      scopeDescription: normalizeText(sampleData.shapeSuiteContent.scopeDescription),
      coverageNotes: normalizeText(sampleData.shapeSuiteContent.coverageNotes),
    },
    suiteFixturesContent: {
      ...(sampleData.suiteFixturesContent as SuiteFixturesContent),
      fixtureJson: normalizeText(sampleData.suiteFixturesContent.fixtureJson),
    },
  }
}
