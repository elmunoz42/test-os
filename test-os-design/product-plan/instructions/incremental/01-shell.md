# Milestone 1: Shell

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

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
