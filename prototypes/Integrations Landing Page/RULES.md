# Rules for prototypes (Integrations Landing Page)

## Use the shared Header/Footer components

Whenever working on a prototype in this project, always reuse the shared components instead of rebuilding or placeholdering them:

- **Header**: `E:\BRINC\Claude Projects\Components\header.html`
- **Footer**: `E:\BRINC\Claude Projects\Components\footer.html`

**Why:** these are the canonical, up-to-date Header/Footer markup for BRINC prototypes. Reconstructing them by hand or inventing placeholders causes drift and inconsistency across prototype files.

## Font includes

Every new HTML prototype in this project must include the following tags in `<head>`, **before** the `<style>` block:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

**Why:** prototypes declare `--font-sans: 'Manrope', sans-serif;` and `--font-mono: 'IBM Plex Mono', monospace;` as CSS variables, but without a real `<link>` (or `@font-face`) the browser silently falls back to the system font — the font names alone don't load anything.

## Language

Always keep files in this project in English.
