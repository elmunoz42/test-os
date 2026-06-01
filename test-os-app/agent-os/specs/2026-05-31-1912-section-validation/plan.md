# Plan — Section Validation

## Goal

Implement Section Validation as the next Test OS milestone: a split-view authoring workspace with epic-grouped suite navigation, suite detail accordion, Gherkin preview, screenshot evidence filmstrip, and persisted local UI state.

## Implementation Tasks

1. Save Agent OS spec documentation.
2. Integrate Section Validation component assets.
3. Persist validation state in `localStorage`.
4. Route `/validation` to the new section.
5. Add `/test-os:*` command docs for section authoring commands.
6. Build and smoke check.

## Acceptance Criteria

- `/validation` renders the Section Validation split-view workspace.
- Suite list renders coverage-map sections grouped by epic.
- Search and filters narrow suites in real time.
- Selecting a suite and story persists across reloads.
- Author Tests shows story list and Gherkin preview.
- Capture Evidence shows up to five screenshot slots for capture-enabled stories.
- Mark Complete remains guarded by 4/4 completed steps.
- Suite completion and reset persist in browser storage.
- Command labels and docs use `/test-os:name-of-command`.
