# Test OS — Complete Implementation Instructions

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Testing

Each section includes a `tests.md` file with UI behavior test specs. These are **framework-agnostic** — adapt them to your testing setup.

For each section:
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

---


---

# Milestone 1: Shell

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

---


## Goal

Set up the design tokens, Google Fonts, and application shell — the persistent sidebar navigation that wraps all four Test OS sections.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom property reference
- See `product-plan/design-system/tailwind-colors.md` for Tailwind usage patterns
- See `product-plan/design-system/fonts.md` for the Google Fonts import and font role assignments

**Key palette:**
- Primary: `cyan` — active nav state, confirm buttons, progress indicators
- Secondary: `violet` — oracle/command badges, secondary highlights
- Neutral: `zinc` — all backgrounds (950/900/800), borders, muted text
- Pass state: `emerald`; Fail state: `red`; Warning: `amber`

**Components are dark-mode-first.** No light mode toggle is needed — the zinc-950 dark aesthetic is the default.

### 2. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper (240px sidebar + content area)
- `MainNav.tsx` — Phase pipeline nav + tool items; exports `PHASE_ITEMS` and `TOOL_ITEMS` constants
- `UserMenu.tsx` — Bottom user menu with avatar initials fallback and logout dropdown
- `index.ts` — Re-exports all three

**Wire Up Navigation:**

Connect `onNavigate` to your router:

| Nav Item | Route |
|----------|-------|
| Test Foundation | `/foundation` |
| Section Validation | `/validation` |
| Verdict & Reporting | `/verdict` |
| Deployment & Automation | `/deployment` |
| Run History | `/runs` |
| Suite Inspector | `/inspector` |
| Settings | `/settings` |
| Help / Docs | `/help` |

**User Menu:**

`AppShell` expects:
```tsx
user?: { name: string; email?: string; avatarUrl?: string }
onLogout?: () => void
```

**Run Count Badge:**

Pass `runCount` to show a violet badge on Run History indicating recent run count.

**Example wiring:**
```tsx
<AppShell
  activeHref={router.pathname}
  user={{ name: currentUser.name, email: currentUser.email }}
  onNavigate={(href) => router.push(href)}
  onLogout={() => auth.signOut()}
  runCount={recentRunCount}
>
  <Outlet />  {/* or your page component */}
</AppShell>
```

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/shell/README.md` — Shell design intent and layout notes
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Google Fonts loaded (Space Grotesk, Inter, JetBrains Mono)
- [ ] Tailwind configured with `zinc`, `cyan`, `violet`, `emerald`, `red`, `amber` palettes
- [ ] Shell renders with sidebar navigation
- [ ] All 8 nav routes link to correct pages
- [ ] Active route is highlighted (cyan left border + background)
- [ ] User menu shows name, email, and logout
- [ ] Mobile: hamburger shows/hides sidebar drawer
- [ ] Responsive on mobile and tablet

---

# Milestone 2: Test Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete

---


## Goal

Implement the Test Foundation section — the 5-step sequential wizard that establishes the validation charter, coverage map, oracle data, testing standards, and Hermes harness configuration.

## Overview

Users work through 5 ordered steps before any test authoring can begin. Each step presents Claude-generated content with a small number of editable key fields. Confirming a step writes its artifact to the Test OS workspace and unlocks the next step. When all 5 are confirmed, an Approve & Lock CTA seals the foundation.

**Key Functionality:**
- Display 5 steps in sequential order with locked/active/complete visual states
- Show Claude-generated draft content + editable key fields per step
- Confirm a step to persist it and unlock the next
- Show Approve & Lock CTA only after all 5 steps are confirmed
- Locked foundation shows a read-only banner with the lock timestamp

## Components Provided

Copy from `product-plan/sections/test-foundation/components/`:

- `TestFoundation` — Main wizard component; manages step and field state
- `StepPipeline` — 5-node horizontal progress indicator
- `StepPanel` — Exports `CompletedStepRow`, `LockedStepRow`, `ActiveStepPanel`
- `index.ts` — Re-exports

## Props Reference

```typescript
interface TestFoundationProps {
  phase: FoundationPhase          // { id, status, lockedAt, currentStepIndex }
  steps: FoundationStep[]         // ordered array of 5 steps
  onConfirmStep?: (stepId: string, fields: Record<string, string>) => void
  onEditField?: (stepId: string, fieldKey: string, value: string) => void
  onApproveAndLock?: () => void
}
```

Full types in `product-plan/sections/test-foundation/types.ts`.

## Expected User Flows

### Flow 1: Confirm a Setup Step

1. User reviews generated content and edits key fields in the active step
2. User clicks "Confirm Step"
3. **Outcome:** Step writes its artifact; next step unlocks; wizard advances

### Flow 2: Approve & Lock the Foundation

1. All 5 steps confirmed → "Approve & Lock Foundation" CTA appears
2. User clicks the CTA
3. **Outcome:** Phase is sealed (`status: 'locked'`); a "Foundation Locked" banner with timestamp replaces the CTA; Section Validation becomes accessible

### Flow 3: View a Locked Foundation

1. User navigates back to Test Foundation after it is locked
2. **Outcome:** All steps shown as collapsed read-only rows; "Foundation Locked" banner at the top with lock timestamp

## Testing

See `product-plan/sections/test-foundation/tests.md` — covers sequential locking, field validation, Approve & Lock, and the locked read-only state.

## Files to Reference

- `product-plan/sections/test-foundation/README.md`
- `product-plan/sections/test-foundation/tests.md`
- `product-plan/sections/test-foundation/components/`
- `product-plan/sections/test-foundation/types.ts`
- `product-plan/sections/test-foundation/sample-data.json`

## Done When

- [ ] 5-step wizard renders with correct locked/active/complete states from persisted data
- [ ] Editing a field calls `onEditField` and the value persists across reloads
- [ ] Confirming a step writes the artifact, updates step status, and unlocks the next step
- [ ] All 5 confirmed → Approve & Lock CTA is visible
- [ ] Approve & Lock locks the phase; locked banner appears; steps become read-only
- [ ] Phase state persists across browser sessions
- [ ] Responsive on mobile

---

# Milestone 3: Section Validation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1–2 complete (shell + test foundation)

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

---

# Milestone 4: Verdict & Reporting

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1–3 complete

---


## Goal

Implement Verdict & Reporting — the run dashboard showing pass/fail metrics, the collapsible result tree, the test case slide-over with actual vs expected diff, run history, and cross-agent comparison.

## Overview

Three tabs: Verdict (default), History, and Compare Agents (visible when 2+ build agents exist in run history). The Verdict tab shows the latest run's metrics, a collapsible epic→section→story→test-case tree with failed nodes auto-expanded and red-accented, thin-assertion flags, and coverage gaps. Clicking a test case opens a slide-over with Gherkin, expected vs actual diff (mismatched keys highlighted red), and an Emit Fix Prompt button. Fix prompts are oracle-scrubbed — they never leak expected values.

**Key Functionality:**
- Summary metrics: total/pass/fail counts + pass rate bar + duration
- Collapsible result tree: failed nodes auto-expand and have red left-border accents
- Slide-over panel: Gherkin viewer + expected vs actual diff + Emit Fix Prompt
- Emit Fix Prompt copies a scrubbed prompt to clipboard with 2s confirmation toast
- Run Validation modal: shows `./run-tests.sh` command with copy button
- Export Report: opens `report.html` in a new tab
- History tab: table of past runs; clicking loads that run's verdict
- Compare Agents tab: pass/fail grid per test case per agent; disagreements highlighted amber

## Components Provided

Copy from `product-plan/sections/verdict-and-reporting/components/`:

- `VerdictAndReporting` — Main component: tab state, slide-over state, run validation modal
- `RunHeader` — Summary stat chips, pass rate bar, Run Validation + Export Report buttons
- `ResultTree` — Collapsible epic/section/story/test-case tree with auto-expand on failures
- `TestCaseSlideOver` — Slide-over panel with Gherkin, diff, and fix prompt
- `HistoryTab` — Run history table
- `CompareAgentsTab` — Cross-agent comparison with failed-only filter toggle
- `index.ts` — Re-exports

## Props Reference

```typescript
interface VerdictAndReportingProps {
  latestRun: RunSummary
  runs: RunSummary[]
  epics: Epic[]                        // nested: sections → stories → testCases
  thinAssertions: ThinAssertionFlag[]
  coverageGaps: CoverageGap[]
  agentComparisons: AgentComparison[]
  activeTestCaseId: string | null
  activeTab: 'verdict' | 'compare' | 'history'
  onSelectTestCase?: (id: string) => void
  onClosePanel?: () => void
  onEmitFixPrompt?: (id: string) => void
  onRunValidation?: () => void
  onExportReport?: () => void
  onSelectRun?: (runId: string) => void
  onTabChange?: (tab: ActiveTab) => void
}
```

Full types in `product-plan/sections/verdict-and-reporting/types.ts`.

## Expected User Flows

### Flow 1: Review a Failed Test Case

1. User sees failed nodes auto-expanded with red accents
2. User clicks a failing test case row
3. Slide-over opens showing Gherkin, expected vs actual (mismatches in red), and error message
4. **Outcome:** User understands exactly what failed

### Flow 2: Emit Fix Prompt

1. User is in the slide-over for a failing test case
2. User clicks "Emit Fix Prompt"
3. **Outcome:** Scrubbed prompt copied to clipboard; "Copied!" confirmation for 2s

### Flow 3: Compare Build Agents

1. Run history contains runs from "cursor" and "codex"
2. User clicks "Compare Agents" tab
3. **Outcome:** Grid shows pass/fail per agent; disagreement rows highlighted amber

## Testing

See `product-plan/sections/verdict-and-reporting/tests.md`.

## Files to Reference

- `product-plan/sections/verdict-and-reporting/README.md`
- `product-plan/sections/verdict-and-reporting/tests.md`
- `product-plan/sections/verdict-and-reporting/components/`
- `product-plan/sections/verdict-and-reporting/types.ts`
- `product-plan/sections/verdict-and-reporting/sample-data.json`

## Done When

- [ ] Latest run metrics render correctly from real Hermes results.json
- [ ] Failed epics/sections auto-expand; passed ones start collapsed
- [ ] Clicking a test case opens slide-over with Gherkin and diff
- [ ] Mismatched actual/expected keys are highlighted red
- [ ] Emit Fix Prompt copies to clipboard and shows 2s "Copied!" state
- [ ] Run Validation modal shows and copies the run-tests.sh command
- [ ] Export Report opens report.html in a new tab
- [ ] History tab shows all past runs; selecting one updates the dashboard
- [ ] Compare Agents tab appears only when 2+ distinct build agents exist in history
- [ ] Responsive on mobile

---

# Milestone 5: Deployment & Automation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1–4 complete

---


## Goal

Implement Deployment & Automation — the mode-switching setup wizard and live status dashboard for the EC2 + cron runner.

## Overview

When first loaded, shows a 5-step wizard for configuring the EC2 instance and cron schedule. Each step has copy-ready shell commands. Confirming all 5 steps automatically switches to a live status dashboard showing the EC2 instance state, cron schedule, and a scrollable run log tail.

**Key Functionality:**
- 5-step sequential wizard (Launch EC2 → Install Deps → Clone Workspace → Configure Secrets → Set Up Cron)
- Per-step copy-ready command blocks (hover to reveal copy button)
- Step confirmation persists completion state and unlocks the next step
- After step 5 confirmed: auto-switch to deployed status dashboard
- Status dashboard: instance state chip (pulsing when running), instance ID, region, IP, cron expression, next run time
- Scrollable run log with log level color-coding (info/warn/error)
- Refresh Log button pulls the latest cron.log lines

## Components Provided

Copy from `product-plan/sections/deployment-and-automation/components/`:

- `DeploymentAndAutomation` — Root component; manages `mode` state (setup/deployed)
- `SetupWizard` — 5-step wizard with step pipeline, command blocks, and confirm flow
- `StatusDashboard` — Status header chips + scrollable terminal log pane
- `index.ts` — Re-exports

## Props Reference

```typescript
interface DeploymentAndAutomationProps {
  mode: 'setup' | 'deployed'
  steps: SetupStep[]
  instanceStatus: InstanceStatus | null
  cronConfig: CronConfig | null
  logLines: LogLine[]
  onConfirmStep?: (stepId: string) => void
  onCopyCommand?: (command: string) => void
  onRefreshLog?: () => void
}
```

Full types in `product-plan/sections/deployment-and-automation/types.ts`.

## Expected User Flows

### Flow 1: Complete the Setup Wizard

1. User copies commands from each step and confirms them in order
2. After confirming step 5
3. **Outcome:** View auto-switches to the status dashboard (brief 400ms delay)

### Flow 2: View Live Instance Status

1. Mode is `'deployed'`; `instanceStatus.state` is `'running'`
2. **Outcome:** Pulsing emerald dot, "running" chip, instance ID/region/IP, cron expression, next run time are all visible

### Flow 3: Refresh the Run Log

1. User clicks "Refresh" on the status dashboard
2. **Outcome:** Spinner shows briefly; `onRefreshLog` fires; latest log lines update

## EC2 Status Integration

You'll need to poll or webhook your EC2 instance to get live `instanceStatus`. The component expects:

```typescript
{
  instanceId: string    // "i-0a4f23e9d7b81c530"
  region: string        // "us-east-1"
  state: 'running' | 'stopped' | 'pending' | 'unknown'
  publicIp: string | null
  tag: string           // "test-os-runner"
}
```

## Log Tail Integration

`logLines` is a slice of the cron.log. When `onRefreshLog` fires, fetch the latest N lines from the EC2 instance (via SSH, S3 upload from the run script, or a simple log endpoint) and update the prop.

## Testing

See `product-plan/sections/deployment-and-automation/tests.md`.

## Files to Reference

- `product-plan/sections/deployment-and-automation/README.md`
- `product-plan/sections/deployment-and-automation/tests.md`
- `product-plan/sections/deployment-and-automation/components/`
- `product-plan/sections/deployment-and-automation/types.ts`
- `product-plan/sections/deployment-and-automation/sample-data.json`

## Done When

- [ ] Wizard renders with persisted step completion state on page load
- [ ] Command copy works; "Copied" feedback shows and resets after 2s
- [ ] Confirming a step writes completion state and unlocks the next step
- [ ] Confirming step 5 triggers the mode switch to the status dashboard
- [ ] Status dashboard shows live EC2 state (running/stopped/pending)
- [ ] Cron expression and next run time are displayed
- [ ] Run log shows color-coded log lines (info=zinc, warn=amber, error=red)
- [ ] Refresh Log fetches latest log lines from the EC2 instance
- [ ] Responsive on mobile
