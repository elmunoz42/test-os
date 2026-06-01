# Section Implementation Prompt

## Define Section Variables Before Using

- **SECTION_NAME** = [Human-readable name, e.g., "Test Foundation" or "Verdict & Reporting"]
- **SECTION_ID** = [Folder name in sections/, e.g., "test-foundation" or "verdict-and-reporting"]
- **NN** = [Milestone number, e.g., "02" — sections start at 02 since 01 is Shell]

---

I need you to implement the **SECTION_NAME** section of my Test OS application.

## Instructions

Please carefully read and analyze the following files:

1. **@product-plan/product-overview.md** — Product summary for overall context
2. **@product-plan/instructions/incremental/NN-SECTION_ID.md** — Specific instructions for this section

Also review the section assets:
- **@product-plan/sections/SECTION_ID/README.md** — Feature overview and design intent
- **@product-plan/sections/SECTION_ID/tests.md** — UI behavior test specs
- **@product-plan/sections/SECTION_ID/components/** — React components to integrate
- **@product-plan/sections/SECTION_ID/types.ts** — TypeScript interfaces
- **@product-plan/sections/SECTION_ID/sample-data.json** — Test data

## Before You Begin

Review all the provided files, then ask me clarifying questions about:

1. **Integration** — How this section connects to existing routes, data fetching, and any APIs already built
2. **State persistence** — How the section's state (step completions, active suite, run results) should be stored
3. **Product requirements** — Anything in the specs or user flows that needs clarification
4. **Anything else** — Whatever you need to know before implementing

Lastly, ask me if I have any additional notes for this implementation.

Once I answer your questions, proceed with implementation.
