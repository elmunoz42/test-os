# Milestone 5: Deployment & Automation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1–4 complete

---

## About This Handoff

**What you're receiving:** Finished UI designs, specs, sample data, and test specs for the Deployment & Automation section.
**Your job:** Wire setup step completions to workspace persistence, connect live EC2 status and cron config, and implement the run log tail fetch.

---

## Goal

Implement Deployment & Automation — the mode-switching setup wizard and live status dashboard for the EC2 + cron runner.

## Overview

When first loaded, shows a 5-step wizard for configuring the EC2 instance and cron schedule. Each step has copy-ready shell commands. Confirming all 5 steps automatically switches to a live status dashboard showing the EC2 instance state, cron schedule, and a scrollable run log tail.

**Key Functionality:**
- 5-step sequential wizard (Launch EC2 → Install Deps → Clone Workspace → Configure Secrets → Set Up Cron)
- Per-step copy-ready command blocks (hover to reveal copy button)
- Step confirmation persists completion state and unlocks the next step
- After step 5 confirmed: auto-switch to deployed status dashboard
- Status dashboard: instance state chip (pulsing when running), instance ID, region, IP, cron expression, next run time
- Scrollable run log with log level color-coding (info/warn/error)
- Refresh Log button pulls the latest cron.log lines

## Components Provided

Copy from `product-plan/sections/deployment-and-automation/components/`:

- `DeploymentAndAutomation` — Root component; manages `mode` state (setup/deployed)
- `SetupWizard` — 5-step wizard with step pipeline, command blocks, and confirm flow
- `StatusDashboard` — Status header chips + scrollable terminal log pane
- `index.ts` — Re-exports

## Props Reference

```typescript
interface DeploymentAndAutomationProps {
  mode: 'setup' | 'deployed'
  steps: SetupStep[]
  instanceStatus: InstanceStatus | null
  cronConfig: CronConfig | null
  logLines: LogLine[]
  onConfirmStep?: (stepId: string) => void
  onCopyCommand?: (command: string) => void
  onRefreshLog?: () => void
}
```

Full types in `product-plan/sections/deployment-and-automation/types.ts`.

## Expected User Flows

### Flow 1: Complete the Setup Wizard

1. User copies commands from each step and confirms them in order
2. After confirming step 5
3. **Outcome:** View auto-switches to the status dashboard (brief 400ms delay)

### Flow 2: View Live Instance Status

1. Mode is `'deployed'`; `instanceStatus.state` is `'running'`
2. **Outcome:** Pulsing emerald dot, "running" chip, instance ID/region/IP, cron expression, next run time are all visible

### Flow 3: Refresh the Run Log

1. User clicks "Refresh" on the status dashboard
2. **Outcome:** Spinner shows briefly; `onRefreshLog` fires; latest log lines update

## EC2 Status Integration

You'll need to poll or webhook your EC2 instance to get live `instanceStatus`. The component expects:

```typescript
{
  instanceId: string    // "i-0a4f23e9d7b81c530"
  region: string        // "us-east-1"
  state: 'running' | 'stopped' | 'pending' | 'unknown'
  publicIp: string | null
  tag: string           // "test-os-runner"
}
```

## Log Tail Integration

`logLines` is a slice of the cron.log. When `onRefreshLog` fires, fetch the latest N lines from the EC2 instance (via SSH, S3 upload from the run script, or a simple log endpoint) and update the prop.

## Testing

See `product-plan/sections/deployment-and-automation/tests.md`.

## Files to Reference

- `product-plan/sections/deployment-and-automation/README.md`
- `product-plan/sections/deployment-and-automation/tests.md`
- `product-plan/sections/deployment-and-automation/components/`
- `product-plan/sections/deployment-and-automation/types.ts`
- `product-plan/sections/deployment-and-automation/sample-data.json`

## Done When

- [ ] Wizard renders with persisted step completion state on page load
- [ ] Command copy works; "Copied" feedback shows and resets after 2s
- [ ] Confirming a step writes completion state and unlocks the next step
- [ ] Confirming step 5 triggers the mode switch to the status dashboard
- [ ] Status dashboard shows live EC2 state (running/stopped/pending)
- [ ] Cron expression and next run time are displayed
- [ ] Run log shows color-coded log lines (info=zinc, warn=amber, error=red)
- [ ] Refresh Log fetches latest log lines from the EC2 instance
- [ ] Responsive on mobile
