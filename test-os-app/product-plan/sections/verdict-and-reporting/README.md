# Verdict & Reporting

## Overview

Verdict & Reporting is the payoff screen of Test OS — the dashboard where validation run results are surfaced, analyzed, and acted upon. It shows the latest run's summary metrics and a collapsible epic → section → story result tree, with a slide-over panel for failed test case details, Emit Fix Prompt actions, run history, and cross-agent comparison.

## User Flows

- User sees run dashboard: total/pass/fail counts, pass rate bar, build agent, timestamp
- User expands the result tree: epics expand to sections, sections to stories, stories to test cases; failed nodes auto-expand and have red accent borders
- User clicks a test case to open the slide-over panel: Gherkin (syntax-highlighted), expected vs actual diff (mismatched keys highlighted red), Emit Fix Prompt
- User copies a scrubbed fix prompt to clipboard; "Copied!" confirmation for 2s
- User opens Run Validation modal to copy the `./run-tests.sh` command
- User views History tab: table of past runs; clicking a row loads that run's verdict
- User views Compare Agents tab (when 2+ agents in history): side-by-side pass/fail per test case; disagreements highlighted amber

## Design Decisions

- **Failed nodes auto-expand** on initial load — failures are visible without clicking
- **Expected vs actual diff** highlights mismatched keys in red with a `✗ mismatch` label
- **Thin-assertion and coverage gap sections** are collapsible with amber/violet accents respectively
- **Emit Fix Prompt** transitions to emerald "Copied!" state for 2s
- **Compare Agents tab** only appears when run history contains 2+ distinct build agents

## Data Shapes

**Entities:** `Epic` (nested with `Section` → `Story` → `TestCase`), `RunSummary`, `ThinAssertionFlag`, `CoverageGap`, `AgentComparison`

## Components

- `VerdictAndReporting` — Main component: tab state, slide-over state, run validation modal
- `RunHeader` — Summary metric chips, pass rate bar, action buttons
- `ResultTree` — Collapsible epic/section/story/test-case tree
- `TestCaseSlideOver` — Right slide-over panel with Gherkin, diff, and fix prompt
- `HistoryTab` — Run history table
- `CompareAgentsTab` — Cross-agent comparison table with failed-only filter

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onSelectTestCase(testCaseId)` | User clicks a test case row |
| `onClosePanel()` | User closes the slide-over panel |
| `onEmitFixPrompt(testCaseId)` | User clicks Emit Fix Prompt |
| `onRunValidation()` | User opens the Run Validation modal |
| `onExportReport()` | User clicks Export Report |
| `onSelectRun(runId)` | User selects a run from the history table |
| `onTabChange(tab)` | User switches between Verdict / History / Compare tabs |
