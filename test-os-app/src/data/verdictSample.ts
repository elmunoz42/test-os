import sampleData from '../../product-plan/sections/verdict-and-reporting/sample-data.json'
import type {
  ActiveTab,
  AgentComparison,
  CoverageGap,
  Epic,
  RunSummary,
  ThinAssertionFlag,
} from '../features/verdict-and-reporting/types'

export interface VerdictState {
  activeTab: ActiveTab
  activeTestCaseId: string | null
  activeRunId: string
  latestRun: RunSummary
  runs: RunSummary[]
  epics: Epic[]
  thinAssertions: ThinAssertionFlag[]
  coverageGaps: CoverageGap[]
  agentComparisons: AgentComparison[]
  emittedFixPromptIds: string[]
  lastActionAt: string | null
}

function normalizeText(value: string) {
  return value
    .replace(/\/test-charter/g, '/test-os:test-charter')
    .replace(/\/test-roadmap/g, '/test-os:test-roadmap')
    .replace(/\/oracle-data/g, '/test-os:oracle-data')
    .replace(/\/test-standards/g, '/test-os:test-standards')
    .replace(/\/test-harness/g, '/test-os:test-harness')
    .replace(/\/shape-suite/g, '/test-os:shape-suite')
    .replace(/\/suite-fixtures/g, '/test-os:suite-fixtures')
    .replace(/\/author-tests/g, '/test-os:author-tests')
    .replace(/\/capture-evidence/g, '/test-os:capture-evidence')
}

function normalizeUnknown(value: unknown): unknown {
  if (typeof value === 'string') return normalizeText(value)
  if (Array.isArray(value)) return value.map(normalizeUnknown)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
        key,
        normalizeUnknown(nestedValue),
      ])
    )
  }
  return value
}

export function createInitialVerdictState(): VerdictState {
  const normalized = normalizeUnknown(sampleData) as typeof sampleData

  return {
    activeTab: normalized.activeTab as ActiveTab,
    activeTestCaseId: normalized.activeTestCaseId,
    activeRunId: normalized.latestRun.id,
    latestRun: normalized.latestRun as RunSummary,
    runs: normalized.runs as RunSummary[],
    epics: normalized.epics as Epic[],
    thinAssertions: normalized.thinAssertions as ThinAssertionFlag[],
    coverageGaps: normalized.coverageGaps as CoverageGap[],
    agentComparisons: normalized.agentComparisons as AgentComparison[],
    emittedFixPromptIds: [],
    lastActionAt: null,
  }
}
