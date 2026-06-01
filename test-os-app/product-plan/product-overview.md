# Test OS — Product Overview

## Summary

Test OS is the independent validation layer between your codebase and your confidence. It is a standalone, conversation-driven workspace that authors a hidden test suite — oracles, edge cases, and adversarial flows — that the build agent (Cursor) can never read, catching gamed tests and coverage gaps that a visible test suite will always miss.

## Planned Sections

1. **Test Foundation** — Establish the validation charter, coverage map, oracle data, testing standards, and Hermes harness config — the complete foundation before any test authoring begins.
2. **Section Validation** — Per-section authoring loop: shape the test scope, generate fixtures, write Gherkin stories and test cases, and capture screenshot evidence for high-priority flows.
3. **Verdict & Reporting** — Run the full suite against the live app via Hermes, generate the static HTML verdict report, and emit scrubbed fix-prompts for Cursor.
4. **Deployment & Automation** — EC2 + cron setup for nightly unattended validation runs, with results committed back to the Test OS repo and the report always up to date.

## Product Entities

- **Epic** — Top-level grouping from the coverage map; contains sections and drives manifest structure
- **Section** — A discrete area of the application under test; has its own validation suite
- **UserStory** — A human-readable statement of desired behavior; the primary test authoring unit
- **TestCase** — A single executable Gherkin scenario with oracle reference and thin-assertion flag
- **Oracle** — Hidden fixture of golden/expected values, never visible to the build agent
- **Fixture** — Realistic seed data scoped to a section, tied to its oracles
- **HermesConfig** — Executor configuration: base URL, browser provider, timeouts, vision flags
- **TestRun** — A record of one execution pass with pass/fail counts and results.json path
- **Evidence** — Screenshots captured during a run for high-priority user stories
- **FixPrompt** — Scrubbed, oracle-redacted prompt generated from a test failure for Cursor

## Design System

**Colors:**
- Primary: `cyan` — Active states, confirm buttons, progress indicators
- Secondary: `violet` — Oracle/command badges, adversarial scenario highlights
- Neutral: `zinc` — Dark backgrounds (950/900), borders, muted text

**Typography:**
- Heading: Space Grotesk
- Body: Inter
- Mono: JetBrains Mono

## Implementation Sequence

Build Test OS in 5 milestones:

1. **Shell** — Design tokens, Google Fonts, and the application shell with sidebar navigation
2. **Test Foundation** — 5-step wizard: charter, coverage map, oracle data, standards, Hermes config
3. **Section Validation** — Split-view suite authoring with Gherkin editor and screenshot gallery
4. **Verdict & Reporting** — Run dashboard, collapsible result tree, slide-over detail panel, compare agents
5. **Deployment & Automation** — EC2 + cron setup wizard → live status dashboard with run log

Each milestone has a dedicated instruction document in `product-plan/instructions/incremental/`.
