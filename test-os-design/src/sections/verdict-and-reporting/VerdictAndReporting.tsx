import data from '@/../product/sections/verdict-and-reporting/data.json'
import { VerdictAndReporting } from './components/VerdictAndReporting'
import type {
  RunSummary,
  Epic,
  ThinAssertionFlag,
  CoverageGap,
  AgentComparison,
  ActiveTab,
} from '@/../product/sections/verdict-and-reporting/types'

export default function VerdictAndReportingPreview() {
  return (
    <VerdictAndReporting
      latestRun={data.latestRun as RunSummary}
      runs={data.runs as RunSummary[]}
      epics={data.epics as Epic[]}
      thinAssertions={data.thinAssertions as ThinAssertionFlag[]}
      coverageGaps={data.coverageGaps as CoverageGap[]}
      agentComparisons={data.agentComparisons as AgentComparison[]}
      activeTestCaseId={data.activeTestCaseId}
      activeTab={data.activeTab as ActiveTab}
      onSelectTestCase={(id) => console.log('Select test case:', id)}
      onClosePanel={() => console.log('Close panel')}
      onEmitFixPrompt={(id) => console.log('Emit fix prompt:', id)}
      onRunValidation={() => console.log('Run validation')}
      onExportReport={() => console.log('Export report')}
      onSelectRun={(id) => console.log('Select run:', id)}
      onTabChange={(tab) => console.log('Tab change:', tab)}
    />
  )
}
