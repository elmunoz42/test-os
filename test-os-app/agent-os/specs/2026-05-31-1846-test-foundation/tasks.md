# Tasks — Test Foundation

## Task 1: Save Spec Documentation

- [x] Create `agent-os/specs/2026-05-31-1846-test-foundation/`.
- [x] Save shaping notes, references, standards, and task plan.
- [x] Capture roadmap note for future database-backed persistence.

## Task 2: Scaffold the React App

- [x] Add Vite, React, TypeScript, and Tailwind project files.
- [x] Load the Test OS fonts and design tokens.
- [x] Add base styles for the dark Test OS surface.

## Task 3: Integrate Shell Navigation

- [x] Copy shell components into the app source.
- [x] Wire `activeHref` and `onNavigate` through local route state.
- [x] Provide placeholder screens for routes outside Test Foundation.

## Task 4: Integrate Test Foundation

- [x] Copy Test Foundation components and types into the app source.
- [x] Load sample data as the initial state.
- [x] Convert command labels to `/test-os:name-of-command`.

## Task 5: Persist Wizard State

- [x] Store phase and step state in `localStorage`.
- [x] Persist field edits immediately.
- [x] Confirming a step marks it complete and unlocks the next step.
- [x] Confirming all steps reveals the Approve & Lock panel.
- [x] Approve & Lock seals the phase and shows the locked banner.

## Task 6: Add Slash Command Docs

- [x] Add Claude Code command files under `.claude/commands/test-os/` so commands resolve as `/test-os:name-of-command`.
- [x] Add matching local command reference files for Cursor-oriented usage.

## Task 7: Verify

- [x] Install dependencies.
- [x] Run TypeScript and production build checks.
- [x] Start the local dev server and provide the URL.
