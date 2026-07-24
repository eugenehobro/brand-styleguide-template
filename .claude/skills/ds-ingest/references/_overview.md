# Design system overview

- **File:** [I] Components Library Styleguide New
- **URL:** https://www.figma.com/design/9Nt5ptuXdySfSeQJEOHGiE/-I--Components-Library-Styleguide-New
- **fileKey:** `9Nt5ptuXdySfSeQJEOHGiE`
- **Last synced:** 2026-07-08
- **Accessed via:** `figma-desktop` local Dev Mode MCP server (Figma Desktop must be open with this file, Dev Mode MCP server enabled)

## Pages

| Page | Node ID | Notes |
|---|---|---|
| Foundations | `8:2` | Colors, Typography, Icons, Input field — the actual design-token source |
| Styleguide(AI) Web Version - Components | `13:202` | Applied components: Button, Header, Input field, Footer, color-card pattern, sidebar/list mockups |
| 🖼 Cover | `5:2` | Cover image only, not crawled |
| — | `13:203` / `13:201` | Empty separator pages, not crawled |

## Reference files

- [colors.md](colors.md) — brand/neutral/tertiary palette, semantic colors, and the undocumented "Gray" set used by Input field
- [typography.md](typography.md) — full type scale (Display through Caption), font families
- [components.md](components.md) — Button, Header, Input field, Footer, color-swatch card pattern, icon catalog
- [variables.md](variables.md) — what's tokenized as real Figma Variables vs. hardcoded (spacing/radius gap)

## Scope of this pass

This was the first sync. Covered in full detail: Foundations → Colors, Foundations → Typography, and a representative sample of the Components page (Button - Primary, Header, one Input field variant of 40, Footer, the color-swatch card pattern, and the two Icons frames by name only).

Not deep-dived (flagged for a future sync if needed): the other 39 Input field variant permutations, individual icon SVG contents, and the Sidebar/List mobile-screen mockups (`198:70`, `199:1870`), which read as page mockups rather than reusable design-system pieces.

Several real inconsistencies were found in the source file itself (off-by-one neutral color scale, a stale color-code label, two non-overlapping gray systems, a naming typo on `brand/blue hover`, typography captions that don't match their bound variables, and a misconfigured H3 style). Full detail in each file's own "Inconsistencies found" section — don't silently resolve these when building new prototypes; ask the user which one is correct.
