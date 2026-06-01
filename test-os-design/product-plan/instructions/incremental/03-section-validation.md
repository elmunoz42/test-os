# Milestone 3: Section Validation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1–2 complete (shell + test foundation)

---

## About This Handoff

**What you're receiving:** Finished UI designs, specs, sample data, and test specs for the Section Validation section.
**Your job:** Wire the authoring CRUD to your workspace persistence, wire Gherkin generation, and connect screenshot capture status.

---

## Goal

Implement Section Validation — the repeated authoring loop where users define, fixture, write, and capture evidence for each section suite from the coverage map.

## Overview

A persistent split-view workspace: left panel shows all app sections from the coverage map grouped by epic; right panel shows the selected suite's 4-step accordion. Each step can be expanded independently. The author-tests step has a story list + Gherkin preview sub-split. The capture-evidence step shows a 5-slot filmstrip per high-priority story. The phase is complete when all suites are marked done.

**Key Functionality:**
- List all suites from the coverage map, grouped by epic, with status/priority/completion badges
- Search and filter suites by name, epic, or status
- 4-step accordion per suite (any step can be expanded simultaneously)
- Author tests: story list on left + Gherkin preview on right
- Evidence capture: per-story filmstrip with up to 5 capture slots
- Mark suite complete (guarded: requires all 4 steps done)
- Reset suite (with confirmation, wipes step completions and authored content)

## Components Provided

Copy from `product-plan/sections/section-validation/components/`:

- `SectionValidation` — Main split-view; manages active suite, filter, story selection
- `SuiteListPanel` — Left panel with search, epic groups, and suite rows
- `SuiteDetail` — Right panel: suite header + 4-step accordion (includes Gherkin viewer and screenshot gallery)
- `index.ts` — Re-exports

## Props Reference

```typescript
interface SectionValidationProps {
  epics: Epic[]
  suites: SectionSuite[]
  stories: UserStory[]
  screenshots: Screenshot[]
  activeSuiteId: string | null
  activeStoryId: string | null
  filter: SuiteFilter
  shapeSuiteContent?: ShapeSuiteContent
  suiteFixturesContent?: SuiteFixturesContent
  maxScreenshotsPerStory?: number           // default: 5
  onSelectSuite?: (suiteId: string) => void
  onMarkComplete?: (suiteId: string) => void
  onResetSuite?: (suiteId: string) => void
  onFilterChange?: (filter: SuiteFilter) => void
  onSelectStory?: (storyId: string) => void
  onToggleStep?: (suiteId: string, stepId: StepId) => void
}
```

Full types in `product-plan/sections/section-validation/types.ts`.

## Expected User Flows

### Flow 1: Select and Author a Suite

1. User clicks a suite in the left panel
2. User expands the author-tests accordion step
3. User selects a story → Gherkin renders in the preview pane
4. **Outcome:** Gherkin is reviewable; story selection is persisted

### Flow 2: Mark Suite Complete

1. All 4 steps for a suite are done
2. User clicks `⋯` → "Mark complete"
3. **Outcome:** Suite status updates to complete; next in-progress suite auto-selected

### Flow 3: Phase Complete

1. Last suite is marked complete
2. **Outcome:** Phase-complete banner appears; Verdict & Reporting becomes accessible

## Testing

See `product-plan/sections/section-validation/tests.md`.

## Files to Reference

- `product-plan/sections/section-validation/README.md`
- `product-plan/sections/section-validation/tests.md`
- `product-plan/sections/section-validation/components/`
- `product-plan/sections/section-validation/types.ts`
- `product-plan/sections/section-validation/sample-data.json`

## Done When

- [ ] Suite list renders all coverage-map sections grouped by epic
- [ ] Search and filter narrow the suite list in real time
- [ ] Selecting a suite loads its 4-step accordion
- [ ] Author-tests step shows story list + Gherkin preview for the selected story
- [ ] Capture-evidence step shows 5-slot filmstrip per `captureScreenshot: true` story
- [ ] Mark Complete is disabled until all 4 steps are done; enabled then updates status
- [ ] Reset wipes step completions, authored stories, and fixtures after confirmation
- [ ] Phase-complete banner fires when last suite is marked complete
- [ ] Responsive on mobile (left panel becomes an overlay drawer)
