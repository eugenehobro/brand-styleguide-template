---
name: ds-ingest
description: Extracts and documents the full design system from a Figma file — components, typography, colors, variables, and text styles — by walking through all pages via the Figma MCP connector, then writes/updates structured Markdown reference files (references/*.md). Use this skill whenever the user asks to "sync with Figma", "audit the Figma design system", "pull design tokens from Figma", "document Figma components", or wants new pages/components built consistently with an existing Figma file. Also trigger when the user mentions keeping a design system doc up to date with Figma, or asks "what components/colors/styles exist in this Figma file". After the first extraction, this skill's references/*.md files become the source of truth Claude should consult before creating any new page or component to stay consistent with the existing design system.
---

# Figma Design System Extractor

A two-phase skill: (1) crawl a Figma file via the Figma MCP connector and extract its design system, (2) write that knowledge into structured Markdown files under `references/` so future work (new pages, new components) stays consistent with what already exists in Figma.

## Prerequisites

- The Figma MCP connector must be connected and the user must give you a Figma file URL (or it's already open from a prior message).
- If Figma tools aren't loaded yet, call `tool_search` with a query like "figma design context" to load them (`Figma:get_design_context`, `Figma:get_metadata`, `Figma:search_design_system`, `Figma:get_variable_defs`, `Figma:get_libraries`, `Figma:whoami`, `Figma:get_screenshot`).
- If the user hasn't given a file/link, ask for the Figma file URL before starting. Extract the `fileKey` from a URL like `figma.com/design/{fileKey}/...` or `figma.com/file/{fileKey}/...`.

## Phase 1 — Extraction (crawl Figma)

Work top-down, cheapest calls first, so you don't burn context on detail before you know the shape of the file.

1. **Map the file.** Call `Figma:get_metadata` on the file (or root node) to get the page list and top-level frame names without pulling full design data. This tells you what pages exist and roughly how big each one is.
2. **Get libraries.** Call `Figma:get_libraries` to find out which shared/team libraries this file consumes — components and styles often live in a library, not the file itself. Note this for the user; if components are mostly libraary-sourced, the design tokens (colors/type/variables) are usually still readable from the consuming file.
3. **Get variables.** Call `Figma:get_variable_defs` on the root node or top frames to pull Figma Variables (color, number, string, boolean collections and their modes, e.g. light/dark). This is the most reliable source for colors and spacing tokens if the file uses Variables rather than raw hex styles.
4. **Walk each page.** For each top-level page/frame found in step 1, call `Figma:get_design_context` on its node id. This returns the structured design data: nested components, instances, text nodes (with font/size/weight/line-height), fills (colors), effects, auto-layout/spacing. Do this page by page rather than one giant call — large files will blow up a single response.
5. **Search the design system explicitly.** Use `Figma:search_design_system` with queries for component names, color names, and text style names you've spotted, to catch anything not surfaced by the page walk (e.g. components defined in a separate "Components" or "Foundations" page that isn't visually prominent).
6. **Screenshot ambiguous cases.** If a component's purpose isn't clear from its name/structure, call `Figma:get_screenshot` on it once rather than guessing.

As you go, keep a running scratch structure (in your own working memory, not yet written to disk) of:
- **Components**: name, variants/properties, where on the page it lives, what it's built from
- **Typography**: each named text style — font family, size, weight, line-height, letter-spacing
- **Colors**: each named color/fill — hex/rgba value, what it's used for if apparent
- **Variables**: collection name, modes (e.g. Light/Dark), each variable's name + value per mode
- **Text styles**: distinct from typography tokens if Figma exposes them separately (some files name "Heading/H1" as a text style applied across many text nodes — capture the style name, not just the raw font properties)

Don't write any files until the crawl is reasonably complete — partial writes mid-crawl create stale/contradictory files.

## Phase 2 — Write the Markdown references

Write into `references/` next to this SKILL.md (create the folder if it's not there yet). Use this file split — one file per category keeps each one small enough to read on demand without loading the whole design system into context every time:

- `references/colors.md`
- `references/typography.md`
- `references/components.md`
- `references/variables.md`
- `references/_overview.md` — short index: file name, last sync date, fileKey, page list, and a one-line pointer to each of the four files above

Use the templates in `references/_template-*.md` as the format for each (read them before writing — don't reinvent the table layout each time).

**Always include in every category file:**
- A "Last synced" line with today's date and the Figma file name/URL, at the top
- Real values, not placeholders — every row should be something you actually saw in Figma in Phase 1
- If something is ambiguous or inconsistent (e.g. two slightly different blues that look like a typo, or a component with no clear naming convention), flag it explicitly in an "## Inconsistencies found" section rather than silently picking one

**Updating vs first-time creation:**
- If `references/*.md` already exist, this is a sync, not a fresh write. Diff mentally against what's there: call out in your chat response (not just in the files) what's new, what changed, and what disappeared from Figma since last sync. Don't silently overwrite history-relevant context.
- Use `str_replace` for targeted updates to existing files when only part of the design system changed (e.g. only colors were touched in Figma); rewrite the whole file only when most of it changed.

## Using the references afterward (the ongoing payoff)

Once `references/*.md` exist, treat them as the project's design system source of truth for any future task in this project:
- Before building a new page or component, read the relevant reference file(s) first and reuse existing components/tokens rather than inventing new ones.
- If a new requirement doesn't fit anything documented, say so explicitly to the user rather than silently creating a one-off — that's exactly the kind of design system drift this skill exists to prevent.
- If the user says Figma has changed, re-run Phase 1 + 2 rather than hand-editing the references from memory.

## Notes on scope and caution

- This skill only reads from Figma. It never modifies the Figma file.
- Large files: if `get_metadata` shows many pages, consider asking the user whether to scope the crawl to specific pages (e.g. "Components" + "Foundations" pages) rather than crawling marketing/mockup pages that don't define reusable design system pieces.
- Do not invent component or token names — use exactly what's named in Figma, even if it's inconsistent. Inconsistency is useful information for the user, not something to "clean up" silently.
