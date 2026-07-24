# Colors

Last synced: 2026-07-08 — from [I] Components Library Styleguide New (`https://www.figma.com/design/9Nt5ptuXdySfSeQJEOHGiE/`), page **Foundations → Colors**, plus colors observed on the **Components** page.

## Brand

| Name | Variable | Hex |
|---|---|---|
| Blue | `brand/blue` | `#00D2FF` |
| Black | `brand/black` | `#0A0A0A` |
| White | `brand/white` | `#F9F9F9` |

## Semantic

| Name | Variable | Hex | Used on |
|---|---|---|---|
| Blue hover | `brand/blue hover` (note: referenced in code as `brand/blue-hover`, see Inconsistencies) | `#5BE2FF` | Button - Primary, Hover state |
| Button text | `semantic/text/Button` | `#0A0A0A` | Button - Primary label |
| Icon border | `semantic/icon/border` | `#484848` | Header dark/light-mode toggle |

## Neutral

Displayed swatch label → bound Figma variable → hex. See **Inconsistencies found** — the labels and variable names are off by one from "300" onward.

| Swatch label | Bound variable | Hex |
|---|---|---|
| 0 | `neutral/0` | `#FFFFFF` |
| 100 | `neutral/100` | `#EAEAEA` |
| 200 | `neutral/200` | `#E6E6E6` |
| 300 | `neutral/400` | `#C0C0C0` |
| 400 | `neutral/500` | `#797979` |
| 500 | `neutral/600` | `#7B7B7B` |
| 600 | `neutral/700` | `#484848` |

## Tertiary — Red

| Name | Variable | Hex |
|---|---|---|
| Red | `tertiary/red` | `#912018` |
| Cadmium Red Lite | `tertiary/cadmium-red` | `#FF5833` |
| Sandybrown | `tertiary/sandybrown` | `#FFB866` |
| Bisque | `tertiary/bisque` | `#FFE7CC` |

## Tertiary — Blue

| Name | Variable | Hex |
|---|---|---|
| Petrol Blue | `tertiary/petrol-blue` | `#004756` |
| Sea Blue | `tertiary/sea-blue` | `#00728A` |
| Skyblue | `tertiary/skyblue` | `#5BB5C8` |
| Ice Blue | `tertiary/ice-blue` | `#CAEBF2` |

## Undocumented "Gray" set (used by Input field component only)

Found on the **Input field** component (Components page). These are **not** Figma Variables — they are raw hardcoded hex values, and they do not appear on the Foundations → Colors page at all.

| Name | Hex | Used for |
|---|---|---|
| White | `#FFFFFF` | label / filled input text |
| Gray 300 | `#A4A4A4` | (referenced in style list, exact usage not isolated this pass) |
| Gray 500 | `#686868` | hint text |
| Gray 600 | `#535353` | input border |
| (unnamed near-black) | `#100E0F` | input background |

## Other raw (non-variable) colors seen

| Hex | Used on |
|---|---|
| `#0A0A0A` | Footer background (matches `brand/black` by coincidence — hardcoded, not bound to the variable) |

## Inconsistencies found

1. **Neutral scale is off-by-one.** The displayed swatch labels (`300`, `400`, `500`, `600`) are bound to `neutral/400`, `neutral/500`, `neutral/600`, `neutral/700` respectively — i.e. every label from "300" onward points to the *next* variable up. `neutral/300` does not appear to exist or be used anywhere observed.
2. **Stale label text on the "200" swatch.** Its displayed hex label reads `#D9D9D9`, but the swatch's actual bound variable (`neutral/200`) resolves to `#E6E6E6`. The label text was not updated when the variable changed.
3. **Two parallel, non-overlapping "gray" systems.** The Foundations `neutral/*` scale (proper Figma Variables) and the Input field component's grays (`#FFFFFF`, `#A4A4A4`, `#686868`, `#535353`, `#100E0F` — raw hex, not variables) don't share any values and don't map onto each other. Anyone building a new component has to guess which system to use.
4. **Variable naming has a stray space.** The hover-blue variable is named `brand/blue hover` (space) in Figma itself, but shows up as `brand/blue-hover` (hyphen) in generated code — normalize this before wiring it into a token file.
5. **Near-black drift.** Footer uses hardcoded `#0A0A0A` (happens to match `brand/black`), while Input field uses a *different* hardcoded near-black, `#100E0F`. Neither references the `brand/black` variable directly.
