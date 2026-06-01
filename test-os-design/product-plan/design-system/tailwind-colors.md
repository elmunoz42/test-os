# Tailwind Color Configuration

## Color Choices

- **Primary:** `cyan` — Active nav state, confirm buttons, progress indicators, pulsing status dots
- **Secondary:** `violet` — Oracle/command badges, secondary tags, adversarial scenario highlights
- **Neutral:** `zinc` — All backgrounds (950/900/800), borders (800/700), muted text (600/500/400)

## Usage Examples

```
Primary button:        bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30
Secondary badge:       bg-violet-500/10 border border-violet-500/30 text-violet-400
Neutral background:    bg-zinc-950 (page) / bg-zinc-900 (card) / bg-zinc-800 (hover)
Neutral border:        border-zinc-800 (default) / border-zinc-700 (interactive)
Pass state:            text-emerald-400 / bg-emerald-500/15 / border-emerald-500/30
Fail state:            text-red-400 / bg-red-500/10 / border-red-500/25
Warning state:         text-amber-400 / bg-amber-500/10 / border-amber-500/25
```

## Dark Mode

All components are dark-mode-first. The palette is designed for `zinc-950` backgrounds.
No `dark:` variant toggles are needed — the dark aesthetic is the default.
