# Test Specs: Deployment & Automation

Framework-agnostic UI behavior specs. Adapt to your testing setup.

## Overview

Deployment & Automation is a mode-switching section: setup wizard (mode='setup') → status dashboard (mode='deployed'). The wizard has 5 sequential steps with command blocks; the dashboard shows live instance/cron status and a run log tail.

---

## User Flow Tests

### Flow 1: Copy a Shell Command

**Scenario:** User hovers a command block and copies the command.

**Setup:** Step 3 (Clone Workspace) is active; it has 2 commands.

**Steps:**
1. User sees Step 3 expanded with "Clone the Test OS repo" command block
2. User hovers over the command block
3. User clicks the "Copy" button that appears

**Expected Results:**
- [ ] "Copy" button transitions to "Copied" with a green check for ~2 seconds
- [ ] `onCopyCommand` is called with the command string
- [ ] Copy button returns to default state after 2 seconds

---

### Flow 2: Confirm a Step and Advance

**Scenario:** User confirms the active step.

**Setup:** Steps 1–2 complete; Step 3 active; Steps 4–5 locked.

**Steps:**
1. User sees Step 3 expanded with its commands
2. User clicks "Confirm Step"

**Expected Results:**
- [ ] Step 3 collapses to a summary row with a green check and today's date
- [ ] Step 4 (Configure Secrets) expands as the new active step
- [ ] Step 5 remains locked
- [ ] `onConfirmStep` is called with `'clone-workspace'`
- [ ] Step pipeline node 3 shows a filled cyan check

---

### Flow 3: Complete All 5 Steps → Switch to Dashboard

**Scenario:** User confirms the final step and the view switches to the deployed status dashboard.

**Setup:** Steps 1–4 complete; Step 5 active.

**Steps:**
1. User confirms Step 5 (Set Up Cron)

**Expected Results:**
- [ ] Brief delay (~400ms), then the wizard is replaced by the status dashboard
- [ ] Status dashboard header shows "Phase 04" and "Runner active" subtitle with pulse dot
- [ ] EC2 instance state chip is visible (e.g., "running" with emerald dot)
- [ ] Cron expression chip shows "0 2 * * *"
- [ ] Run log is visible with monospace lines
- [ ] `onConfirmStep` is called with `'setup-cron'`

---

### Flow 4: Refresh the Run Log

**Scenario:** User clicks Refresh on the status dashboard.

**Setup:** `mode: 'deployed'`; log pane shows 19 log lines.

**Steps:**
1. User sees the cron.log pane
2. User clicks "Refresh"

**Expected Results:**
- [ ] The Refresh button shows a spinning `RefreshCw` icon briefly (~1.2s)
- [ ] Icon stops spinning after the mock refresh completes
- [ ] `onRefreshLog` is called

---

## Status Dashboard Tests

### Instance State Chips

- [ ] `state: 'running'` shows a pulsing emerald dot and "running" label in green
- [ ] `state: 'stopped'` shows a red dot and "stopped" label in red
- [ ] `state: 'pending'` shows an amber dot and "pending" label in amber
- [ ] Instance ID, region, and public IP are each displayed as separate info chips

### Log Level Colors

- [ ] Lines with `level: 'info'` appear in zinc-300 text
- [ ] Lines with `level: 'warn'` appear in amber-300 text
- [ ] Lines with `level: 'error'` appear in red-300 text

---

## Wizard Tests

### Sequential Locking

- [ ] Only the step after the last confirmed step is shown as active
- [ ] Steps before the active step show green check rows (collapsed)
- [ ] Steps after the active step show locked rows (dimmed, lock icon)
- [ ] Clicking a locked row does nothing

### Step Pipeline

- [ ] 5 nodes are connected by horizontal lines
- [ ] Complete nodes show a filled cyan circle with check
- [ ] Active node shows the step number (e.g., "03") with a ping animation
- [ ] Locked nodes show a lock icon with 50% opacity

---

## Edge Cases

- [ ] Command blocks with multi-line commands using `\` render without broken formatting
- [ ] A step with a non-null `confirmedAt` shows the formatted date in the collapsed row
- [ ] `instanceStatus.publicIp: null` — the IP chip is not rendered (no empty chip)
- [ ] `cronConfig.nextRunAt: null` — the next run chip shows "—"
- [ ] Empty `logLines: []` shows "No log output yet" placeholder text

---

## Sample Test Data

```typescript
const setupMode = {
  mode: 'setup' as const,
  steps: [
    { id: 'launch-ec2',   order: 1, title: 'Launch EC2 Instance',     status: 'complete' as const, confirmedAt: '2026-05-30T10:14:00Z', commands: [], description: '' },
    { id: 'install-deps', order: 2, title: 'Install Dependencies',    status: 'complete' as const, confirmedAt: '2026-05-30T10:22:00Z', commands: [], description: '' },
    { id: 'clone-workspace', order: 3, title: 'Clone Test OS Workspace', status: 'active' as const, confirmedAt: null,
      description: 'Clone the repo and install deps.',
      commands: [{ label: 'Clone repo', command: 'git clone https://github.com/YOUR_ORG/test-os.git ~/test-os', comment: null }] },
    { id: 'configure-secrets', order: 4, title: 'Configure Secrets',  status: 'locked' as const, confirmedAt: null, commands: [], description: '' },
    { id: 'setup-cron',   order: 5, title: 'Set Up Cron Schedule',    status: 'locked' as const, confirmedAt: null, commands: [], description: '' },
  ],
}

const deployedMode = {
  mode: 'deployed' as const,
  instanceStatus: { instanceId: 'i-0a4f23e9d7b81c530', region: 'us-east-1', state: 'running' as const, publicIp: '54.211.88.43', tag: 'test-os-runner' },
  cronConfig: { expression: '0 2 * * *', nextRunAt: '2026-06-01T02:00:00Z', lastRunAt: '2026-05-31T02:00:00Z', scriptPath: '/home/ubuntu/test-os/run-tests.sh' },
  logLines: [
    { timestamp: '2026-05-31T02:00:01Z', level: 'info' as const, message: 'Starting Test OS run' },
    { timestamp: '2026-05-31T02:01:28Z', level: 'warn' as const, message: 'Vision analysis slow — browser response >2s' },
  ],
}
```
