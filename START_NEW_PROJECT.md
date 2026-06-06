# Starting Test OS for a New Project

Use this guide when Hermes should turn this Test OS app into a project-specific validation workspace for a new app or agent-built project.

## 1. Create the Project Workspace

Hermes should start each new validation workspace from a fresh clone of this repository, then move it onto a project-specific branch and remote.

From the parent development folder:

```bash
git clone <test-os-template-repo-url> <project-name>-test-os
cd <project-name>-test-os
git switch -c <project-name>
```

Then create an empty GitHub repository for the project-specific Test OS workspace and point this clone at it:

```bash
git remote rename origin template
git remote add origin <project-test-os-repo-url>
git push -u origin <project-name>
```

Recommended naming:

- template repo: `test-os`
- project workspace repo: `<project-name>-test-os`
- project branch: `<project-name>`

Keep the original template remote as `template` so Hermes can later compare or pull upstream Test OS improvements without confusing them with project-specific validation changes.

## 2. Prepare the App

From the repository root:

```bash
cd test-os-app
npm ci --include=optional
```

Use `npm ci` when you want a clean install from `package-lock.json`. The `--include=optional` flag matters because Rollup uses platform-specific optional packages.

If dependencies are already installed and healthy, `npm install` is usually enough after package changes.

## 3. Start the Local Workspace

```bash
npm run dev
```

Open:

```text
http://localhost:5173/foundation
```

Main sections:

- `/foundation` - define the app under test, validation scope, personas, acceptance criteria, and oracle boundaries.
- `/validation` - shape section-level validation suites and fixture expectations.
- `/verdict` - review sample run results, inspect failures, compare agents, and generate fix prompts.
- `/deployment` - walk through deployment setup and review runner status.

## 4. Tell Hermes What to Do

Use a prompt like:

```text
Use the Hermes Test OS skill. Adapt this Test OS workspace for <project-name>.
Inspect the target project at <path-or-repo-url>, then update Test OS foundation,
validation suites, verdict/reporting sample state, and deployment runner setup
for that project. Preserve hidden oracle separation.
```

Hermes should treat Test OS as the validation workspace, not as the app under test.

## 5. Hermes Adaptation Workflow

Hermes should inspect the target project first:

- product docs, README, routes, user workflows, data models, and existing tests
- package scripts or run commands
- screenshots, fixtures, seeds, API contracts, or environment requirements if present

Then Hermes should convert the project context into Test OS state:

- Foundation: app charter, personas, critical journeys, acceptance criteria, oracle boundaries, and Hermes config
- Section Validation: epics, user stories, Gherkin cases, suite priorities, fixture needs, and evidence plans
- Verdict: expected result taxonomy, failure categories, fix-prompt style, and agent comparison dimensions
- Deployment: local or remote runner commands, environment variables, cron cadence, log paths, and report path

Hermes should update data/configuration sources rather than hard-coding UI copy:

```text
test-os-app/product-plan/sections/*/sample-data.json
test-os-app/src/data/*
```

Only change feature types or normalization files when the project needs fields that the current Test OS data shape cannot represent.

## 6. Preserve Validation Integrity

Hermes must preserve adversarial separation:

- keep oracle fixtures and hidden expected values inside Test OS-owned data
- never expose oracle fixture values or hidden expected data to build-agent prompts
- never write hidden oracle values into the app-under-test repo, public docs, or emitted fix prompts
- scrub fix prompts so they describe behavior and failure evidence without leaking hidden answers
- use `/test-os:*` command names in UI text, docs, and generated workflows

## 7. Start a Fresh Project Run

The current prototype stores workspace state in browser `localStorage`. For a fresh project, reset the local demo state before entering new information.

Recommended reset:

1. Open the app in the browser.
2. Use each section's reset/demo-state control where available.
3. If you need a full browser reset, clear site data for `localhost:5173`.

Browser-console reset:

```js
localStorage.clear()
location.reload()
```

Only do this if you are comfortable losing all local Test OS edits for the current browser origin.

## 8. Work Through the Test OS Flow

Start at `/foundation` and complete the foundation fields first. Treat this section as the contract for the project: what is being built, how it should behave, what evidence counts, and what must stay separate from the app under test.

Then move to `/validation`. Shape suites around user-visible behavior, section-by-section. Keep fixtures, oracle data, and screenshots in Test OS rather than inside the app being tested.

Use `/verdict` after you have or want to simulate validation results. The current app uses sample Hermes data locally, but the workflow is meant to support real run imports later.

Use `/deployment` when you are ready to think about repeatable validation runs. EC2 status, cron setup, logs, and report generation are local/mock flows in this prototype.

## 9. Hermes Command Map

Hermes/Test OS workflows should use these command labels:

- `/test-os:test-charter` - validation charter
- `/test-os:test-roadmap` - coverage map
- `/test-os:oracle-data` - hidden oracle fixture definitions
- `/test-os:test-standards` - testing conventions
- `/test-os:test-harness` - Hermes config
- `/test-os:shape-suite` - section suite scope
- `/test-os:suite-fixtures` - suite fixtures
- `/test-os:author-tests` - Gherkin stories and test cases
- `/test-os:capture-evidence` - screenshot evidence plan
- `/test-os:run-validation` - full Hermes run
- `/test-os:export-report` - static report workflow
- `/test-os:emit-fix-prompt` - scrubbed fix prompt
- `/test-os:compare-agents` - cross-agent comparison
- `/test-os:launch-runner` - EC2 runner launch
- `/test-os:install-runner-deps` - runner dependencies
- `/test-os:clone-workspace` - runner workspace clone
- `/test-os:configure-runner-secrets` - runner secrets
- `/test-os:setup-cron` - nightly cron setup
- `/test-os:refresh-runner-log` - runner log tail refresh

## 10. Connect a Real Project

For now, connect a real project manually by replacing or adapting the sample data under:

```text
test-os-app/product-plan/sections/*/sample-data.json
test-os-app/src/data/*
```

Keep project-specific source code outside `test-os-app` unless you are changing the Test OS app itself.

The future integration path is:

- backend persistence instead of `localStorage`
- live Hermes execution
- imported validation results
- real EC2/runner polling
- generated reports

## 11. Verify Before Sharing

Run:

```bash
npm run build
```

The build runs TypeScript checks and produces the production bundle in `dist/`.

If you see an error like `Cannot find module @rollup/rollup-darwin-arm64`, remove and reinstall dependencies:

```bash
rm -rf node_modules
npm ci --include=optional
```

Hermes should also smoke-check the primary adapted route:

```bash
curl -I http://localhost:5173/foundation
curl -I http://localhost:5173/validation
curl -I http://localhost:5173/verdict
curl -I http://localhost:5173/deployment
```

## 12. Git Hygiene

Do not commit generated dependencies or local build caches.

The app-level ignore file should keep `node_modules` out of Git:

```text
test-os-app/.gitignore
```

Before committing, check:

```bash
git status --short
git ls-files test-os-app/node_modules
```

The second command should print nothing.

When the project adaptation is ready:

```bash
git status --short
git add START_NEW_PROJECT.md test-os-app
git commit -m "Adapt Test OS for <project-name>"
git push
```

Do not commit the target app-under-test source into this Test OS workspace unless the project explicitly intends a monorepo.
