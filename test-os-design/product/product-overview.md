# Test OS

## Description
Test OS is the independent validation layer between your codebase and your confidence. It is a standalone, conversation-driven workspace that authors a hidden test suite — oracles, edge cases, and adversarial flows — that the build agent (Cursor) can never read, catching gamed tests and coverage gaps that a visible test suite will always miss.

## Problems & Solutions

### Problem 1: Builders optimize against tests they can read
When the build agent has access to test definitions and expected values, it can hardcode implementations to pass those tests without producing correct behavior. Test OS authors its suite in a separate workspace with oracle values the builder never sees — so the only way to pass is to actually work.

### Problem 2: Happy-path tests miss edge cases and failure modes
The visible `test.md` captures the success path; Cursor writes tests from it and stops there. Test OS adds a second layer — failure modes, locked accounts, adversarial inputs, and exact expected values — that the visible layer systematically skips.

### Problem 3: No adversarially independent validation
Without structural separation between builder and validator, every test suite is self-graded. Test OS enforces separation via a standalone workspace, `.cursorignore`, and a Cursor rule — making the independence architectural, not procedural.

### Problem 4: Generated code is too large a review surface
Reviewing hundreds of lines of implementation code is expensive and unreliable. Behaviors expressed as Gherkin (Given / When / Then) are a fraction of that surface and are readable by non-engineers — so the human reviews intent, not implementation.

### Problem 5: Validation results are scattered and hard to act on
Without a structured verdict, failures are raw test output. Test OS generates a static HTML report organized by epic → section → story, with thin-assertion flags, coverage gaps, screenshots, and cross-agent comparison — plus `/fix-prompts` scrubbed of oracle values so Cursor gets actionable feedback without leaking what's being tested.

## Key Features
- Two-layer testing: visible layer Cursor owns, hidden layer Test OS owns
- `TEST-MANIFEST.json` spine organizing epics → sections → stories → test cases
- Oracle data (golden/expected values) stored outside the app repo, invisible to the builder
- Gherkin authoring for human-readable, reviewable test intent
- Hermes execution model — LLM-driven browser automation with native vision
- Screenshot capture + vision analysis for high-priority user stories
- Static HTML verdict report with pass/fail, thin-assertion flags, and coverage gaps
- EC2 + cron deployment for nightly automated validation runs
- `/fix-prompts` that scrub oracle values before feeding failures back to Cursor
- Multi-agent comparison: same suite run against multiple build agents side by side
- Incremental validation mode: validate a section as soon as the builder finishes it
