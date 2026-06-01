# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>` or global CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## Font Roles

| Role | Font | Usage |
|------|------|-------|
| Heading | **Space Grotesk** | Page titles, section headers, nav labels, CTA buttons |
| Body | **Inter** | Descriptions, form labels, UI copy, table content |
| Mono | **JetBrains Mono** | Step numbers, command blocks, test IDs, Gherkin, oracle refs, timestamps, status chips |

## Application in Components

Components apply fonts inline via `style={{ fontFamily: "..." }}`. To apply globally instead,
add these CSS rules to your base stylesheet:

```css
h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; }
body                    { font-family: 'Inter', sans-serif; }
code, pre, kbd, samp    { font-family: 'JetBrains Mono', monospace; }
```
