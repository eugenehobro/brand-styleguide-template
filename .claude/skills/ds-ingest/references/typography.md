# Typography

Last synced: 2026-07-08 — from [I] Components Library Styleguide New (`https://www.figma.com/design/9Nt5ptuXdySfSeQJEOHGiE/`), page **Foundations → Typography**.

## Font families

| Token | Value |
|---|---|
| `font-family/sans` | Manrope |
| `font-family/mono` | IBM Plex Mono |

## Type scale

All values below come from Figma's bound Variables (`get_variable_defs`), not from the descriptive captions printed next to each style in the Typography page — see **Inconsistencies found**, those captions don't match.

| Style | Font | Size | Line-height | Weight | Letter-spacing |
|---|---|---|---|---|---|
| Display | sans | 100px | 100px | 600 (SemiBold) | -2 |
| H1 | sans | 82px | 110px | 600 (SemiBold) | 0 |
| H2 | sans | 62px | 100px | 600 (SemiBold) | 0 |
| H3 | sans | 35px | 45px | 600 (hardcoded — see Inconsistencies) | 0 |
| H4 | sans | 24px | 34px | 600 (SemiBold) | 0 |
| H5 | sans | 20px | 30px | 600 (SemiBold) | 0 |
| H6 | sans | 18px | 24px | 600 (SemiBold) | 0 |
| Body-16 Regular | sans | 16px | 20px | 400 (Regular) | 0 |
| Body-16 Bold | sans | 16px | 20px | 700 (Bold) | 0 |
| Body-14 Regular | sans | 14px | 18px | 400 (Regular) | 0 |
| Body-14 Bold | sans | 14px | 18px | 700 (Bold) | 0 |
| Body-11 Regular | sans | 11px | 15px | 400 (Regular) | 0 |
| Body-11 Bold | sans | 11px | 15px | 700 (Bold) | 0 |
| Label-20 Uppercase | sans | 20px | 30px | 500 (Medium) | 0 |
| Label-16 Uppercase | sans | 16px | 30px | 500 (Medium) | 0 |
| Label-12 Uppercase | sans | 12px | 30px | 500 (Medium) | 0 |
| Caption Mono Uppercase | mono | 11px | 15px | 500 (Medium) | 0 |

Label and Caption styles render as UPPERCASE text (transform applied in the component, not part of the font token itself).

## Inconsistencies found

1. **Descriptive captions don't match the bound variables.** Every type style on the Typography page has a caption like "Font size: 62px | Line height: 120% | Tracking: 0%" printed next to it — but recomputing line-height% from the actual bound `line-height/*` variable almost never matches the caption (e.g. H2 caption says 120%, but `line-height/H2` = 100px on a 62px type = ~161%; Label styles all say "+8%" tracking, but `letter-spacing/Labels` is bound to `0`). Treat the variable values in the table above as the source of truth — the captions read as stale/manual documentation that wasn't updated when the variables changed.
2. **H3 has a broken style binding.** For every other heading (H1, H2, H4, H5, H6), Figma reports the style's weight as a reference to the `font-weight/SemiBold` variable. For H3, it reports the weight as a hardcoded literal `600`, and its "style" field is `font-family/sans` instead of `SemiBold`. This suggests the H3 text style definition in Figma is misconfigured, not just a different named variant.
