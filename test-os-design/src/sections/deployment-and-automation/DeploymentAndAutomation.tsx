import data from '@/../product/sections/deployment-and-automation/data.json'
import { DeploymentAndAutomation } from './components/DeploymentAndAutomation'
import type {
  DeploymentMode,
  SetupStep,
  InstanceStatus,
  CronConfig,
  LogLine,
} from '@/../product/sections/deployment-and-automation/types'

export default function DeploymentAndAutomationPreview() {
  return (
    <DeploymentAndAutomation
      mode={data.mode as DeploymentMode}
      steps={data.steps as SetupStep[]}
      instanceStatus={data.instanceStatus as InstanceStatus}
      cronConfig={data.cronConfig as CronConfig}
      logLines={data.logLines as LogLine[]}
      onConfirmStep={(id) => console.log('Confirm step:', id)}
      onCopyCommand={(cmd) => console.log('Copy command:', cmd.slice(0, 40) + '...')}
      onRefreshLog={() => console.log('Refresh log')}
    />
  )
}
