# Deployment & Automation

## Overview

Deployment & Automation is a mode-switching section: when first opened it shows a 5-step setup wizard for configuring the EC2 runner and cron schedule; once all steps are confirmed it automatically switches to a live status dashboard showing a compact instance/cron summary header and a scrollable run log tail.

## User Flows

- User arrives at setup wizard; Steps 1–2 may already be complete from a previous session
- User copies shell commands from each step's command blocks (hover to reveal copy button)
- User confirms each step to unlock the next; sequential locking enforces the correct setup order
- After confirming all 5 steps, the view automatically switches to the status dashboard
- Status dashboard shows instance state chip (pulsing green when running), instance ID/region/IP, cron expression, and next scheduled run time
- User scrolls the run log to review the latest cron.log output; clicks Refresh to pull latest lines

## Design Decisions

- **Copy buttons are hover-reveal** — appear on command block hover, keeping the terminal clean
- **Mode auto-advances** — after confirming Step 5, a 400ms delay then smooth switch to the dashboard
- **Status chips feel live** — instance state dot pulses when running; "Runner active" subtitle has its own pulse
- **Log level color-coding** — `info` zinc, `warn` amber, `error` red; stands out immediately

## Data Shapes

**Entities:** `SetupStep`, `SetupCommand`, `InstanceStatus`, `CronConfig`, `LogLine`

**Key enum:** `DeploymentMode` = `'setup' | 'deployed'`

## Components

- `DeploymentAndAutomation` — Root component; manages mode switching
- `SetupWizard` — 5-step wizard with inline step pipeline, command blocks, and confirm flow
- `StatusDashboard` — Compact status header chips + scrollable terminal log pane

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onConfirmStep(stepId)` | User confirms a setup step |
| `onCopyCommand(command)` | User copies a shell command to clipboard |
| `onRefreshLog()` | User clicks Refresh Log in the status dashboard |
