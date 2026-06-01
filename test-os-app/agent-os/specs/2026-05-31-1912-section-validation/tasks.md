# Tasks — Section Validation

## Task 1: Save Spec Documentation

- [x] Create `agent-os/specs/2026-05-31-1912-section-validation/`.
- [x] Save shaping notes, references, standards, and task plan.
- [x] Reaffirm localStorage persistence and future database roadmap.

## Task 2: Integrate Section Assets

- [x] Copy Section Validation components and types into `src/features/section-validation/`.
- [x] Fix local imports for the app source tree.
- [x] Load sample data as the initial validation workspace.

## Task 3: Persist Section State

- [x] Store suites, active suite, active story, and filters in `localStorage`.
- [x] Persist suite selection and story selection.
- [x] Persist filter changes.
- [x] Persist suite completion and reset actions.
- [x] Auto-select the next unfinished suite after completion.

## Task 4: Route the Section

- [x] Render Section Validation at `/validation`.
- [x] Keep other future routes as placeholders.
- [x] Surface a phase-complete status that visually unlocks Verdict & Reporting.

## Task 5: Command Names

- [x] Convert suite step command labels to `/test-os:name-of-command`.
- [x] Add Claude Code command docs under `.claude/commands/test-os/`.
- [x] Add matching Cursor-oriented command reference files.

## Task 6: Verify

- [x] Run the production build.
- [x] Smoke check `/validation` on the dev server.
