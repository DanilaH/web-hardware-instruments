# Information Architecture

## Full-v1 implemented structure

```text
/
├── gamepad-tester
├── controller-stick-drift-test
├── controller-deadzone-test
├── mouse-dpi-test
├── fps-test
├── refresh-rate-test
├── keyboard-tester
├── about
└── privacy
```

## Approved Post-v1 Hardware Expansion 1

Approved additions are implemented sequentially and are **not** treated as live until the corresponding route exists and passes its code-side gate:

```text
/mouse-tester
/mouse-button-test
/mouse-scroll-test
/double-click-test
/mouse-polling-rate-test
/touch-screen-test
/keyboard-rollover-test
/keyboard-ghosting-test
/dead-pixel-test
/backlight-bleed-test
/frame-skipping-test
```

Exact behavior and implementation order live in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

## Homepage role

The homepage is a utility directory, not a long marketing landing page.

Current implemented shape:

```text
Header

H1: Hardware Tests in Your Browser
Short value proposition

Controller
- Gamepad Tester
- Stick Drift Test
- Deadzone Test

Mouse
- Mouse DPI Test

Display
- FPS Test
- Refresh Rate Test

Keyboard
- Keyboard Tester

Short privacy/trust section
Short explanation of browser-based testing
Footer
```

Add Expansion 1 routes to homepage/category navigation only as they become real implemented tools. Do not create coming-soon cards or placeholder links.

Once enough approved routes are implemented, categories may naturally become:

```text
Controller
Mouse
Keyboard
Display
Touch
```

Do not redesign the homepage into a large dashboard merely because the catalog grows.

## Category relationships

### Controller

```text
Gamepad Tester
├── Stick Drift Test
└── Deadzone Test
```

The Gamepad Tester is the broad entry point.

Stick Drift and Deadzone are separate pages because they solve distinct jobs, not because they are synonyms.

### Mouse

Current:

```text
Mouse DPI Test
```

Approved Expansion 1 model:

```text
Mouse Tester             broad browser input check
├── Mouse Button Test    button registration
├── Mouse Scroll Test    wheel/scroll events
├── Double Click Test    suspicious rapid repeat observation
└── Polling Rate Test    browser-observed pointer sample rate

Mouse DPI Test           separate physical-distance estimation job
```

The broad Mouse Tester must not absorb the focused jobs into a dashboard. Focused pages link back naturally once implemented.

### Display

Current:

```text
FPS Test
└── Refresh Rate Test
```

Approved Expansion 1 additions:

```text
Dead Pixel Test
Backlight Bleed Test
Frame Skipping Test
```

These are distinct jobs:

- FPS Test: browser/rendering frame cadence;
- Refresh Rate Test: estimate display refresh frequency from stable browser timing;
- Dead Pixel Test: fullscreen/large-stage solid-color visual inspection;
- Backlight Bleed Test: black-screen visual inspection;
- Frame Skipping Test: camera-assisted displayed-sequence inspection with browser readiness support.

Do not merge them into one display dashboard.

### Keyboard

`Keyboard Tester` remains the simple broad entry point.

Approved Expansion 1 adds:

```text
Keyboard Tester
├── Keyboard Rollover Test
└── Keyboard Ghosting Test
```

Rollover is free-form maximum browser-observed simultaneous input. Ghosting is a guided expected-combination comparison. They are already approved routes; do not reclassify them as hypothetical future ideas during implementation.

### Touch

Expansion 1 adds one substantial route:

```text
Touch Screen Test
```

It owns live finger-touch detection, multi-touch observation, test-area coverage, confirmation of repeatedly missed areas, and the separate hands-off unexpected-touch check.

Do not split thin synonym pages such as `/multi-touch-test` or `/ghost-touch-test` without new evidence and a reviewed scope change.

## Internal linking rules

Each implemented tool page should link to 2–4 genuinely related **implemented** tools.

Examples as routes become available:

```text
Gamepad Tester
→ Stick Drift Test
→ Deadzone Test

Mouse Tester
→ Mouse Button Test
→ Mouse Scroll Test
→ Double Click Test

Double Click Test
→ Mouse Button Test
→ Mouse Tester

Polling Rate Test
→ Mouse DPI Test
→ Mouse Tester

FPS Test
→ Refresh Rate Test
→ Frame Skipping Test

Keyboard Tester
→ Keyboard Rollover Test
→ Keyboard Ghosting Test

Dead Pixel Test
→ Backlight Bleed Test
→ Refresh Rate Test
```

Never link an unimplemented route merely because it is approved in Expansion 1.

Do not create a site-wide block containing every tool on every page.

## URL rules

- lowercase
- hyphen-separated
- no dates
- no locale prefix for initial English version
- no query-string-dependent canonical content
- canonical URL points to the clean route

## Duplicate-intent rule

Do not create:

```text
/gamepad-tester
/controller-tester
/gamepad-test-online
```

as three pages if SERP overlap shows one intent.

One canonical page should naturally mention the valid synonyms in text.

Expansion 1 routes were explicitly approved as distinct jobs; do not create additional synonym routes around them without a new reviewed scope decision.

## Future category expansion outside Expansion 1

Potential later categories:

```text
Audio
Camera / Microphone
File / Metadata
Network
```

Do not introduce them into navigation until at least one real approved tool exists.

## Release-aware navigation

Before a tool is implemented and intended for release:

- do not link to a placeholder route;
- do not show `Coming soon` cards merely to make the homepage look larger;
- homepage/category lists contain only real working tools.

The reserved `.invalid` origin and `noindex` remain until the public deployment gate. Approval in `20` means permission to implement, not permission to expose an empty route.

Every tool page must work as a standalone search landing page. It must not rely on homepage onboarding or a previous tool visit.
