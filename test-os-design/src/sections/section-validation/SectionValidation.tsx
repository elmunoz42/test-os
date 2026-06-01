import data from '@/../product/sections/section-validation/data.json'
import { SectionValidation } from './components/SectionValidation'
import type {
  Epic,
  SectionSuite,
  UserStory,
  Screenshot,
  ShapeSuiteContent,
  SuiteFixturesContent,
} from '@/../product/sections/section-validation/types'

export default function SectionValidationPreview() {
  return (
    <SectionValidation
      epics={data.epics as Epic[]}
      suites={data.suites as SectionSuite[]}
      stories={data.stories as UserStory[]}
      screenshots={data.screenshots as Screenshot[]}
      activeSuiteId={data.activeSuiteId}
      activeStoryId={data.activeStoryId}
      filter={data.filter}
      shapeSuiteContent={data.shapeSuiteContent as ShapeSuiteContent}
      suiteFixturesContent={data.suiteFixturesContent as SuiteFixturesContent}
      onSelectSuite={(id) => console.log('Select suite:', id)}
      onMarkComplete={(id) => console.log('Mark complete:', id)}
      onResetSuite={(id) => console.log('Reset suite:', id)}
      onFilterChange={(f) => console.log('Filter:', f)}
      onSelectStory={(id) => console.log('Select story:', id)}
      onToggleStep={(suiteId, stepId) => console.log('Toggle step:', suiteId, stepId)}
    />
  )
}
