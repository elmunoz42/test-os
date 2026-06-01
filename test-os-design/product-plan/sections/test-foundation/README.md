# Test Foundation

## Overview

Test Foundation is a linear 5-step wizard that establishes the complete validation foundation before any test authoring begins. Steps are sequentially locked — each must be confirmed before the next unlocks. Each step presents a Claude-generated draft with editable key fields; confirming a step writes the artifact and advances the wizard. The phase ends with an explicit Approve & Lock action that seals the foundation and unlocks Section Validation.

## User Flows

- User arrives and Step 1 (Test Charter) opens immediately — no landing screen
- User reviews the generated charter draft, edits key fields, clicks Confirm to mark Step 1 complete
- Steps 2–5 unlock one by one (Coverage Map, Oracle Data, Test Standards, Hermes Config)
- After all 5 steps confirmed, Approve & Lock CTA appears
- User clicks Approve & Lock — phase is sealed, Section Validation unlocks

## Design Decisions

- **Arming-sequence aesthetic** — the 5-node pipeline at the top uses pulsing cyan for the active step and a satisfying "snap closed" animation for confirmed steps
- **Terminal-glass content viewer** — generated artifact drafts render in a dark code block with macOS-style window chrome
- **Mixed editor** — users see Claude's generated content but only edit key fields (not raw file content)
- **Approve & Lock is consequential** — warning copy, monospace status line, shield icon; requires deliberate click

## Data Shapes

**Entities:** `FoundationPhase`, `FoundationStep`, `EditableField`

**Key fields on FoundationStep:** `status` (locked/active/complete), `generatedContent` (the draft text), `editableFields` (inline form fields), `confirmedAt`

## Components

- `TestFoundation` — Main wizard component; manages step state and field values
- `StepPipeline` — Horizontal 5-node progress indicator
- `StepPanel` — Exports `CompletedStepRow`, `LockedStepRow`, `ActiveStepPanel`

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onConfirmStep(stepId, fields)` | User confirms a step (writes the artifact) |
| `onEditField(stepId, fieldKey, value)` | User edits a key field value |
| `onApproveAndLock()` | User clicks Approve & Lock (seals the phase) |
