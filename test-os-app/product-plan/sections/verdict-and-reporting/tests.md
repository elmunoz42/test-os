# Test Specs: Verdict & Reporting

Framework-agnostic UI behavior specs. Adapt to your testing setup.

## Overview

Verdict & Reporting shows the run dashboard (metrics + result tree + thin assertions + coverage gaps) with a slide-over detail panel, run history, and cross-agent comparison.

---

## User Flow Tests

### Flow 1: View Run Dashboard

**Scenario:** User arrives at the Verdict tab and sees the latest run metrics.

**Setup:** `latestRun` has `totalTests: 55, passed: 49, failed: 6, durationMs: 252000`.

**Expected Results:**
- [ ] "55" is visible as the total test count
- [ ] "49" appears in emerald as the passed count
- [ ] "6" appears in red as the failed count
- [ ] Pass rate bar shows approximately 89% fill
- [ ] "4m 12s" duration is displayed
- [ ] Build agent badge shows "cursor"
- [ ] Run timestamp is formatted and visible

---

### Flow 2: Expand Result Tree and Click a Failed Test Case

**Scenario:** User drills into a failing test case to open the slide-over panel.

**Setup:** Epic "Section Validation" has `failed: 3`; it is auto-expanded. A test case `tc-ta-002-alldone` has `status: 'failed'`.

**Steps:**
1. User sees the result tree with "Section Validation" expanded (auto-expand on fail)
2. User expands the "Test Authoring" section row
3. User expands the "Mark suite complete is guarded" story row
4. User clicks "tc-ta-002-alldone"

**Expected Results:**
- [ ] Slide-over panel slides in from the right
- [ ] Panel shows `tc-ta-002-alldone` ID in monospace
- [ ] Panel shows `status: failed` badge in red
- [ ] Gherkin is rendered with syntax highlighting
- [ ] Expected behavior block shows `{ suiteStatus: 'complete', ... }`
- [ ] Actual result block shows `{ nextSuiteAutoSelected: false }` in red (mismatch highlighted)
- [ ] Error message is visible in a red callout box
- [ ] "Emit Fix Prompt" button is shown at the bottom
- [ ] `onSelectTestCase` is called with `'tc-ta-002-alldone'`

---

### Flow 3: Emit Fix Prompt

**Scenario:** User copies a scrubbed fix prompt for a failed test case.

**Setup:** Slide-over panel is open on a test case with a non-null `fixPrompt`.

**Steps:**
1. User clicks "Emit Fix Prompt"

**Expected Results:**
- [ ] Button transitions to "Copied!" state with emerald color
- [ ] "Copied!" state reverts to "Emit Fix Prompt" after approximately 2 seconds
- [ ] `onEmitFixPrompt` is called with the test case ID
- [ ] (If navigator.clipboard is available) Clipboard contains the fix prompt text

---

### Flow 4: Run Validation Modal

**Scenario:** User opens the Run Validation modal and copies the command.

**Steps:**
1. User clicks "Run Validation" button in the run header
2. Modal appears showing `./run-tests.sh`
3. User clicks "Copy"

**Expected Results:**
- [ ] Modal is visible with the command in a code block
- [ ] "Copy" button transitions to "Copied!" briefly
- [ ] `onRunValidation` is called
- [ ] User can dismiss the modal by clicking outside or "Dismiss"

---

### Flow 5: History Tab

**Scenario:** User views past runs and clicks one to load its verdict.

**Steps:**
1. User clicks the "History" tab
2. User sees a table of 4 runs
3. User clicks the row for `run-2026-05-30T0200Z`

**Expected Results:**
- [ ] History tab is active; Verdict and Compare tabs are not active
- [ ] Table shows 4 rows with run ID, date, agent, passed, failed, duration, status chip
- [ ] Cursor runs show a cyan "cursor" badge; codex runs show a "codex" badge
- [ ] `onSelectRun` is called with `'run-2026-05-30T0200Z'`
- [ ] Clicked row is highlighted

---

### Flow 6: Compare Agents Tab

**Scenario:** User views cross-agent pass/fail comparison.

**Setup:** Run history contains runs from both "cursor" and "codex" agents.

**Steps:**
1. User clicks the "Compare Agents" tab

**Expected Results:**
- [ ] Compare Agents tab is visible (2+ agents exist in run history)
- [ ] Table has a "cursor" column and a "codex" column
- [ ] Pass results show an emerald check cell
- [ ] Fail results show a red X cell
- [ ] Rows where agents disagree have an amber background tint
- [ ] Disagreement count is shown: "3 disagreements"
- [ ] "Failed only" toggle filters to only failed rows when activated

---

## Thin Assertions and Coverage Gaps

- [ ] Thin-assertion section shows count badge and is collapsible
- [ ] Expanding shows test case ID, title, story title, and reason for each flag
- [ ] Coverage gap section shows with violet accent and is collapsible
- [ ] Expanding shows section name, epic name, and reason for each gap
- [ ] Both sections are hidden when their arrays are empty

---

## Edge Cases

- [ ] Test tree auto-expands only epics/sections with `failed > 0`
- [ ] Test cases with `thinAssertionFlag: true` show an amber warning icon on the row
- [ ] Active test case row has cyan left-border indicator
- [ ] Passed test cases show a subtle emerald check; failed show a red X
- [ ] Slide-over closes when user clicks the X button (`onClosePanel` called)
- [ ] "Emit Fix Prompt" button is hidden when `fixPrompt` is null

---

## Sample Test Data

```typescript
const passingTestCase: TestCase = {
  id: 'tc-cs-001-happy', title: 'Charter includes scope and risk priorities',
  status: 'passed', gherkin: 'Given...\nWhen...\nThen...',
  expectedBehavior: { charterSections: ['scope', 'riskPriorities'] },
  actualResult: { charterSections: ['scope', 'riskPriorities'] },
  errorMessage: null, thinAssertionFlag: false, screenshotUrl: null, fixPrompt: null,
}

const failingTestCase: TestCase = {
  id: 'tc-hh-001-timeout', title: 'Navigation timeout config is respected',
  status: 'failed', gherkin: 'Given...\nWhen...\nThen...',
  expectedBehavior: { errorType: 'NavigationTimeout' },
  actualResult: { errorType: 'GenericError' },
  errorMessage: 'Expected NavigationTimeout but received GenericError.',
  thinAssertionFlag: false, screenshotUrl: null,
  fixPrompt: 'Test failing because error classification is wrong...',
}
```
