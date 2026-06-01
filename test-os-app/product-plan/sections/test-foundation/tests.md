# Test Specs: Test Foundation

Framework-agnostic UI behavior specs. Adapt to your testing setup (Vitest, Playwright, Cypress, etc.).

## Overview

Test Foundation is a 5-step sequential wizard. Steps unlock one at a time; confirming the final step reveals an Approve & Lock CTA. Once locked, the foundation becomes read-only.

---

## User Flow Tests

### Flow 1: Confirm a Step and Advance the Wizard

**Scenario:** User fills in required fields on the active step and confirms it.

#### Success Path

**Setup:** Step 1 (Test Charter) is `active`; Steps 2–5 are `locked`.

**Steps:**
1. User sees Step 1 expanded with generated content and editable fields
2. User edits the "Scope Description" field
3. User clicks "Confirm Step"

**Expected Results:**
- [ ] Step 1 row collapses and shows a green check + confirmed timestamp
- [ ] Step 2 (Coverage Map) expands as the new active step
- [ ] Steps 3–5 remain locked (lock icon, dimmed)
- [ ] `onConfirmStep` is called with `('test-charter', { ...currentFieldValues })`

#### Failure Path: Required Field Empty

**Steps:**
1. Step 1 is active
2. User clears the "Scope Description" field
3. User attempts to click "Confirm Step"

**Expected Results:**
- [ ] "Confirm Step" button is disabled (no click event)
- [ ] Step does not advance

---

### Flow 2: Approve & Lock Foundation

**Scenario:** All 5 steps are confirmed; user seals the foundation.

**Setup:** All 5 `FoundationStep` records have `status: 'complete'`.

**Steps:**
1. User sees all 5 steps collapsed with green checks
2. User sees the "Approve & Lock Foundation" CTA panel
3. User clicks "Approve & Lock Foundation"

**Expected Results:**
- [ ] "Foundation Locked" banner appears at the top of the section
- [ ] Banner shows a lock timestamp
- [ ] All step rows become read-only (no editable fields visible)
- [ ] `onApproveAndLock` is called
- [ ] The Approve & Lock CTA panel is no longer visible

#### Failure Path: Not All Steps Confirmed

**Setup:** Steps 1–4 are complete; Step 5 is `active` (not yet confirmed).

**Expected Results:**
- [ ] Approve & Lock CTA panel is NOT visible
- [ ] Step 5 accordion is shown as active

---

### Flow 3: Edit a Field and Copy Intent

**Scenario:** User edits the Base URL field in the Hermes Config step.

**Steps:**
1. Step 5 (Hermes Config) is active
2. User clicks on the "App Base URL" input
3. User types `http://localhost:4000`

**Expected Results:**
- [ ] Input value updates to `http://localhost:4000`
- [ ] `onEditField` is called with `('hermes-config', 'appUrl', 'http://localhost:4000')`

---

## Empty States

### Foundation Not Started

**Setup:** All 5 steps have `status: 'locked'` except Step 1 which is `active`.

**Expected Results:**
- [ ] Step 1 is shown expanded (active) with generated content
- [ ] Steps 2–5 are shown as locked rows with a lock icon
- [ ] No "Approve & Lock" panel is visible
- [ ] No "Foundation Locked" banner is visible

---

## Component Interaction Tests

### StepPipeline

- [ ] Shows 5 nodes connected by horizontal lines
- [ ] Complete nodes show a cyan check icon with glow shadow
- [ ] Active node shows the step number in monospace with a ping animation
- [ ] Locked nodes show a lock icon and are dimmed

### ActiveStepPanel

- [ ] Shows step number, title, command label, artifact path
- [ ] Generated content renders in a terminal-style dark code block
- [ ] Editable fields render as text inputs, textareas, or selects based on `type`
- [ ] Confirm button is disabled when any required field is empty
- [ ] Confirm button calls `onConfirmStep` when clicked

---

## Edge Cases

- [ ] Very long `generatedContent` truncates with scrollable overflow (does not break layout)
- [ ] `select` type editable fields render a `<select>` element with the correct options
- [ ] After locking, re-rendering the component with `phase.status = 'locked'` shows the locked banner
- [ ] Confirming the last step immediately shows the Approve & Lock panel (no page reload needed)

---

## Sample Test Data

```typescript
const activePhase = {
  id: 'test-foundation',
  status: 'in_progress' as const,
  lockedAt: null,
  currentStepIndex: 1,
}

const steps = [
  {
    id: 'test-charter', order: 1, label: 'Test Charter', command: '/test-charter',
    artifact: 'charter.md', status: 'complete' as const, confirmedAt: '2026-05-30T14:23:00Z',
    description: 'Define scope and risk priorities.', generatedContent: '# Test Charter\n...',
    editableFields: [
      { key: 'appName', label: 'Application Name', value: 'My App', type: 'text' as const },
    ],
  },
  {
    id: 'coverage-map', order: 2, label: 'Coverage Map', command: '/test-roadmap',
    artifact: 'coverage-map.md', status: 'active' as const, confirmedAt: null,
    description: 'Mirror the app roadmap into a coverage map.', generatedContent: '# Coverage Map\n...',
    editableFields: [
      { key: 'designOsSource', label: 'Design OS Source Path', value: '../design-os/product', type: 'text' as const },
    ],
  },
]
```
