# Milestone 4: Verdict & Reporting

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1–3 complete

---

## About This Handoff

**What you're receiving:** Finished UI designs, specs, sample data, and test specs for the Verdict & Reporting section.
**Your job:** Wire the result tree to real run output from Hermes, connect fix-prompt emission, and implement the run history and cross-agent comparison from persisted run data.

---

## Goal

Implement Verdict & Reporting — the run dashboard showing pass/fail metrics, the collapsible result tree, the test case slide-over with actual vs expected diff, run history, and cross-agent comparison.

## Overview

Three tabs: Verdict (default), History, and Compare Agents (visible when 2+ build agents exist in run history). The Verdict tab shows the latest run's metrics, a collapsible epic→section→story→test-case tree with failed nodes auto-expanded and red-accented, thin-assertion flags, and coverage gaps. Clicking a test case opens a slide-over with Gherkin, expected vs actual diff (mismatched keys highlighted red), and an Emit Fix Prompt button. Fix prompts are oracle-scrubbed — they never leak expected values.

**Key Functionality:**
- Summary metrics: total/pass/fail counts + pass rate bar + duration
- Collapsible result tree: failed nodes auto-expand and have red left-border accents
- Slide-over panel: Gherkin viewer + expected vs actual diff + Emit Fix Prompt
- Emit Fix Prompt copies a scrubbed prompt to clipboard with 2s confirmation toast
- Run Validation modal: shows `./run-tests.sh` command with copy button
- Export Report: opens `report.html` in a new tab
- History tab: table of past runs; clicking loads that run's verdict
- Compare Agents tab: pass/fail grid per test case per agent; disagreements highlighted amber

## Components Provided

Copy from `product-plan/sections/verdict-and-reporting/components/`:

- `VerdictAndReporting` — Main component: tab state, slide-over state, run validation modal
- `RunHeader` — Summary stat chips, pass rate bar, Run Validation + Export Report buttons
- `ResultTree` — Collapsible epic/section/story/test-case tree with auto-expand on failures
- `TestCaseSlideOver` — Slide-over panel with Gherkin, diff, and fix prompt
- `HistoryTab` — Run history table
- `CompareAgentsTab` — Cross-agent comparison with failed-only filter toggle
- `index.ts` — Re-exports

## Props Reference

```typescript
interface VerdictAndReportingProps {
  latestRun: RunSummary
  runs: RunSummary[]
  epics: Epic[]                        // nested: sections → stories → testCases
  thinAssertions: ThinAssertionFlag[]
  coverageGaps: CoverageGap[]
  agentComparisons: AgentComparison[]
  activeTestCaseId: string | null
  activeTab: 'verdict' | 'compare' | 'history'
  onSelectTestCase?: (id: string) => void
  onClosePanel?: () => void
  onEmitFixPrompt?: (id: string) => void
  onRunValidation?: () => void
  onExportReport?: () => void
  onSelectRun?: (runId: string) => void
  onTabChange?: (tab: ActiveTab) => void
}
```

Full types in `product-plan/sections/verdict-and-reporting/types.ts`.

## Expected User Flows

### Flow 1: Review a Failed Test Case

1. User sees failed nodes auto-expanded with red accents
2. User clicks a failing test case row
3. Slide-over opens showing Gherkin, expected vs actual (mismatches in red), and error message
4. **Outcome:** User understands exactly what failed

### Flow 2: Emit Fix Prompt

1. User is in the slide-over for a failing test case
2. User clicks "Emit Fix Prompt"
3. **Outcome:** Scrubbed prompt copied to clipboard; "Copied!" confirmation for 2s

### Flow 3: Compare Build Agents

1. Run history contains runs from "cursor" and "codex"
2. User clicks "Compare Agents" tab
3. **Outcome:** Grid shows pass/fail per agent; disagreement rows highlighted amber

## Testing

See `product-plan/sections/verdict-and-reporting/tests.md`.

## Files to Reference

- `product-plan/sections/verdict-and-reporting/README.md`
- `product-plan/sections/verdict-and-reporting/tests.md`
- `product-plan/sections/verdict-and-reporting/components/`
- `product-plan/sections/verdict-and-reporting/types.ts`
- `product-plan/sections/verdict-and-reporting/sample-data.json`

## Done When

- [ ] Latest run metrics render correctly from real Hermes results.json
- [ ] Failed epics/sections auto-expand; passed ones start collapsed
- [ ] Clicking a test case opens slide-over with Gherkin and diff
- [ ] Mismatched actual/expected keys are highlighted red
- [ ] Emit Fix Prompt copies to clipboard and shows 2s "Copied!" state
- [ ] Run Validation modal shows and copies the run-tests.sh command
- [ ] Export Report opens report.html in a new tab
- [ ] History tab shows all past runs; selecting one updates the dashboard
- [ ] Compare Agents tab appears only when 2+ distinct build agents exist in history
- [ ] Responsive on mobile
