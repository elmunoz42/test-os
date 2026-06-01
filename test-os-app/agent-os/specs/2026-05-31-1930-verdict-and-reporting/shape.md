# Verdict & Reporting — Shaping Notes

## Scope

Implement the next Test OS section, Verdict & Reporting, in the existing React/Vite/Tailwind app. The section should integrate the provided run dashboard, result tree, test-case slide-over, history table, and compare-agents view. Use the provided sample Hermes result data as the initial local source and persist UI selections in `localStorage`.

## Decisions

- Use `SECTION_NAME = Verdict & Reporting`, `SECTION_ID = verdict-and-reporting`, and `NN = 04`.
- Reuse the existing Test OS shell and local route state.
- Use `localStorage` for active tab, active run, active test case, and emitted fix prompt history in this milestone.
- Keep Hermes execution/report export mocked through UI actions: Run Validation opens the provided command modal; Export Report opens `/report.html`.
- Normalize visible command references to `/test-os:name-of-command`.
- Preserve the roadmap note that real Hermes result persistence moves to a database/workspace API later.

## Context

- **Visuals:** Provided React components and dark dashboard UI in `product-plan/sections/verdict-and-reporting/`.
- **References:** Product overview, Milestone 4 instructions, Verdict README, tests, types, components, and sample data.
- **Product alignment:** This is Milestone 4 and represents the payoff screen after Section Validation authoring.

## Standards Applied

- No additional Agent OS standards were indexed. The repo had an empty `agent-os/standards/index.yml`.
