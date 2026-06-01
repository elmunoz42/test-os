# Test Specs: Section Validation

Framework-agnostic UI behavior specs. Adapt to your testing setup.

## Overview

Section Validation is a split-view authoring workspace. Left panel: suite list with search/filter. Right panel: 4-step accordion for the selected suite. Includes author-tests Gherkin preview and a 5-slot screenshot filmstrip for evidence capture.

---

## User Flow Tests

### Flow 1: Select a Suite and View Its Detail

**Scenario:** User clicks a suite in the left panel to load it in the right panel.

**Setup:** 12 suites across 4 epics; `activeSuiteId` is `suite-007` (Test Authoring, in_progress).

**Steps:**
1. User sees the left panel with suites grouped by epic headers
2. User clicks "Charter & Scope" (suite-001, complete)

**Expected Results:**
- [ ] Right panel header updates to show "Charter & Scope" and its epic badge
- [ ] Accordion shows 4 steps, all marked complete
- [ ] `onSelectSuite` is called with `'suite-001'`
- [ ] "Charter & Scope" row in the left panel gets the cyan left-border indicator
- [ ] Previous active suite loses the indicator

---

### Flow 2: Author Tests — Select Story and View Gherkin

**Scenario:** User expands the author-tests accordion step and selects a story.

**Setup:** `suite-007` is active; it has 5 user stories.

**Steps:**
1. User sees the right panel with suite-007 loaded
2. User expands the `/author-tests Author Tests` accordion step
3. User clicks "Mark a suite as complete" (story-003) in the story list

**Expected Results:**
- [ ] The Gherkin viewer renders the Gherkin for story-003
- [ ] Story-003 row gets the cyan left-border indicator
- [ ] The Gherkin viewer shows syntax-highlighted lines (cyan for Feature/Scenario, violet for Given/When/Then, emerald for @tags)
- [ ] `onSelectStory` is called with `'story-003'`

---

### Flow 3: Mark Suite Complete

**Scenario:** User marks a suite complete when all 4 steps are done.

#### Success Path

**Setup:** Suite where all 4 `ValidationStepInfo.status` are `'complete'`.

**Steps:**
1. User opens the suite detail
2. User clicks the `⋯` actions menu
3. User clicks "Mark complete"

**Expected Results:**
- [ ] Suite status in the left panel updates to complete (green check)
- [ ] Right panel shows a "Suite sealed" banner with timestamp
- [ ] `onMarkComplete` is called with the suite ID
- [ ] Next in-progress suite is auto-selected

#### Failure Path: Incomplete Steps

**Setup:** Suite with at least one step in `'not_started'` or `'in_progress'`.

**Steps:**
1. User opens the actions menu

**Expected Results:**
- [ ] "Mark complete" option is disabled (grayed out)
- [ ] A tooltip or note reads "4/4 required"

---

### Flow 4: Reset a Suite

**Scenario:** User resets a suite to clear its authoring state.

**Steps:**
1. User opens the `⋯` actions menu for any suite
2. User clicks "Reset suite"

**Expected Results:**
- [ ] `onResetSuite` is called with the suite ID
- [ ] All 4 step statuses revert to `'not_started'` in the UI
- [ ] Suite status reverts to `'not_started'`
- [ ] Left panel shows 0/4 for the suite

---

### Flow 5: Search and Filter Suites

**Scenario:** User types in the search input to narrow the list.

**Steps:**
1. User types "auth" in the search input

**Expected Results:**
- [ ] Only suites whose names contain "auth" (case-insensitive) are visible
- [ ] `onFilterChange` is called with `{ query: 'auth', epicId: null, status: null }`
- [ ] Epic group headers for matching suites remain visible

#### Failure Path: No Matches

**Steps:**
1. User types "xyzzy" — no suites match

**Expected Results:**
- [ ] A "No suites match your filter" message is shown
- [ ] Suite list is empty

---

## Screenshot Filmstrip Tests

### 5-Slot Display

**Setup:** Story with `captureScreenshot: true` and 3 screenshots captured (stepIndex 1, 2, 3).

**Expected Results:**
- [ ] Exactly 5 slots are rendered in the filmstrip row
- [ ] Slots 1–3 show a camera icon thumbnail and a truncated `captureStep` description
- [ ] Slots 4–5 show a dashed outline with the step index (4, 5)
- [ ] Counter shows "3/5" in monospace

---

## Edge Cases

- [ ] Epic group with zero matching suites after filter is not rendered
- [ ] Collapsing an epic group hides its suites
- [ ] Suite with `lastModifiedAt: null` renders without a date (no crash)
- [ ] Accordion allows multiple steps open simultaneously
- [ ] Phase-complete banner fires when the last suite is marked complete

---

## Sample Test Data

```typescript
const mockSuite: SectionSuite = {
  id: 'suite-007', name: 'Test Authoring', epicId: 'epic-002',
  priority: 'high', status: 'in_progress', completedAt: null,
  lastModifiedAt: '2026-05-31T09:18:00Z',
  steps: [
    { id: 'shape-suite',      command: '/shape-suite',      label: 'Shape Suite',      description: '...', status: 'complete' },
    { id: 'suite-fixtures',   command: '/suite-fixtures',   label: 'Suite Fixtures',   description: '...', status: 'complete' },
    { id: 'author-tests',     command: '/author-tests',     label: 'Author Tests',     description: '...', status: 'in_progress' },
    { id: 'capture-evidence', command: '/capture-evidence', label: 'Capture Evidence', description: '...', status: 'not_started' },
  ],
}
```
