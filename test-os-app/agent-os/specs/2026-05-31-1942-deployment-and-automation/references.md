# References for Deployment & Automation

## Product Context

- **Location:** `product-plan/product-overview.md`
- **Relevance:** Defines Test OS milestone sequence and deployment automation role.
- **Key patterns:** Deployment & Automation follows Verdict & Reporting and enables nightly unattended validation.

## Milestone Instructions

- **Location:** `product-plan/instructions/incremental/05-deployment-and-automation.md`
- **Relevance:** Defines expected integration work, callback props, status shape, and done criteria.
- **Key patterns:** Sequential 5-step setup wizard, copy-ready commands, deployed dashboard, cron log refresh.

## Section Assets

- **Location:** `product-plan/sections/deployment-and-automation/`
- **Relevance:** Provides components, types, sample data, and UI behavior tests.
- **Key patterns:** Setup mode transitions to deployed mode after all steps complete; dashboard shows instance, cron, and log tail.

## Existing App

- **Location:** `src/App.tsx`, `src/features/verdict-and-reporting/useVerdictState.ts`
- **Relevance:** Existing route shell and `localStorage` state hook patterns.
- **Key patterns:** Use section-specific sample normalization and reset demo state affordance.
