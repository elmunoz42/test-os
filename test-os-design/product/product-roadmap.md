# Product Roadmap

## Sections

### 1. Test Foundation
Establish the validation charter, coverage map, oracle data, testing standards, and Hermes harness config — the complete foundation before any test authoring begins.

### 2. Section Validation
Per-section authoring loop: shape the test scope, generate fixtures, write Gherkin stories and test cases, and capture screenshot evidence for high-priority flows.

### 3. Verdict & Reporting
Run the full suite against the live app via Hermes, generate the static HTML verdict report, and emit scrubbed fix-prompts for Cursor.

### 4. Deployment & Automation
EC2 + cron setup for nightly unattended validation runs, with results committed back to the Test OS repo and the report always up to date.
