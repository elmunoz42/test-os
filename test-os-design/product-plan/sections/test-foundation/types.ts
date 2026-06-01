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

export interface TestFoundationProps {
  phase: FoundationPhase
  steps: FoundationStep[]
  /** Called when the user confirms a step. Receives the step id and current field values. */
  onConfirmStep?: (stepId: string, fields: Record<string, string>) => void
  /** Called when the user edits a field value within a step. */
  onEditField?: (stepId: string, fieldKey: string, value: string) => void
  /** Called when the user clicks the Approve & Lock CTA to seal the phase. */
  onApproveAndLock?: () => void
}
