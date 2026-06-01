# Milestone 2: Test Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete

---

## About This Handoff

**What you're receiving:** Finished UI designs, specs, sample data, and test specs for the Test Foundation section.
**Your job:** Wire the wizard to real persistence, integrate oracle file writing, and connect the phase lock to your app's routing.

---

## Goal

Implement the Test Foundation section — the 5-step sequential wizard that establishes the validation charter, coverage map, oracle data, testing standards, and Hermes harness configuration.

## Overview

Users work through 5 ordered steps before any test authoring can begin. Each step presents Claude-generated content with a small number of editable key fields. Confirming a step writes its artifact to the Test OS workspace and unlocks the next step. When all 5 are confirmed, an Approve & Lock CTA seals the foundation.

**Key Functionality:**
- Display 5 steps in sequential order with locked/active/complete visual states
- Show Claude-generated draft content + editable key fields per step
- Confirm a step to persist it and unlock the next
- Show Approve & Lock CTA only after all 5 steps are confirmed
- Locked foundation shows a read-only banner with the lock timestamp

## Components Provided

Copy from `product-plan/sections/test-foundation/components/`:

- `TestFoundation` — Main wizard component; manages step and field state
- `StepPipeline` — 5-node horizontal progress indicator
- `StepPanel` — Exports `CompletedStepRow`, `LockedStepRow`, `ActiveStepPanel`
- `index.ts` — Re-exports

## Props Reference

```typescript
interface TestFoundationProps {
  phase: FoundationPhase          // { id, status, lockedAt, currentStepIndex }
  steps: FoundationStep[]         // ordered array of 5 steps
  onConfirmStep?: (stepId: string, fields: Record<string, string>) => void
  onEditField?: (stepId: string, fieldKey: string, value: string) => void
  onApproveAndLock?: () => void
}
```

Full types in `product-plan/sections/test-foundation/types.ts`.

## Expected User Flows

### Flow 1: Confirm a Setup Step

1. User reviews generated content and edits key fields in the active step
2. User clicks "Confirm Step"
3. **Outcome:** Step writes its artifact; next step unlocks; wizard advances

### Flow 2: Approve & Lock the Foundation

1. All 5 steps confirmed → "Approve & Lock Foundation" CTA appears
2. User clicks the CTA
3. **Outcome:** Phase is sealed (`status: 'locked'`); a "Foundation Locked" banner with timestamp replaces the CTA; Section Validation becomes accessible

### Flow 3: View a Locked Foundation

1. User navigates back to Test Foundation after it is locked
2. **Outcome:** All steps shown as collapsed read-only rows; "Foundation Locked" banner at the top with lock timestamp

## Testing

See `product-plan/sections/test-foundation/tests.md` — covers sequential locking, field validation, Approve & Lock, and the locked read-only state.

## Files to Reference

- `product-plan/sections/test-foundation/README.md`
- `product-plan/sections/test-foundation/tests.md`
- `product-plan/sections/test-foundation/components/`
- `product-plan/sections/test-foundation/types.ts`
- `product-plan/sections/test-foundation/sample-data.json`

## Done When

- [ ] 5-step wizard renders with correct locked/active/complete states from persisted data
- [ ] Editing a field calls `onEditField` and the value persists across reloads
- [ ] Confirming a step writes the artifact, updates step status, and unlocks the next step
- [ ] All 5 confirmed → Approve & Lock CTA is visible
- [ ] Approve & Lock locks the phase; locked banner appears; steps become read-only
- [ ] Phase state persists across browser sessions
- [ ] Responsive on mobile
