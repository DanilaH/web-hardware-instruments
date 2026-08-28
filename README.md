# Hardware Tests

A static Astro site with lightweight browser-based hardware diagnostics.

## Current product status

Full-v1 implementation/audit and **Hardware Expansion 1** code-side implementation/audit are complete.

Expansion 1 was implemented under:

```text
20_POST_V1_HARDWARE_EXPANSION_SPEC.md
```

E1.0 source-of-truth approval, E1.0.1 independent review corrections, **E1.1 Mouse foundation + Mouse Tester**, **E1.2 focused Mouse tools**, **E1.3 Touch Screen Test**, **E1.4 Keyboard expansion**, **E1.5 display visual-inspection tools**, **E1.6 Frame Skipping**, and **E1.7 final Expansion 1 audit** are complete.

Code-complete does not mean release-ready. Public deployment is intentionally deferred until a real production domain is purchased and the remaining real-device/browser/camera release checks are performed.

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

Implemented Expansion 1 routes:

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
E1.0 source-of-truth approval ✅
→ E1.0.1 independent review corrections ✅
→ E1.1 Mouse foundation + Mouse Tester ✅
→ E1.2 focused Mouse tools ✅
→ E1.3 Touch ✅
→ E1.4 Keyboard expansion ✅
→ E1.5 display visual-inspection tools ✅
→ E1.6 Frame Skipping ✅
→ E1.7 final Expansion 1 audit ✅
```

E1.0.1 specifically removed ambiguous measurement/source-of-truth behavior before implementation: polling attempts use one source selected before measurement and never mix streams; Touch coverage counts only real in-surface browser-observed samples (including real coalesced samples where available); confirmation passes are separate; interrupted hands-off checks are invalid; Frame Skipping uses a **readiness-gated sequential READY capture epoch** so browser timestamp arithmetic cannot manufacture pattern gaps.

E1.1 established the reviewed Mouse input boundary and visual pattern. `MouseInputService` handles ordinary browser-observed mouse input and an isolated polling profile, while the existing Mouse DPI path remains on `MouseMovementService`.

E1.2 adds the focused Mouse Button, Scroll, Double Click, and browser-observed Polling Rate jobs. Polling uses a sampling-only service profile, one source per attempt, bounded two-second data, and browser-observed wording rather than a USB/hardware certification claim.

E1.3 adds the mobile-first Touch Screen Test with real browser-observed/coalesced in-surface coverage, separate confirmation coverage, surface-only multi-touch metrics, a progressive Fullscreen helper, and an independently armed 15-second hands-off unexpected-touch observation. `navigator.maxTouchPoints` remains a capability hint rather than a measurement result or absolute gate.

E1.4 adds Keyboard Rollover as browser-observed simultaneous-key measurement and Keyboard Ghosting as a guided expected-combination observation. Both reuse `KeyboardInputService`; neither claims NKRO certification, hardware failure, or confirmed ghosting from browser events alone.

E1.5 adds Dead Pixel and Backlight Bleed as visual-inspection utilities on one shared display inspection stage plus the existing progressive Fullscreen helper. Dead Pixel uses only the fixed Black/White/Red/Green/Blue sequence; Backlight Bleed uses a pure black stage. Neither route produces an automatic score, pass/fail result, or hardware diagnosis.

E1.6 adds the camera-assisted Frame Skipping Test on the existing `FrameSampler`. Browser timing is only a READY validity gate: every accepted READY frame advances exactly one sequential pattern slot, timing instability invalidates the capture epoch before another step, and only an external camera photo can provide skipped-refresh evidence. The page never manufactures visible gaps from timestamp arithmetic and never outputs an automatic pass/fail verdict.

E1.7 performed the final cross-cutting Expansion 1 audit. It synchronized exact SEO intent titles and related-tool clusters with `20`, restored the canonical Touch-inclusive privacy wording, closed Touch fullscreen teardown, removed remaining Expansion-only gradient styling, and restored readable source formatting where earlier focused Mouse files had been left minified. Those audit corrections do not change approved measurement thresholds or algorithms.

Expansion 1 is now code-side complete and audited. New product scope outside the approved Expansion 1 catalog requires fresh evidence/review rather than continuing implementation by default.

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

Manual pre-deployment validation still includes the real hardware/browser/camera cases required by the routes being released.

Untested cases must remain explicitly documented rather than inferred from mocks.
