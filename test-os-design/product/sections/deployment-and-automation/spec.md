# Deployment & Automation Specification

## Overview
Deployment & Automation is a mode-switching section: when first opened it shows a 5-step setup wizard for configuring the EC2 runner and cron schedule; once the deployment is confirmed it switches to a status dashboard showing a compact instance/cron summary header and a scrollable run log tail. Copy-ready shell commands are surfaced at every wizard step.

## User Flows
- User arrives at Deployment & Automation and sees the setup wizard (if deployment has not been configured)
- User works through the 5 steps in order: Launch EC2, Install Dependencies, Clone Workspace, Configure Secrets, Set Up Cron — each step shows copy-ready shell commands and a Confirm button
- User copies a command to clipboard; the copy button shows a brief confirmation before resetting
- User confirms each step to advance; steps are sequentially locked
- After confirming all 5 steps, the section switches to the status dashboard
- In the status dashboard, a compact header shows EC2 instance state (running/stopped), instance ID, region, public IP, cron expression, and next scheduled run time
- Below the header, a scrollable run log shows the last N lines of cron.log with log level coloring
- User clicks Refresh Log to pull the latest log lines

## UI Requirements
- Mode toggle: when mode is 'setup', render the 5-step wizard; when mode is 'deployed', render the status dashboard
- Setup wizard: same step-pipeline and sequential-lock pattern as Test Foundation; each step is expanded when active, collapsed when complete, dimmed when locked
- Each active step shows: step number (monospace), title, description, one or more copy-ready command blocks, and a Confirm button
- Command blocks use a terminal-style dark code area with a copy icon; clicking copies to clipboard and shows a brief "Copied!" state
- Status dashboard header: row of status chips — instance state chip (green=running, red=stopped, amber=pending), instance ID, region, IP, cron expression chip, and next run countdown or timestamp
- Below header: a fixed-height scrollable log pane styled as a terminal (dark background, monospace, log level color coding — info=zinc, warn=amber, error=red)
- A Refresh Log button above the log pane; shows a brief spinner while refreshing
- Log lines include timestamp, level badge, and message

## Configuration
- shell: true
