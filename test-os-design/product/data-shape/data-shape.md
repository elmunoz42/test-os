# Data Shape

## Entities

### Epic
A top-level grouping of related product functionality, sourced from the Design OS product roadmap. Organizes sections and drives the structure of the manifest and HTML report.

### Section
A discrete area of the application under test, corresponding to a Design OS section design. Each section has its own validation suite and maps to a Design OS `test.md`.

### UserStory
A human-readable statement of desired behavior synthesized from a section's `test.md` success/failure paths and Agent OS task acceptance criteria. The primary unit of test authoring and the main review surface.

### TestCase
A single executable scenario within a user story, expressed as Gherkin (Given/When/Then) with preconditions, expected behavior, and a reference to an oracle. The leaf node of the manifest hierarchy.

### Oracle
A hidden fixture of golden/expected values tied to one or more test cases. Lives in `oracles/` outside the app repo and is never visible to the build agent — this is the anti-gaming core of Test OS.

### Fixture
Realistic seed data scoped to a section, tied to its oracles. Generated during `/suite-fixtures` to give test cases concrete, non-trivial inputs.

### HermesConfig
The executor configuration: base URL, browser provider, screenshot settings, timeouts, and vision flags. Read by Hermes at run time; one config per Test OS workspace.

### TestRun
A record of one execution pass: timestamp, executor, build agent, pass/fail counts by epic, and a path to the raw `results.json`. Supports multi-agent comparison.

### Evidence
Screenshots and traces captured during a test run for high-priority user stories. Stored in `evidence/screenshots/` and embedded in the HTML report with vision analysis notes.

### FixPrompt
A scrubbed, actionable prompt generated from a test failure and handed back to the build agent (Cursor). Oracle values are redacted so the fix loop never leaks what is being tested.

## Relationships

- Epic has many Sections
- Section has many UserStories
- UserStory has many TestCases
- TestCase references one Oracle
- TestCase may produce many Evidence items (when captureScreenshot is true)
- TestRun records results for many TestCases
- TestRun produces many FixPrompts (one per failure)
- Section has many Fixtures
- Fixture is referenced by TestCases within the same Section
- HermesConfig configures TestRun execution
