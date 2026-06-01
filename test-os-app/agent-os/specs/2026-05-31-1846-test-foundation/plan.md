# Plan — Test Foundation

## Goal

Implement the first Test OS section in `test-os-app`: a React/Vite/Tailwind app shell with the Test Foundation wizard wired to browser persistence.

## Implementation Tasks

1. Save Agent OS spec documentation.
2. Scaffold the React app.
3. Integrate shell navigation.
4. Integrate the Test Foundation section assets.
5. Persist wizard state in `localStorage`.
6. Add `/test-os:name-of-command` command docs.
7. Install dependencies, build, and run the dev server.

## Acceptance Criteria

- The app renders the dark Test OS shell at `/foundation`.
- Test Foundation displays five ordered steps with locked, active, and complete visual states.
- Edits to active-step fields persist across reloads.
- Confirming a step writes state, collapses it, and unlocks the next step.
- All five confirmed steps reveal the Approve & Lock panel.
- Approve & Lock seals the phase and displays the locked banner.
- Command labels and command docs use `/test-os:name-of-command`.
- Future database persistence is noted in the Agent OS roadmap.
