# Section Validation — Shaping Notes

## Scope

Implement the next Test OS section, Section Validation, in the existing React/Vite/Tailwind app. The section should integrate the provided split-view suite authoring workspace, use sample data as the initial state, persist suite progress and selected UI state in `localStorage`, and keep routing gates visual-only for now.

## Decisions

- Use `SECTION_NAME = Section Validation`, `SECTION_ID = section-validation`, and `NN = 03`.
- Reuse the existing Test OS shell and local route state.
- Use `localStorage` for section state in this milestone.
- Keep Foundation/Validation gating visual-only; `/validation` is navigable even if Foundation has not been locked.
- Convert command labels from `/shape-suite` style to `/test-os:shape-suite` style.
- Preserve the product roadmap note that database-backed workspace persistence comes later.

## Context

- **Visuals:** Provided React components and dark design-system styles in `product-plan/sections/section-validation/`.
- **References:** Product overview, Milestone 3 instructions, Section Validation README, tests, types, components, and sample data.
- **Product alignment:** This is Milestone 3 and represents the per-section authoring loop after Foundation is locked.

## Standards Applied

- No additional Agent OS standards were indexed. The repo had an empty `agent-os/standards/index.yml`.
