# Section Validation

## Overview

Section Validation is the repeated authoring phase — one suite per app section from the coverage map. The layout is a persistent split view: a left panel lists all sections grouped by epic with status and priority, and a right panel shows the active section's 4-step accordion (shape-suite, suite-fixtures, author-tests, capture-evidence). Steps can be opened in any order. The phase is complete when all suites are marked done.

## User Flows

- User arrives at split view; left panel shows suites grouped by epic; right panel shows the first in-progress suite
- User searches/filters the suite list by name, epic, or status
- User clicks a suite to load it in the right panel
- User expands any accordion step; the author-tests step has a story list + Gherkin preview sub-split
- Capture-evidence step shows a per-story filmstrip with up to 5 capture slots each
- User marks a suite complete (requires all 4 steps done) or resets it with confirmation
- Last suite complete → phase-complete banner; Verdict & Reporting unlocks

## Design Decisions

- **Epic groups are collapsible** — each shows a completed/total count
- **Gherkin is syntax-highlighted inline** — no library; Feature/Scenario=cyan, Given/When/Then=violet, @tags=emerald
- **5-slot filmstrip for evidence** — dashed outlines for uncaptured steps, step index visible
- **Mark Complete is guarded** — disabled with tooltip when not all 4 steps are done
- **Reset requires confirmation** — destructive action behind a modal before wiping step completions

## Data Shapes

**Entities:** `Epic`, `SectionSuite`, `ValidationStepInfo`, `UserStory`, `Screenshot`, `SuiteFilter`

**Key enum:** `StepId` = `'shape-suite' | 'suite-fixtures' | 'author-tests' | 'capture-evidence'`

## Components

- `SectionValidation` — Main split-view component; manages active suite, filter, and story selection
- `SuiteListPanel` — Left panel: search, epic groups with `EpicGroup`, suite rows
- `SuiteDetail` — Right panel: suite header, 4-step accordion, author-tests body, screenshot gallery

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onSelectSuite(suiteId)` | User clicks a suite in the left panel |
| `onMarkComplete(suiteId)` | User marks a suite complete |
| `onResetSuite(suiteId)` | User resets a suite (after confirmation) |
| `onFilterChange(filter)` | Search query or epic/status filter changes |
| `onSelectStory(storyId)` | User selects a story in the author-tests step |
| `onToggleStep(suiteId, stepId)` | Accordion step is opened or closed |
