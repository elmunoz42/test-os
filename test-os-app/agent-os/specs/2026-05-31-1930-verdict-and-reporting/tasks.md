# Tasks — Verdict & Reporting

## Task 1: Save Spec Documentation

- [x] Create `agent-os/specs/2026-05-31-1930-verdict-and-reporting/`.
- [x] Save shaping notes, references, standards, and task plan.
- [x] Reaffirm localStorage persistence and future workspace API roadmap.

## Task 2: Integrate Verdict Assets

- [x] Copy Verdict & Reporting components and types into `src/features/verdict-and-reporting/`.
- [x] Fix local imports for the app source tree.
- [x] Load sample run data as the initial verdict workspace.

## Task 3: Persist Verdict State

- [x] Store active tab, active run, active test case, and emitted prompt IDs in `localStorage`.
- [x] Persist tab changes.
- [x] Persist test-case slide-over selection and close state.
- [x] Persist selected history run and update the dashboard metrics.
- [x] Track emitted fix prompt IDs.

## Task 4: Route the Section

- [x] Render Verdict & Reporting at `/verdict`.
- [x] Keep other future routes as placeholders.
- [x] Update run-count badge to reflect available run history.

## Task 5: Command Names

- [x] Normalize visible sample command references to `/test-os:name-of-command`.
- [x] Add Claude Code command docs for verdict/reporting commands.
- [x] Add matching Cursor-oriented command reference files.

## Task 6: Verify

- [x] Run the production build.
- [x] Smoke check `/verdict` on the dev server.
