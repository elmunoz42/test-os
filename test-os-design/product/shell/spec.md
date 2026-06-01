# Application Shell Specification

## Overview
Test OS uses a persistent sidebar navigation shell with a dark, terminal-adjacent aesthetic. The sidebar presents the four validation phases as a numbered pipeline (01–04) with monospace step indicators, followed by tool shortcuts and a bottom-anchored user menu. The main content area renders the active phase or tool view. The design signals precision and adversarial independence — not a friendly dashboard, but a validation instrument.

## Navigation Structure
- 01 Test Foundation → /foundation
- 02 Section Validation → /validation
- 03 Verdict & Reporting → /verdict
- 04 Deployment & Automation → /deployment
- Run History → /runs
- Suite Inspector → /inspector
- Settings → /settings
- Help / Docs → /help

## User Menu
Located at the bottom of the sidebar. Displays user avatar (initials fallback), display name, and a logout action accessible via a dropdown or click.

## Layout Pattern
Sidebar navigation: fixed 240px sidebar on the left, full-height content area on the right. Sidebar background is zinc-950 with a zinc-800 right border. Active nav items use a cyan accent (text + left border indicator). Hover states use zinc-800 background. Phase steps are labeled with two-digit monospace prefixes (01, 02, 03, 04) to reinforce the sequential pipeline feel. Tool items (Run History, Suite Inspector, Settings, Help) are separated from phases by a zinc-800 divider and use smaller, lighter typography.

## Responsive Behavior
- **Desktop:** Full 240px sidebar always visible; content area fills remaining width
- **Tablet:** Sidebar collapses to 60px icon-only mode; labels hidden; tooltips on hover
- **Mobile:** Sidebar hidden; hamburger icon in a top bar reveals sidebar as a slide-in drawer overlay

## Design Notes
- Sidebar header shows the "Test OS" wordmark in Space Grotesk, with a small cyan dot pulse animation indicating active monitoring state
- Phase nav items show a step number in JetBrains Mono (zinc-500 inactive, cyan-400 active)
- Run History badge shows the count of runs in the current session
- Suite Inspector is a key differentiator — it lets users browse and read test files (Gherkin, fixtures, oracle refs) from within Test OS without leaving the workspace
- No authentication UI in the shell — login is handled before the shell loads
