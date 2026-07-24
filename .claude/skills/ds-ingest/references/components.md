# Components

Last synced: 2026-07-08 — from [I] Components Library Styleguide New (`https://www.figma.com/design/9Nt5ptuXdySfSeQJEOHGiE/`), page **Styleguide(AI) Web Version - Components**.

## Button - Primary

Node `71:17`. Variants: `Default`, `Hover`.

- Shape: pill, `border-radius: 81px`, height `50px`, width ~`187px`, padding `10px`
- Background: `brand/blue` (`#00D2FF`) → `brand/blue hover` (`#5BE2FF`) on hover
- Label: "Download Logo" — Manrope Medium, `14px` / line-height `23px`, color `semantic/text/Button` (`#0A0A0A`)

## Header

Node `68:23`. Variants: `Header Default`, `Header-Scroll`.

- `1920×91px`, padding `60px` horizontal / `30px` vertical
- Scroll state adds `backdrop-blur(13px)` + background `rgba(10,10,10,0.46)`
- Contents: logo (SVG) + dark/light-mode toggle — `30×30px` circle, border `semantic/icon/border` (`#484848`), half-moon icon centered

## Input field

Node `87:54449`. A variant matrix: **Type** (`Default`, `Icon leading`, `Leading dropdown`, `Dropdown`, `Multiselect`, `Date Picker`) × **Destructive** (`False`, `True`) × **State** (`Placeholder`, `Filled`, `Disabled`, `Focused`) = 40 total variants. Only the `Type=Default, Destructive=False, State=Filled` variant was pulled in detail this pass; the rest share the same structure per their variant name.

- Label: uppercase, Manrope Medium, `12px`, white
- Input box: background `#100E0F`, border `#535353`, `border-radius: 8px`, height `44px`, padding `14px 10px`
- Optional trailing help icon, `16px`
- Hint text below: Manrope Regular, `14px`, color `#686868`
- Uses the standalone "Gray" color set (see [colors.md](colors.md#undocumented-gray-set-used-by-input-field-component-only)), not the Foundations neutral scale

## Footer

Node `176:1798`. `1920×481px`.

- Background: `#0A0A0A`, full-bleed photo with a black→transparent left-to-right gradient overlay
- BRINC logo watermark, `20%` opacity
- 5 social icons (Instagram, X, Facebook, LinkedIn, YouTube), `40×40px` each, top-right area

## Color swatch card (pattern)

Used repeatedly across Foundations → Colors (not a named Figma component, but a consistent repeated pattern worth reusing):

- `280×176px`, `border-radius: 12px`
- Top `120px`: solid color fill
- Bottom `56px` (bg `#F7F7F7`): color name (Manrope Regular `14px`, `#1A1A1A`) + hex code (IBM Plex Mono Medium `11px` uppercase, `#808080`)

## Icons

Two icon-grid frames on Foundations → Icons catalog product/feature icons (names only catalogued this pass — individual SVGs not visually audited):

Representative sample: "64x Zoom Dual Visual Cameras", "Integrated SkyBeam Spotlight", "Built-In Laser Range Finder", "Starlink Internet Connection", "Integrated Radar", "640x Total Zoom", "<0.09lux Night Vision Capable", "Radiometric Thermal Imager", "Integrated Video Streaming", "60+ Minutes Flight Time", "IP55 Weather Resistant", "Robotic Battery Swapping", "Drone as First Responder", "Fleet Management" — roughly 60 icons total across two rows, mostly product/spec iconography rather than generic UI icons.

Plus a small dedicated social-icon row: Instagram, X, Facebook, LinkedIn, YouTube (`40px` each) — this is the same icon set used in the Footer.

## Not catalogued this pass

- **Sidebar / List mockups** (nodes `198:70`, `199:1870` on the Components page) — these look like mobile-app screen mockups (list containers, dividers, section titles) rather than reusable design-system components. Worth a closer look in a future sync if the goal shifts to mobile UI.
- **Color Info cards** (`59:18`, `62:49`) and **Title section** (`53:38`) — documentation-page furniture for the styleguide itself, not reusable product components.
