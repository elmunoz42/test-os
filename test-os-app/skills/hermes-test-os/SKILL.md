---
name: hermes-test-os
description: Use when Codex needs to operate, adapt, extend, test, or troubleshoot the Test OS app and its Hermes validation workflow for a given project, including foundation setup, section validation suites, verdict reporting, fix prompt emission, run history, build-agent comparison, EC2/cron deployment automation, or any request mentioning Hermes agent, Test OS validation, hidden oracles, project adaptation, results.json, report.html, run-tests.sh, or /test-os commands.
---

# Hermes Test OS

## Core Rules

- Preserve adversarial separation: never expose oracle fixture values or hidden expected data to build-agent prompts.
- Treat Test OS as the validation workspace, not the application under test.
- Use `/test-os:*` command names in UI text, docs, and generated workflows.
- Prefer existing app patterns in `src/features/*/use*State.ts` for state, persistence, and demo resets.
- Use `localStorage` for this prototype unless the user explicitly asks for backend persistence.
- Run `npm run build` after code changes and smoke-check the relevant route with `curl -I`.

## Workflow

1. Identify the Test OS phase involved:
   - Foundation: `/foundation`
   - Section Validation: `/validation`
   - Verdict & Reporting: `/verdict`
   - Deployment & Automation: `/deployment`

2. Read the relevant local files before editing:
   - App routing: `src/App.tsx`
   - Feature UI: `src/features/<section>/`
   - Sample normalization: `src/data/*Sample.ts`
   - Product handoff: `product-plan/sections/<section>/`
   - Agent OS spec: `agent-os/specs/*-<section>/`

3. For Hermes-style validation work:
   - Ensure Foundation is locked or visually note that the prototype only gates visually.
   - Use Section Validation suites to inspect stories, Gherkin, fixture status, and screenshot evidence plans.
   - Use Verdict & Reporting for run metrics, failed test-case details, thin assertions, coverage gaps, fix prompts, history, and agent comparison.
   - Use Deployment & Automation for runner setup, cron config, and `cron.log` status.

4. For fixes and prompts:
   - Summarize failures from `errorMessage`, `gherkin`, and actual/expected diffs.
   - Emit fix guidance from `fixPrompt` only when it is already scrubbed.
   - Do not include raw oracle file contents or fixture values in user-facing build-agent instructions.

5. For implementation changes:
   - Save or update an Agent OS spec/task note when adding a significant workflow.
   - Keep route placeholders lightweight and visual-only unless the user asks for real guards.
   - Normalize sample command mentions with `/test-os:name-of-command`.
   - Update matching `.claude/commands/test-os/` and `.cursor/commands/test-os/` docs when adding commands.

## Adapt Test OS to a Project

Use this workflow when the user asks Hermes/Codex to adapt Test OS for a specific app or repository.

1. Inspect the target project first:
   - product docs, README, routes, user workflows, data models, and existing tests
   - package scripts or run commands
   - screenshots, fixtures, seeds, or API contracts if present

2. Convert project context into Test OS state:
   - Foundation: app charter, personas, critical journeys, acceptance criteria, oracle boundaries, and Hermes config
   - Section Validation: epics, user stories, Gherkin cases, suite priorities, fixture needs, and evidence plans
   - Verdict: expected result taxonomy, failure categories, fix-prompt style, and agent comparison dimensions
   - Deployment: local or remote runner commands, environment variables, cron cadence, log paths, and report path

3. Update local sample/state sources rather than hard-coding UI copy:
   - `product-plan/sections/*/sample-data.json`
   - `src/data/*Sample.ts` only when normalization needs to change
   - feature types only when the target project requires new fields

4. Preserve validation integrity:
   - keep oracle fixtures and hidden expected values inside Test OS-owned data
   - never write hidden oracle values into build-agent prompts, app-under-test files, public docs, or emitted fix prompts
   - scrub fix prompts so they describe behavior and failure evidence without leaking hidden answers

5. Deliver a project handoff:
   - list adapted routes/suites
   - list any required manual project inputs
   - state which flows remain mocked/local
   - run `npm run build` and smoke-check the primary adapted route

## Useful Commands

```bash
npm run build
curl -I http://localhost:5173/foundation
curl -I http://localhost:5173/validation
curl -I http://localhost:5173/verdict
curl -I http://localhost:5173/deployment
```

Start the local app with:

```bash
npm run dev
```

## Command Map

- `/test-os:test-charter` — validation charter
- `/test-os:test-roadmap` — coverage map
- `/test-os:oracle-data` — hidden oracle fixture definitions
- `/test-os:test-standards` — testing conventions
- `/test-os:test-harness` — Hermes config
- `/test-os:shape-suite` — section suite scope
- `/test-os:suite-fixtures` — suite fixtures
- `/test-os:author-tests` — Gherkin stories and test cases
- `/test-os:capture-evidence` — screenshot evidence plan
- `/test-os:run-validation` — full Hermes run
- `/test-os:export-report` — static report workflow
- `/test-os:emit-fix-prompt` — scrubbed fix prompt
- `/test-os:compare-agents` — cross-agent comparison
- `/test-os:launch-runner` — EC2 runner launch
- `/test-os:install-runner-deps` — runner dependencies
- `/test-os:clone-workspace` — runner workspace clone
- `/test-os:configure-runner-secrets` — runner secrets
- `/test-os:setup-cron` — nightly cron setup
- `/test-os:refresh-runner-log` — runner log tail refresh

## References

Read `references/test-os-app.md` when you need route details, storage keys, source locations, or current prototype boundaries.
