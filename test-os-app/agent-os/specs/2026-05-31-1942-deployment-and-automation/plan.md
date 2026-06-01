# Plan — Deployment & Automation

## Goal

Implement Deployment & Automation as the final initial Test OS milestone: EC2/cron setup wizard, deployed runner status dashboard, and local run-log refresh simulation.

## Implementation Tasks

1. Save Agent OS spec documentation.
2. Integrate Deployment & Automation component assets.
3. Persist deployment UI state in `localStorage`.
4. Route `/deployment` to the new section.
5. Add `/test-os:*` command docs for deployment operations.
6. Build and smoke check.

## Acceptance Criteria

- `/deployment` renders the setup wizard or deployed dashboard based on persisted mode.
- Confirming setup steps persists completion state and unlocks the next step.
- Completing all 5 setup steps switches to the deployed dashboard.
- Command copy actions fire callbacks and are recorded locally.
- Dashboard shows instance state, ID, region, IP, cron expression, next run, and log tail.
- Refresh Log appends/updates a local log line and persists the refresh.
- `npm run build` passes and `/deployment` serves successfully.
