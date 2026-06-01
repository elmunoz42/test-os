# Verdict & Reporting Specification

## Overview
Verdict & Reporting is the payoff screen of Test OS — the dashboard where validation run results are surfaced, analyzed, and acted upon. It shows the latest run's summary metrics and a collapsible epic → section → story result tree, with a slide-over panel for failed test case details, Emit Fix Prompt actions, run history, and cross-agent comparison.

## User Flows
- User arrives at Verdict & Reporting and sees the run dashboard for the most recent run: summary metrics (total tests, pass/fail counts, duration, build agent, run timestamp), thin-assertion flags, and coverage gaps
- User expands an epic in the collapsible result tree to see its sections; expands a section to see its stories and test cases; each node shows pass/fail counts, with failed nodes visually distinct in red
- User clicks a story or test case row to open the slide-over panel: Gherkin (syntax-highlighted), expected behavior, actual result (or error), embedded screenshot thumbnail if captured, and an Emit Fix Prompt button
- User clicks Emit Fix Prompt in the slide-over — a scrubbed prompt (oracle values redacted) is copied to clipboard with a brief confirmation toast
- User clicks Run Validation — a modal appears with the run-tests.sh command ready to copy
- User clicks Export Report — report.html opens in a new browser tab
- User switches to the History tab to see a table of past runs with date, build agent, pass/fail totals, and duration; clicking a run loads its verdict into the main dashboard
- When run history contains 2+ distinct build agents, a Compare Agents tab appears showing a table of test cases as rows and build agents as columns with pass/fail results per cell

## UI Requirements
- Three tabs at the top: Verdict (default), History, and Compare Agents (only visible when multiple build agents exist in run history)
- Verdict tab header: run timestamp, build agent badge, total/pass/fail counts as stat chips, duration
- Thin-assertion flags section: collapsible list of flagged test cases showing test case ID, story title, and reason; amber accent
- Coverage gaps section: collapsible list of sections with no passing behavioral test; violet accent
- Result tree: epics are top-level collapsible rows with pass/fail progress bar; expanding shows sections, expanding sections shows stories, expanding stories shows individual test cases
- Each tree node shows: name, passed count (emerald), failed count (red); failed nodes have a red left-border accent
- Passed stories show a subtle emerald check; failed stories show a red X
- Clicking any story or test case row opens the slide-over panel
- Slide-over panel: full-height panel sliding in from the right (~480px wide); shows story title, Gherkin with syntax highlighting, expected behavior block, actual result block (error highlighted in red if mismatch), screenshot thumbnail if available, and Emit Fix Prompt button pinned to the bottom
- Emit Fix Prompt copies a formatted scrubbed prompt to clipboard and shows a "Copied!" toast for 2 seconds
- Run Validation modal: shows the `./run-tests.sh` command with a copy button; closes on dismiss
- History tab: table with columns — run ID (monospace), date, build agent, passed, failed, duration, status chip; clicking a row loads that run
- Compare Agents tab: sticky header row of agent names; each test case row shows pass/fail icon per agent; rows grouped by epic; failed-only filter toggle

## Configuration
- shell: true
