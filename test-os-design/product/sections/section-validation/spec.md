# Section Validation Specification

## Overview
Section Validation is the repeated authoring phase — one suite per app section from the coverage map. The layout is a persistent split view: a left panel lists all sections grouped by epic with status and priority, and a right panel shows the active section's 4-step accordion (shape-suite, suite-fixtures, author-tests, capture-evidence). Steps can be opened in any order. The phase is complete when all suites are marked done.

## User Flows
- User arrives at Section Validation and sees the split view — section list on the left, active suite in the right panel (defaults to the first in-progress suite)
- User searches the left panel by section name or filters by epic or suite status
- User clicks a section row to load it into the right panel; the active section is highlighted with a cyan left-border indicator
- User expands an accordion step in the right panel to view and edit its content
- In the author-tests accordion step, user sees a story list on the left and a Gherkin preview on the right; clicking a story updates the Gherkin panel
- In the capture-evidence accordion step, user sees a screenshot gallery of thumbnails with story labels; an empty state is shown if no screenshots have been captured yet
- User clicks Mark Complete on the active suite to seal it; the suite status updates to complete in the left panel
- User clicks Reset on a suite to wipe its step completions and restart the authoring flow for that section

## UI Requirements
- Split view: left panel is fixed-width (240px on desktop), collapses to an overlay drawer on mobile
- Left panel has a search input and an epic filter at the top
- Sections in the left panel are grouped under their parent epic header
- Each section row shows: section name, step completion badge (X/4 done), priority badge (high/medium/low), and last-modified timestamp
- Active section row is highlighted with a cyan left-border accent; all other rows are muted
- Right panel header shows the active section name, its epic badge, and a dropdown menu for Mark Complete and Reset actions
- Accordion has 4 items: /shape-suite, /suite-fixtures, /author-tests, /capture-evidence — any step can be expanded simultaneously
- Each accordion item header shows the command label, a one-line description, and the step status (complete/in-progress/not-started)
- Author-tests accordion body: left sub-panel lists user stories (title, priority badge, camera icon if captureScreenshot is true); right sub-panel shows the selected story's Gherkin in a terminal-style code viewer
- Capture-evidence accordion body: per-story filmstrip rows, each showing up to 5 capture-step slots (configurable via maxScreenshotsPerStory, default 5); filled slots show a thumbnail placeholder and the capture step description, empty slots show as dashed outlines with the step index; a captured/total counter (e.g. 3/5) appears next to the story title
- Suite-fixtures accordion body: shows the fixture JSON in a code viewer
- Shape-suite accordion body: shows the generated scope description with editable priority and coverage notes fields

## Configuration
- shell: true
