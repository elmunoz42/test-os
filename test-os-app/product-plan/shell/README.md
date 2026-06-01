# Application Shell

## Overview

Test OS uses a persistent dark sidebar navigation shell. The sidebar presents the four validation phases as a numbered pipeline (01–04) with monospace step indicators, followed by tool shortcuts (Run History, Suite Inspector, Settings, Help) and a bottom-anchored user menu.

## Layout

- **Desktop:** Fixed 240px sidebar, content area fills remaining width
- **Tablet:** Sidebar collapses to icon-only (60px) — labels hidden, tooltips on hover
- **Mobile:** Sidebar hidden; hamburger in a top bar reveals it as a slide-in drawer

## Navigation Structure

**Phases:**
- `01` Test Foundation → `/foundation`
- `02` Section Validation → `/validation`
- `03` Verdict & Reporting → `/verdict`
- `04` Deployment & Automation → `/deployment`

**Tools:**
- Run History → `/runs`
- Suite Inspector → `/inspector`
- Settings → `/settings`
- Help / Docs → `/help`

## Design Notes

- Sidebar background: `zinc-950` with a `zinc-800` right border
- Active nav items: `cyan-400` text + left-border indicator + `cyan-500/10` background
- Logo area: "Test OS" wordmark with a pulsing cyan dot (monitoring active indicator)
- Phase step numbers rendered in JetBrains Mono (`01`–`04`)
- Run History badge: violet pill showing run count from the current session
- User menu: bottom of sidebar, avatar with initials fallback, logout dropdown

## Components

- `AppShell` — Main layout wrapper; accepts `children`, `activeHref`, `user`, `onNavigate`, `onLogout`, `runCount`
- `MainNav` — Sidebar navigation; exports `PHASE_ITEMS` and `TOOL_ITEMS` constants
- `UserMenu` — Bottom user menu with avatar and logout

## Wiring

```tsx
<AppShell
  activeHref={currentRoute}
  user={{ name: 'Alex Morgan', email: 'alex@example.com' }}
  onNavigate={(href) => router.push(href)}
  onLogout={() => auth.signOut()}
  runCount={recentRunCount}
>
  <YourPageContent />
</AppShell>
```
