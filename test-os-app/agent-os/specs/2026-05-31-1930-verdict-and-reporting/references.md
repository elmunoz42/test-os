# References for Verdict & Reporting

## Product Context

- **Location:** `product-plan/product-overview.md`
- **Relevance:** Defines Test OS entities, milestone sequence, and reporting role.
- **Key patterns:** Verdict & Reporting consumes authored suites and presents run evidence/fix prompts.

## Milestone Instructions

- **Location:** `product-plan/instructions/incremental/04-verdict-and-reporting.md`
- **Relevance:** Defines expected integration work, callback props, and done criteria.
- **Key patterns:** Metrics header, failed-node result tree, test-case slide-over, run history, compare agents.

## Section Assets

- **Location:** `product-plan/sections/verdict-and-reporting/`
- **Relevance:** Provides components, types, sample data, and UI behavior tests.
- **Key patterns:** Run data is nested epic → section → story → test case; active tab/run/test-case are externally controllable.

## Existing App

- **Location:** `src/App.tsx`, `src/features/section-validation/useSectionValidationState.ts`
- **Relevance:** Existing local route shell and `localStorage` hook patterns.
- **Key patterns:** Use section-specific sample normalization and keep future routes as placeholders.
