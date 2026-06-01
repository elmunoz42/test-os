# Tasks — Deployment & Automation

## Task 1: Save Spec Documentation

- [x] Create `agent-os/specs/2026-05-31-1942-deployment-and-automation/`.
- [x] Save shaping notes, references, standards, and task plan.
- [x] Reaffirm localStorage persistence and future live EC2/log integration.

## Task 2: Integrate Deployment Assets

- [x] Copy Deployment & Automation components and types into `src/features/deployment-and-automation/`.
- [x] Fix local imports for the app source tree.
- [x] Load sample setup, EC2, cron, and log data as the initial deployment workspace.

## Task 3: Persist Deployment State

- [x] Store mode, steps, instance status, cron config, logs, copied commands, and refresh timestamp in `localStorage`.
- [x] Persist step confirmations and sequential unlocking.
- [x] Switch to deployed mode after all five setup steps complete.
- [x] Persist copied command events.
- [x] Simulate Refresh Log by appending a fresh local log line.

## Task 4: Route the Section

- [x] Render Deployment & Automation at `/deployment`.
- [x] Keep remaining utility routes as placeholders.
- [x] Surface deployment status in placeholder route context.

## Task 5: Command Docs

- [x] Add Claude Code command docs for deployment/setup commands.
- [x] Add matching Cursor-oriented command reference files.

## Task 6: Verify

- [x] Run the production build.
- [x] Smoke check `/deployment` on the dev server.
