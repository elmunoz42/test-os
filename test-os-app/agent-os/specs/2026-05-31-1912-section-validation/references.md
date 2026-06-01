# References for Section Validation

## Product Context

- **Location:** `product-plan/product-overview.md`
- **Relevance:** Defines Test OS sections, entities, milestone sequence, and design system.
- **Key patterns:** Section Validation follows Foundation and feeds Verdict & Reporting.

## Milestone Instructions

- **Location:** `product-plan/instructions/incremental/03-section-validation.md`
- **Relevance:** Defines expected integration work, callback props, and done criteria.
- **Key patterns:** Split view, suite filters, four-step accordion, story/Gherkin preview, evidence filmstrip.

## Section Assets

- **Location:** `product-plan/sections/section-validation/`
- **Relevance:** Provides components, types, sample data, and UI behavior tests.
- **Key patterns:** Epics group suites; selected suite renders accordion detail; high-priority stories show screenshot capture slots.

## Existing App

- **Location:** `src/App.tsx`, `src/features/test-foundation/useFoundationState.ts`
- **Relevance:** Existing local route shell and `localStorage` state hook patterns.
- **Key patterns:** Use a small section-specific hook and keep route placeholders lightweight.
