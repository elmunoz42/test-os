# Test Foundation — Shaping Notes

## Scope

Implement the first Test OS section, Test Foundation, in the `test-os-app` directory. The app should use React, Vite, TypeScript, and Tailwind CSS; integrate the provided shell and Test Foundation components; persist wizard state in `localStorage`; and show locked/progress states visually for now.

## Decisions

- Use `SECTION_NAME = Test Foundation`, `SECTION_ID = test-foundation`, and `NN = 02`.
- Scaffold the application in this directory because no existing React app scaffold was present.
- Use `localStorage` for persisted phase and step state in this milestone.
- Add a roadmap note to move persistence to a database-backed workspace API in a future phase.
- Keep route guarding visual-only for now: navigation remains available, but non-implemented routes show locked/placeholder screens.
- Use Test OS slash command names in the form `/test-os:name-of-command`.

## Context

- **Visuals:** Provided React components and design-system tokens in `product-plan/`.
- **References:** Product overview, shell components, Test Foundation README, tests, types, components, and sample data.
- **Product alignment:** This is Milestone 2 in the product plan and establishes the validation foundation before section-level authoring.

## Standards Applied

- No additional Agent OS standards were indexed. The repo had an empty `agent-os/standards/index.yml`.
