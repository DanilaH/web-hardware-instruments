# Hardware Tests

A static Astro site with lightweight browser-based hardware diagnostics.

## Current product status

Full-v1 implementation and the code-side full-v1 audit are complete.

Post-v1 **Hardware Expansion 1** is approved for sequential implementation under:

```text
20_POST_V1_HARDWARE_EXPANSION_SPEC.md
```

Public deployment is intentionally deferred until a real production domain is purchased and the remaining real-device/browser release checks are performed.

Implemented full-v1 tool routes:

```text
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test
/mouse-dpi-test
/fps-test
/refresh-rate-test
/keyboard-tester
```

Approved Expansion 1 routes, not yet implied to be implemented merely by appearing here:

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

Supporting routes:

```text
/
/about
/privacy
```

The site remains intentionally non-indexable until a real production domain is purchased immediately before deployment.

Current production placeholder:

```text
https://hardware-testing.invalid
indexingEnabled = false
```

Do not replace the placeholder with an invented temporary domain and do not enable indexing before the real production origin is known.

## Source of truth

Coding agents start with `AGENTS.md`.

For exact behavior and release decisions:

```text
19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md product strategy / approved scope / release boundary
18_DECISIONS_AND_BOUNDARIES.md          global + full-v1 algorithms / lifecycle / technical boundaries
20_POST_V1_HARDWARE_EXPANSION_SPEC.md  exact Expansion 1 behavior / algorithms / UX / QA / order
00_README.md                            full handoff/document map
```

If `18`, `19`, and `20` appear to conflict on a shared boundary, resolve the documentation conflict before product code changes.

## Expansion 1 implementation order

```text
E1.0 source-of-truth update
→ E1.1 Mouse foundation + Mouse Tester
→ E1.2 focused Mouse tools
→ E1.3 Touch
→ E1.4 Keyboard expansion
→ E1.5 display visual-inspection tools
→ E1.6 Frame Skipping
→ E1.7 final Expansion 1 audit
```

Do not scaffold all Expansion 1 pages in parallel. Existing full-v1 behavior stays stable except reviewed related-tool/internal-link changes and correctness fixes.

## Before public deployment

The remaining release work is deliberately separated from code-complete status:

- purchase/set the real production domain;
- run the required real-device/browser smoke for every route included in the release;
- verify high-refresh and multi-monitor display behavior where hardware is available;
- verify latest Chrome, Edge, and Firefox desktop; record graceful-degradation gaps for Safari/mobile;
- run real touch hardware checks for Touch Screen Test if that route is included;
- run real camera checks for Frame Skipping if that route is included;
- enable indexing only after the real origin is configured;
- deploy over HTTPS;
- connect Google Search Console and submit the generated sitemap;
- run final production smoke.

Automated/headless checks and mock browser input are useful for correctness and layout, but must not be described as real hardware validation.

## Development

Requirements:

```text
Node.js 24
pnpm 11
```

Install and run:

```bash
pnpm install
pnpm dev
```

Quality checks:

```bash
pnpm build
pnpm typecheck
pnpm test
```

## Architecture

Full v1 uses four browser capability services:

```text
GamepadService
FrameSampler
KeyboardInputService
MouseMovementService
```

Expansion 1 additionally approves:

```text
MouseInputService
TouchInputService
```

plus a shared progressive-enhancement Fullscreen helper.

Typical dependency direction:

```text
page
 ↓
tool controller / UI binder
 ├── browser capability service
 ├── pure measurement helpers
 └── prepared render data → renderer
```

Native snapshots/events are adapted at the tool boundary before pure calculations or renderers consume tool semantics.

Production UI intentionally does not use React, Vue, Svelte, Tailwind, a charting library, global state library, backend, database, auth, paid APIs, AI, or WebHID.

## Full-v1 measurement boundaries

### Gamepad Tester

Uses the browser Gamepad API. Standard-mapped controllers receive the rich generic controller view. Non-standard controllers receive only a numbered fallback; physical button/axis placement is never guessed.

### Stick Drift

Requires standard mapping. Samples both sticks for three seconds and reports observed center offset from mean X/Y. The center-detail plots are visual zooms; the numeric percentage is the measurement result. There is no pass/fail or severity label.

### Deadzone

Requires standard mapping. Samples one selected stick for three seconds, calculates nearest-rank p95 radial center noise, then shows the documented heuristic starting deadzone (`noise + 1 percentage point`, capped at 100%, displayed rounded up).

### Mouse DPI

Always reports **Estimated DPI**. The user supplies physical travel distance; the browser contributes relative horizontal movement only. Raw Pointer Lock is preferred, regular Pointer Lock and unlocked movement are fallbacks. The visual guide never pretends to know physical centimeter/inch progress.

### FPS

Measures observed frame delivery of this browser page using `requestAnimationFrame` callback timestamps. It is not another game's FPS and not a GPU benchmark.

### Refresh Rate

Estimates browser-visible display cadence from rAF timing. It is not a direct EDID/hardware refresh-rate readout.

### Keyboard

Observes `keydown`/`keyup` on the dedicated page. `KeyboardEvent.code` drives physical highlighting, `key` is textual context, Tab remains normal, and reserved OS/browser shortcuts may be unobservable.

Expansion 1 measurement wording and algorithms are defined only in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`; do not duplicate or improvise them here.

## Privacy

Raw controller, keyboard, mouse, touch, and frame-timing data is not uploaded or stored by the site.

If product analytics are enabled later, they must remain coarse and must not include raw hardware/input streams or raw device identifiers.

## Validation boundary

Automated coverage includes pure calculations and browser-capability lifecycle behavior. Visual/headless review may use mocked browser input only to verify UI state and geometry.

Manual pre-deployment validation still includes the real hardware/browser cases required by the routes being released.

Untested cases must remain explicitly documented rather than inferred from mocks.
