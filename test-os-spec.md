# Test OS — Specification v0.4

*The independent validation layer between your codebase and your confidence.*

Test OS is the third member of the family: **Design OS** plans the product, **Agent OS** builds and maintains it, **Test OS** independently validates it. It is a faithful analog of Design OS — a standalone, conversation-driven workspace, organized into phases, ending in an export — but its output is a *verdict* on the build rather than a handoff to the builder.

> **What changed in v0.4:** Added the full epic→story→test-case manifest, screenshot capture for high-priority stories, the Hermes execution config, EC2 + cron deployment, the HTML report shape, and Cursor separation rules. LangSmith was considered and deliberately **moved to the future roadmap** — it validates an *agentic application's* reasoning, which is orthogonal to Test OS's job of validating app behavior. Keeping v0.4 lean: Hermes + manifest + HTML report.

---

## 1. The thesis (two test layers)

- **Visible layer (Cursor owns it).** Design OS emits a per-section `test.md` (success path / failure path / critical flows). It lives in the codebase. Cursor reads it and writes the known/happy-path tests from it, doing TDD as it already does. Nothing here is hidden.
- **Hidden layer (Test OS owns it).** Test OS (Hermes) reads the whole picture — the codebase incl. `test.md`, the Agent OS specs, and the running app — and authors a *more robust* suite: edge cases, failure modes, adversarial flows, and the exact expected values. This layer is invisible to Cursor.

The builder optimizes against tests it can read. Test OS exists to validate against expectations it *can't* — catching what the visible tests miss, and catching tests that were gamed to pass.

---

## 2. Design principles

1. **Standalone workspace, like Design OS.** Test OS is its own cloned repo/workspace, separate from the app codebase — exactly as Design OS is a separate Vite app on its own localhost. This is not a bolt-on security measure; it is the same pattern, and it is what makes adversarial separation free.
2. **Adversarial separation is the point.** The build agent (Cursor) must never see the test definitions, oracles, or expected values. A builder can hardcode to pass a test it can read; it cannot hardcode to match an oracle it never sees. Enforced via a separate workspace + `.cursorignore` + a Cursor rule.
3. **The human reviews tests, not code.** Behaviors written as human-readable intent (Gherkin) are a far smaller, higher-leverage review surface than generated implementation code. Get good at reviewing tests → trust the build → refactor freely.
4. **Reads everything, hides only its own output.** Test OS reads the codebase (incl. the visible `test.md`), Agent OS specs, and the running app. It writes to none of them. The only artifacts hidden from Cursor are the tests and oracles Test OS itself authors.
5. **Hermes is the executor.** Full app + browser visibility, native vision for screenshots, runs outside the IDE — so it works at jobs where Claude Code / Codex / Playwright Agents are off-limits and only Cursor is allowed. Hermes sees the whole app; that's correct — it's the validator.
6. **Multi-agent by default.** The same manifest validates builds from different agents; results map back to it for side-by-side comparison.

---

## 3. Family mapping

| Concern | Design OS | Agent OS | **Test OS** |
|---|---|---|---|
| Role | Plan & design | Build & maintain | **Validate (independently)** |
| Lives in | Standalone Vite app | Inside the codebase | **Standalone workspace (hidden from builder)** |
| Source of truth | Product vision | Specs & tasks | **Oracles & expected behaviors** |
| Storage | Markdown/JSON in `product/` | Codebase | **Markdown/JSON/Gherkin in `test-os/`** |
| View | Live previewer | — | **Static HTML report** |
| Output | `product-plan.zip` + build prompts | Working code + known tests | **Verdict + HTML report + scrubbed fix-prompts** |
| Consumes | Your idea | Design OS handoff | **Design OS `test.md` + Agent OS specs + running app** |

---

## 4. Command & phase structure (mirrors Design OS)

Like Design OS, every command is a **structured conversation** — the agent proposes options, you select or course-correct. Three phases, each building on the last.

### Phase 1 — Test Foundation
*(mirrors Design OS Product Planning)*

| Command | Mirrors | Purpose |
|---|---|---|
| `/test-charter` | `/vision` | Ingest Design OS `test.md` + Agent OS mission. Define what "correct" means, scope, **risk priorities** (heavy vs. light coverage). |
| `/test-roadmap` | `/product-roadmap` | Mirror the app roadmap into a **coverage map** of epics → sections, one validation suite per section. |
| `/oracle-data` | `/data-model` + `/sample-data` | **The anti-gaming core.** Define golden/expected values, fixtures, independent oracles — realistic data the builder must *match but never see*. |
| `/test-standards` | `/design-tokens` | Testing conventions: naming, structure, assertion strictness, flake policy, thin-assertion definition. |
| `/test-harness` | `/design-shell` | The run scaffold: Hermes config, base URL, auth fixtures, where evidence lands. |

### Phase 2 — Section Validation
*(mirrors Design OS Section Design, repeated per section)*

| Command | Mirrors | Purpose |
|---|---|---|
| `/shape-suite` | `/shape-section` | Define one section's test scope and the behaviors that matter (seeded from its `test.md`). |
| `/suite-fixtures` | `/sample-data` | Generate realistic test data + types for the section, tied to the oracles. |
| `/author-tests` | `/design-screen` | Core authoring step: produce **Gherkin** (human-readable intent) + the executable spec, organized as user stories → test cases. |
| `/capture-evidence` | `/screenshot-design` | Screenshots / traces as evidence. Hermes captures natively (browser + vision). |

### Phase 3 — Verdict
*(mirrors Design OS Export)*

| Command | Mirrors | Purpose |
|---|---|---|
| `/run-validation` | — | Dispatch the suite to Hermes against the running app. |
| `/export-verdict` | `/export-product` | Generate the **static HTML report**: pass/fail by epic, coverage gaps, flagged thin assertions, screenshots, cross-agent comparison. |
| `/fix-prompts` | (Design OS build prompts) | Emit per-failure prompts to hand back to Cursor — **scrubbed of oracle values** so the feedback loop never leaks what's being tested. |

### Execution modes

- **Incremental validation** — validate a section as soon as the builder finishes it. Tight loop. Pairs with Agent OS milestone numbering (`01-foundation`, `02-shell`, …).
- **One-shot validation** — full-app adversarial sweep after a complete build pass; Hermes explores the whole app, including flows the builder didn't anticipate.

---

## 5. How the two layers coexist

There is nothing clever to do with `test.md`. It sits in the codebase, Cursor reads it, Cursor writes the basic tests it implies, and those tests live in the codebase too — all visible. That's the floor, and it's enough for the floor.

Test OS adds a second layer the builder never sees:

- It reads the same `test.md` (and the specs, and the running app) for context — Test OS is allowed to see everything.
- It authors a more robust suite in its own workspace: the edge cases and failure modes Cursor's tests skipped, plus the exact expected values (oracles).
- Because that suite lives outside the app repo and is `.cursorignore`'d, Cursor can't read it, can't write to it, and can't tune the implementation to pass it.

The two layers are complementary, not forked: the visible layer is the builder's own TDD; the hidden layer is independent validation that assumes the builder may have gamed or under-tested the visible one.

---

## 6. Workspace layout

```
test-os/                         # separate workspace; NOT in the app repo the builder sees
  charter.md                     # /test-charter  (ingests Design OS test.md + Agent OS mission)
  coverage-map.md                # /test-roadmap
  oracles/                       # /oracle-data — golden values, HIDDEN from builder
    *.json
  standards/
    testing-standards.md         # /test-standards
  harness/
    hermes-config.json           # /test-harness — executor + browser backend, base URL, auth
  suites/
    <section>/
      <section>.feature          # Gherkin: human-readable behaviors  (PRIMARY REVIEW SURFACE)
      <section>.spec.*           # executable implementation (optional; Hermes can drive from manifest)
      fixtures.*                 # /suite-fixtures
      README.md                  # why these exist, edge cases, known gaps
  evidence/
    screenshots/                 # /capture-evidence — baseline + step images
  runs/
    <run-id>/results.json        # raw run output (per executor / per build agent)
  fix-prompts/                   # /fix-prompts — scrubbed prompts to hand back to Cursor
  TEST-MANIFEST.json             # the spine — epics → sections → stories → test cases
  report.html                    # /export-verdict (single-user, static)
  run-tests.sh                   # cron entrypoint (see Deployment)
```

---

## 7. The manifest (the spine)

`TEST-MANIFEST.json` is the single source of truth. It is what Hermes executes against and what the HTML report renders from. It organizes everything from epics down to individual test cases, and carries the anti-gaming fields.

### Hierarchy

```
Epic            (from Design OS product roadmap)
  └─ Section    (from Design OS section design)
      └─ User Story   (synthesized from test.md success/failure paths + Agent OS tasks)
          └─ Test Case (Gherkin + expected behavior + oracle reference)
```

### Schema

```json
{
  "project": "my-app",
  "generatedAt": "2026-05-31T22:30:00Z",
  "designOsSource": "../design-os/product",
  "agentOsSource": "../agent-os/specs",
  "epics": [
    {
      "id": "epic-001",
      "name": "User Authentication",
      "description": "All authentication flows and security",
      "sections": [
        {
          "id": "section-auth-login",
          "name": "Login",
          "designOsRef": "design-os/product/sections/authentication.md",
          "userStories": [
            {
              "id": "story-001",
              "title": "User logs in with valid credentials",
              "description": "As a user, I want to log in with my email and password so I can access my account",
              "priority": "high",
              "captureScreenshot": true,
              "source": "design-os-success-path",
              "agentOsRef": "task-login-impl-001",
              "testCases": [
                {
                  "id": "tc-001-happy",
                  "title": "Successful login",
                  "gherkin": "Given a user with valid credentials\nWhen they submit the login form\nThen they are redirected to the dashboard\nAnd a session token is stored",
                  "precondition": "App running on base URL; user exists in seed data",
                  "expectedBehavior": {
                    "redirectUrl": "/dashboard",
                    "statusCode": 200,
                    "sessionTokenPresent": true,
                    "userDisplayedInHeader": true
                  },
                  "postcondition": "User is authenticated for subsequent requests",
                  "oracleRef": "oracles/auth.json#validUser",
                  "assertionType": "behavioral",
                  "thinAssertionFlag": false
                },
                {
                  "id": "tc-001-locked",
                  "title": "Locked account cannot log in even with valid credentials",
                  "gherkin": "Given a locked account with otherwise-valid credentials\nWhen they submit the login form\nThen login is rejected\nAnd no session token is created",
                  "precondition": "App running; locked user exists in seed data",
                  "expectedBehavior": {
                    "errorMessage": "Account locked",
                    "statusCode": 403,
                    "sessionTokenPresent": false
                  },
                  "postcondition": "User remains on login page",
                  "oracleRef": "oracles/auth.json#lockedAccount",
                  "assertionType": "behavioral",
                  "thinAssertionFlag": false
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "runs": [
    {
      "runId": "2026-05-31T0200Z",
      "executor": "hermes",
      "buildAgent": "cursor",
      "passed": 0,
      "failed": 0,
      "byEpic": {}
    }
  ]
}
```

**Anti-gaming fields:** `oracleRef` ties an expected value to a hidden fixture; `thinAssertionFlag` marks a test that passes against a bare constant with no real fixture behind it (the hardcoding smell); `source` records whether the behavior came from Design OS intent or was added adversarially by Test OS. The report surfaces all three so under-tested or gamed builds are visible at a glance.

**Generating the manifest.** From Design OS: pull section descriptions, success/failure paths, and the roadmap (→ epics). From Agent OS: pull task IDs and acceptance criteria, cross-referenced to user stories by intent. Hermes synthesizes both into the manifest during Phase 1–2 conversations.

---

## 8. Screenshot capture

For every user story with `"priority": "high"` and `"captureScreenshot": true`:

1. **Baseline** — capture the initial state before the test runs.
2. **Step captures** — capture after each major interaction (submit, click, navigation).
3. **Vision analysis** — Hermes uses its vision layer to verify layout, button presence, and text match the expected behavior, and to flag visual regressions vs. the prior run.
4. **Report embedding** — images land in `evidence/screenshots/` and are embedded in the HTML report with captions describing expected vs. observed.

Stories at lower priority run headless with no capture, keeping runs fast. `maxScreenshotsPerStory` caps storage.

---

## 9. Hermes execution model

Hermes reads `TEST-MANIFEST.json` + `hermes-config.json`, runs each test case against the running app, and writes `runs/<run-id>/results.json`.

### `harness/hermes-config.json`

```json
{
  "appUrl": "http://localhost:3000",
  "manifestPath": "../TEST-MANIFEST.json",
  "screenshotDir": "../evidence/screenshots",
  "resultsDir": "../runs",
  "capturePriority": ["high"],
  "maxScreenshotsPerStory": 5,
  "vision": {
    "enabled": true,
    "analyzeLayout": true,
    "flagRegressions": true
  },
  "browser": {
    "provider": "local",
    "headless": true
  },
  "timeout": {
    "navigation": 30000,
    "interaction": 10000,
    "assertion": 5000
  }
}
```

Notes: `browser.provider` can be `local` (local Chromium), or a cloud backend (Browserbase / Browser Use / Firecrawl) if you want isolation and stealth. The LLM behind Hermes is set in Hermes' own config (Claude or GPT). Vision is what powers the screenshot analysis in §8.

---

## 10. Deployment: EC2 + cron

Test OS runs on a schedule from a persistent EC2 instance. No GitHub Actions, no repo-level permissions needed — push when there's something meaningful, the nightly run picks it up.

### One-time setup

1. **Launch** a `t3.medium` (Ubuntu 24.04), tag `test-os-runner`, security group allows outbound HTTPS.
2. **Install deps** (SSH in, once):
   ```bash
   sudo apt update && sudo apt install -y nodejs npm git curl
   npm install -g hermes-agent
   ```
3. **Clone the Test OS workspace:**
   ```bash
   git clone https://github.com/YOUR_ORG/test-os.git ~/test-os
   cd ~/test-os && npm install
   ```
4. **Store credentials in AWS Secrets Manager** (instance IAM role needs `secretsmanager:GetSecretValue`):
   - `test-os/github-token` → GitHub PAT
   - `test-os/hermes-config` → Hermes LLM key (Claude or GPT)
5. **Create `~/test-os/run-tests.sh`:**
   ```bash
   #!/bin/bash
   set -e
   cd ~/test-os

   GITHUB_TOKEN=$(aws secretsmanager get-secret-value --secret-id test-os/github-token --query SecretString --output text)
   export HERMES_API_KEY=$(aws secretsmanager get-secret-value --secret-id test-os/hermes-config --query SecretString --output text)

   # Pull latest app code
   rm -rf ~/app-latest
   git clone --depth 1 https://${GITHUB_TOKEN}@github.com/YOUR_ORG/agent-os-app.git ~/app-latest

   # Spin up the app (adapt to your stack)
   cd ~/app-latest
   npm install
   npm run build
   npm run dev &
   APP_PID=$!
   sleep 10   # wait for the dev server

   # Run validation
   cd ~/test-os
   hermes --config harness/hermes-config.json --manifest TEST-MANIFEST.json

   # Generate the verdict
   node scripts/generate-report.js runs/ > report.html

   # Stop the app
   kill $APP_PID || true

   # Persist results back to the Test OS repo
   git add runs/ report.html
   git commit -m "Test OS verdict: $(date -u +%FT%TZ)" || true
   git push origin main

   echo "Test OS run complete."
   ```
6. **Make executable + smoke test:**
   ```bash
   chmod +x ~/test-os/run-tests.sh && ~/test-os/run-tests.sh
   ```

### Schedule

```bash
crontab -e
# nightly at 02:00 UTC
0 2 * * * /home/ubuntu/test-os/run-tests.sh >> /home/ubuntu/test-os/cron.log 2>&1
# (or every 6h:  0 */6 * * *)
```

### Monitor

```bash
tail -f ~/test-os/cron.log          # run log
ls -ltr ~/test-os/runs/             # latest results
open ~/test-os/report.html          # the verdict
```

### Cost note

A `t3.medium` left running is a few dollars a month of idle compute. If you later want to trim it, move to a CloudWatch-cron-triggered Lambda that boots an EC2 from a baked AMI, runs `run-tests.sh`, and terminates — pay only for run time. Not needed for v0.4.

---

## 11. The HTML report

`/export-verdict` (or `scripts/generate-report.js`) renders a single static `report.html` from `runs/` + `TEST-MANIFEST.json`:

- **Summary** — total tests, pass/fail, critical failures highlighted.
- **By epic → section → story** — collapsible tree mirroring the manifest, each test case showing its Gherkin and actual-vs-expected.
- **Screenshots** — embedded for high-priority stories, with the vision analysis note (expected vs. observed).
- **Thin-assertion flags** — test cases that smell hardcoded, surfaced explicitly.
- **Coverage gaps** — sections in the manifest with no passing behavioral test.
- **Cross-agent comparison** — when multiple `runs[].buildAgent` exist, a side-by-side of the same suite against each build.

Single-user, no server, open it in a browser.

---

## 12. Cursor separation (what NOT to expose)

### `.cursorignore` (in the app repo root)
```
test-os/
.env
```

### Cursor rule (`.cursor/rules` or project rules)
> The test specifications, oracles, and expected values are maintained in a separate Test OS workspace. Build toward the Design OS designs and Agent OS specs only. Do not read, reference, infer, or optimize for any hidden test suite or expected-value fixtures.

Cursor confirms it can scope visibility this way: `.cursorignore` excludes files/folders from the agent's view and indexing, and the rule reinforces intent. The `.env` is excluded for the same reason — secrets should never enter the agent's context.

---

## 13. Future roadmap

- **v0.5 — LangSmith for agentic applications.** *Only when the app you're building is itself agentic* (voice agent, chatbot, RAG). LangSmith traces and evaluates the application's own agent reasoning — did it call the right tool, ground its answer, avoid hallucinating — which a browser test can't see. This validates *your built AI feature*, not Hermes, and is orthogonal to Test OS's core job, so it stays optional and out of the default loop. (Directly relevant to HIPAA-style voice-agent work, where online evaluators double as monitoring and PHI masking on traces is required.)
- **v0.6 — Playwright executor option.** Swap Hermes for Playwright Test Agents (planner → generator → healer) in environments that permit Claude Code / Codex / VS Code in the loop. Faster and deterministic for CI; Hermes stays the default for Cursor-only shops.
- **v0.7 — Video recording.** Record failed runs (browser session + reasoning trace) for post-mortems, the way Cursor's bug bot does. Higher storage cost; gate behind a flag.
- **v0.8 — Multi-browser validation.** Same suite across Chromium / Firefox / WebKit to catch cross-browser layout issues.
- **Live viewer.** A Vite/React/Tailwind viewer (the fuller Design OS analog) over the static report, with device + dark-mode toggles, if single-user static HTML ever feels limiting.

---

## 14. Open questions

- Oracle generation: hand-authored vs. derived from `test.md`/specs vs. a separate reasoning pass — and how to keep oracles independent enough to stay adversarial.
- `/fix-prompts` scrubbing: exact redaction rules that hide oracle values while still giving Cursor an actionable repro.
- Concrete thin-assertion heuristic + coverage tooling per stack.
- Whether Hermes drives purely from the manifest or also emits committed `.spec` files per section.
