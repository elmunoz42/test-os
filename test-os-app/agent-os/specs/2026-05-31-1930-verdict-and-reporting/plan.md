# Plan — Verdict & Reporting

## Goal

Implement Verdict & Reporting as the next Test OS milestone: run metrics, result tree, slide-over failure inspection, fix prompt emission, run history, and build-agent comparison.

## Implementation Tasks

1. Save Agent OS spec documentation.
2. Integrate Verdict & Reporting component assets.
3. Persist verdict UI state in `localStorage`.
4. Route `/verdict` to the new section.
5. Normalize command references and add `/test-os:*` command docs.
6. Build and smoke check.

## Acceptance Criteria

- `/verdict` renders the Verdict & Reporting dashboard.
- Latest/selected run metrics render from local run data.
- Failed result-tree branches auto-expand.
- Clicking a test case opens the slide-over with Gherkin, expected/actual diff, and failure details.
- Emit Fix Prompt copies the scrubbed prompt and records the action locally.
- Run Validation modal displays `./run-tests.sh`.
- Export Report opens `/report.html`.
- History tab selects a past run and updates the dashboard metrics.
- Compare Agents tab is visible when 2+ build agents exist.
