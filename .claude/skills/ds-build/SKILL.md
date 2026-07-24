---
name: ds-build
description: Creates single self-contained HTML prototype files (one file = one prototype, with all CSS and JS inline) for the BRINC style guide project. Reads ds-ingest references (colors, typography, components, variables) as the source of truth for tokens before writing any code. Exception: the Header, Footer, and logo are always pulled live from the Figma file itself (via the figma-desktop MCP connector), never reconstructed from written references or invented as placeholders. Trigger when the user asks to "create a prototype", "add a section", "build a block", "make a component", or any request to generate a UI prototype. Before generating anything, always checks what already exists in the codebase to avoid duplication.
---

# Prototype Builder

Generates single-file HTML prototypes that are 100% consistent with the design system documented in `ds-ingest` references. Design tokens (color/typography/spacing) come from the references, not Figma directly — but the Header, Footer, and logo are the one exception: see **Header, Footer, and logo — always live from Figma** below.

## Prerequisites — check before any work

1. **References must exist.** Check for `.claude/skills/ds-ingest/references/_overview.md`. If missing, stop and tell the user: "ds-ingest references not found — run 'sync with Figma' first so I have the design system tokens."
2. **Read the relevant references.** Always read before writing a single line of code:
   - `.claude/skills/ds-ingest/references/typography.md` — font styles, sizes, weights
   - `.claude/skills/ds-ingest/references/colors.md` — color tokens and variables
   - `.claude/skills/ds-ingest/references/variables.md` — spacing, radius, other tokens
   - `.claude/skills/ds-ingest/references/components.md` — existing components and their variants
3. **Scan existing prototypes.** Before generating a new prototype, check the `prototypes/` folder for existing `.html` files — reuse their markup/CSS patterns for shared sections (headers, buttons, cards, etc.) rather than reinventing them from scratch.

## Header, Footer, and logo — always live from Figma

This overrides the "reference files only" rule above for these three pieces specifically:

- **Always use the actual Header component from the Figma file** (node `68:23`, "Header" on the Components page) — call `get_design_context` (and `get_screenshot` if needed) on it live, every time a prototype needs a header. Don't reconstruct it from `components.md` prose alone and don't redesign it.
- **Always use the actual Footer component from the Figma file** (node `176:1798`, "Footer" on the Components page) — same rule: pull it live, including its real background photo and real social icons.
- **Never invent a new logo.** Fetch the real logo SVG asset referenced in the Header/Footer design context (served from the local Figma Desktop asset server, e.g. `http://127.0.0.1:3845/assets/<hash>.svg`) and inline its actual SVG markup into the prototype's HTML. Do not draw a placeholder mark or typeset the wordmark as text instead.
- **Keep the file self-contained despite this.** Fetch each asset's raw content (SVGs as text, raster images as base64) once while building, and embed it directly in the HTML (inline `<svg>`, or `data:` URI for raster). Do not leave a prototype pointing at `localhost:3845` URLs — those only resolve while Figma Desktop has the file open, and the prototype must still render after Figma is closed.
- If the `figma-desktop` MCP connector isn't available when this is needed, stop and tell the user to open Figma Desktop with Dev Mode MCP enabled — don't fall back to a placeholder header/footer/logo silently.

## Stack and conventions

- **Single self-contained HTML file** — one file = one prototype. All HTML, CSS (inside one `<style>` block in `<head>`), and JS (inside one `<script>` block before `</body>`) live in that one file. No build step, no external dependencies — must open directly in a browser.
- **Design tokens as CSS custom properties** — declare all tokens from the references in a `:root { }` block at the top of the `<style>` tag, then use them everywhere via `var(--token-name)`.
- **No hardcoded values** — never write raw hex colors, pixel font sizes, or font names as literal strings in rules. Always go through `var(--token-name)`.
- **Vanilla JS only** — no frameworks or libraries, unless the user explicitly asks for one.
- **File naming** — kebab-case, e.g. `hero-section.html`, `pricing-page.html`.
- **Single quotes** in JS, 2-space indentation, 100-char print width.

## File structure rules

### New prototype
```
prototypes/{prototype-name}.html
```
One flat file containing the full prototype (`<html>`, `<style>`, `<script>`).

### New section/block for an existing prototype
Add it directly inside the existing prototype's HTML (new `<section>`), and extend its `<style>`/`<script>` blocks in place — do not split a prototype across multiple files.

## Generation process

1. **Understand the request** — what is being built: a whole prototype, or a section/block inside an existing one?
2. **Read references** (step from Prerequisites) — extract the exact tokens needed
3. **Check for reuse** — if a similar section already exists in another file under `prototypes/`, reuse its structure/CSS rather than duplicating from scratch
4. **Ask if ambiguous** — if the request is vague (e.g. "create a hero section") ask one focused question: "Should this hero have a background image, or is it a text-only layout?" Don't ask more than one question at a time
5. **Generate the code** — a single HTML file following the conventions above, using only tokens from references
6. **List what was created** — after writing the file, tell the user exactly what file was created/modified and what tokens were used

## Token usage examples

After ds-ingest runs, references will have real tokens. Declare them once in `:root`, then use them:

```html
<style>
  :root {
    --font-primary: 'Manrope', sans-serif;
    --font-mono: 'IBM Plex Mono', monospace;
    --text-h2: 32px;
    --text-h2--line-height: 1.2;
    --text-h2--letter-spacing: -0.01em;
    --text-label-s: 12px;
    --text-label-s--letter-spacing: 0.04em;
    --text-caption: 11px;
    --text-caption--letter-spacing: 0.02em;
    --color-bg-primary: #0d0d0d;
    /* ...rest of tokens from ds-ingest references */
  }

  h2 {
    font-family: var(--font-primary);
    font-size: var(--text-h2);
    line-height: var(--text-h2--line-height);
    letter-spacing: var(--text-h2--letter-spacing);
    font-weight: 600;
  }

  .label {
    font-family: var(--font-primary);
    font-size: var(--text-label-s);
    letter-spacing: var(--text-label-s--letter-spacing);
    font-weight: 500;
    text-transform: uppercase;
  }

  .caption {
    font-family: var(--font-mono);
    font-size: var(--text-caption);
    letter-spacing: var(--text-caption--letter-spacing);
    font-weight: 500;
    text-transform: uppercase;
  }

  .bg-primary {
    background-color: var(--color-bg-primary);
  }
</style>
```

## Design system drift prevention

- If the request requires a style that has **no token in the references**, do NOT invent one. Instead, tell the user: "This needs a [color/spacing/font size] that isn't in the design system yet — should I add a one-off or should this go into Figma first?"
- If the references show a component that matches what's being built, use it as the blueprint — same variants, same states, same naming
- If something in the references is marked as an inconsistency, flag it to the user before building rather than silently picking one option

## Notes

- This skill never modifies Figma
- This skill never modifies ds-ingest references — those are read-only for this skill
- If the user says "Figma has changed", ask them to run ds-ingest sync first, then come back to build
