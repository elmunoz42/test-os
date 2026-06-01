# UI Data Shapes

These types define the shape of data that the UI components expect to receive as props. They represent the **frontend contract** — what the components need to render correctly.

How you model, store, and fetch this data on the backend is an implementation decision. You may combine, split, or extend these types to fit your architecture.

## Entities by Section

- **FoundationStep** — A wizard step in the Test Foundation phase; has commands, status, and editable fields (used in: test-foundation)
- **FoundationPhase** — Overall state of the Test Foundation wizard (used in: test-foundation)
- **EditableField** — A user-editable key-value field within a foundation step (used in: test-foundation)
- **Epic** — Top-level grouping from the coverage map (used in: section-validation, verdict-and-reporting)
- **SectionSuite** — One app section as a validation suite with 4 authoring steps (used in: section-validation)
- **ValidationStepInfo** — One of the 4 authoring steps within a suite (used in: section-validation)
- **UserStory** — A behavioral story with Gherkin, priority, and screenshot flag (used in: section-validation)
- **Screenshot** — Evidence captured by Hermes for a high-priority story (used in: section-validation)
- **TestCase** — A single executable test scenario with expected/actual results (used in: verdict-and-reporting)
- **RunSummary** — A single execution pass with pass/fail totals and metadata (used in: verdict-and-reporting)
- **ThinAssertionFlag** — A test case flagged as potentially trivially passing (used in: verdict-and-reporting)
- **CoverageGap** — A section with no passing behavioral test in the latest run (used in: verdict-and-reporting)
- **AgentComparison** — One test case's results across multiple build agents (used in: verdict-and-reporting)
- **SetupStep** — A wizard step in the Deployment & Automation setup (used in: deployment-and-automation)
- **InstanceStatus** — EC2 instance metadata: state, ID, region, IP (used in: deployment-and-automation)
- **CronConfig** — Cron schedule configuration with next/last run times (used in: deployment-and-automation)
- **LogLine** — A single line from cron.log with level and message (used in: deployment-and-automation)

## Per-Section Types

Each section includes its own `types.ts` with full interface definitions:

- `sections/test-foundation/types.ts`
- `sections/section-validation/types.ts`
- `sections/verdict-and-reporting/types.ts`
- `sections/deployment-and-automation/types.ts`

## Combined Reference

See `overview.ts` for all entity types aggregated in one file.
