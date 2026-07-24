# Variables

Last synced: 2026-07-08 — from [I] Components Library Styleguide New (`https://www.figma.com/design/9Nt5ptuXdySfSeQJEOHGiE/`).

## What's actually tokenized as a Figma Variable

Only two kinds of values are wired up as real Figma Variables in this file:

- **Color** — `brand/*`, `neutral/*`, `tertiary/*`, `semantic/*` (see [colors.md](colors.md) for the full list and values)
- **Typography scalars** — `font-family/*`, `font-size/*`, `line-height/*`, `font-weight/*`, `letter-spacing/*` (see [typography.md](typography.md) for the full list and values)

No separate mode switching (e.g. Light/Dark) was observed on any variable pulled in this pass — every value returned was a single mode. Note the Header component does contain a visual "Dark mode / Light mode" toggle icon, so a mode-swapped variable collection may exist elsewhere in the file; this pass didn't surface one and it's worth checking specifically on a future sync.

## What's NOT tokenized (gap)

- **Spacing** (gaps, padding) — every spacing value seen (e.g. button padding `10px`, input padding `14px/10px`, color-swatch grid gap `20px`) is a hardcoded pixel value on the component, not a bound variable.
- **Corner radius** — every radius seen (button `81px`, input `8px`, color swatch card `12px`, dark-mode toggle circle `200px`) is likewise hardcoded per component.
- **Sizing** (icon sizes, component widths/heights) — hardcoded per instance.

## Inconsistencies found

- Colors and typography are properly tokenized, but spacing/radius/sizing are not — there's no `space/*` or `radius/*` variable collection to reach for when building new components. New prototypes will need to either hardcode these (matching existing hardcoded values by eye) or the design system should add a spacing/radius scale in Figma. Flagging rather than inventing one silently.
