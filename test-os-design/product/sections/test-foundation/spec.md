# Test Foundation Specification

## Overview
Test Foundation is a linear 5-step wizard that establishes the complete validation foundation before any test authoring begins. Steps are sequentially locked — each must be confirmed before the next unlocks. Each step presents a Claude-generated draft with editable key fields; confirming a step writes the artifact and advances the wizard. The phase ends with an explicit Approve & Lock action that seals the foundation and unlocks Section Validation.

## User Flows
- User arrives at Test Foundation and Step 1 (Test Charter) opens immediately — no landing screen
- User reviews the Claude-generated charter draft, edits key fields (scope description, risk level, correctness definition), and clicks Confirm to mark Step 1 complete
- Step 2 (Coverage Map) unlocks — user reviews/edits the epic-to-section mapping and confirms
- Step 3 (Oracle Data) unlocks — user reviews/edits the golden-value JSON fixtures and confirms
- Step 4 (Test Standards) unlocks — user reviews/edits naming conventions and assertion strictness settings and confirms
- Step 5 (Hermes Config) unlocks — user reviews/edits base URL, browser provider, timeout values, and vision settings and confirms
- After all 5 steps are confirmed, an Approve & Lock CTA appears below the completed step list
- User clicks Approve & Lock — the phase is sealed, a locked banner replaces the CTA, and Section Validation becomes accessible

## UI Requirements
- Step progress indicator at the top showing all 5 steps with locked / active / complete visual states
- Active step is expanded in the main content area; confirmed steps collapse to a summary row with a green check and a timestamp
- Locked steps are listed below the active step with a lock icon and are not clickable
- Each step panel shows: step number, command label, artifact filename, a rendered preview of the generated content, and editable key fields beneath it
- Editable fields use inline inputs (text, textarea, URL, select) — not a full raw editor
- Confirm button per step; disabled until required fields are filled
- Approve & Lock button appears only after all 5 steps are confirmed; styled as a primary CTA with a shield icon
- Once locked, the entire section shows a "Foundation Locked" banner with the lock timestamp; individual steps become read-only

## Configuration
- shell: true
