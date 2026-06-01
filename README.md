# Test OS App

Test OS is a local prototype of an independent validation workspace for agent-built applications. It guides a user from validation planning through suite authoring, verdict review, and deployment automation while keeping oracle data and fix prompts separate from the app under test.

## Run Locally

```bash
cd test-os-app
npm install
npm run dev
```

Open `http://localhost:5173/foundation`.

## Main Routes

- `/foundation` — Test Foundation wizard
- `/validation` — Section Validation suite authoring
- `/verdict` — Verdict & Reporting dashboard
- `/deployment` — Deployment & Automation setup/status

Utility routes such as `/runs`, `/inspector`, `/settings`, and `/help` are placeholders.

## Documentation

- Product handoff: `product-plan/`
- Agent OS specs: `agent-os/specs/`
- Claude commands: `.claude/commands/test-os/`
- Cursor commands: `.cursor/commands/test-os/`
- Hermes/Test OS skill: `skills/hermes-test-os/`

## Current Scope

This is a complete local prototype using React, Vite, TypeScript, Tailwind CSS, and `localStorage` persistence. Real backend persistence, live Hermes execution, EC2 polling, log fetching, and report generation are planned future integrations.
