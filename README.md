# Hardware Tests

A static Astro site with lightweight browser-based hardware diagnostics.

## Current product status

Full-v1 implementation and the code-side full-v1 audit are complete. Public deployment is intentionally deferred until a real production domain is purchased and the remaining real-device/browser release checks are performed.

Implemented tool routes:

```text
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test
/mouse-dpi-test
/fps-test
/refresh-rate-test
/keyboard-tester
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
18_DECISIONS_AND_BOUNDARIES.md          exact algorithms / lifecycle / technical boundaries
19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md product strategy / scope / release boundary
00_README.md                            full handoff/document map
```

## Before public deployment

The remaining release work is deliberately external to feature development:

- purchase/set the real production domain;
- run real-device/browser smoke tests, including controller and mouse hardware;
- verify high-refresh and multi-monitor display behavior where hardware is available;
- verify latest Chrome, Edge, and Firefox desktop; record graceful-degradation gaps for Safari/mobile;
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

The MVP uses exactly four browser capability services:

```text
GamepadService
FrameSampler
KeyboardInputService
MouseMovementService
```

Typical dependency direction:

```text
page
 ↓
tool controller / UI binder
 ├── browser capability service
 ├── pure measurement helpers
 └── prepared render data → renderer
```

Native snapshots are adapted at the tool boundary before pure calculations or renderers consume tool semantics.

Production UI intentionally does not use React, Vue, Svelte, Tailwind, a charting library, global state library, backend, database, auth, paid APIs, AI, or WebHID.

See the numbered source-of-truth documents, especially:

```text
06_ARCHITECTURE.md
11_IMPLEMENTATION_PLAN.md
12_LAUNCH_PLAN.md
14_DEFINITION_OF_DONE.md
16_UX_ACCEPTANCE.md
17_FUNCTIONAL_VISUAL_SYSTEM.md
18_DECISIONS_AND_BOUNDARIES.md
19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md
```

## Measurement boundaries

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

## Privacy

Raw controller, keyboard, mouse, and frame-timing data is not uploaded or stored by the site.

If product analytics are enabled later, they must remain coarse and must not include raw hardware/input streams or raw gamepad IDs.

## Validation boundary

Automated coverage includes pure calculations and browser-capability lifecycle behavior. The final code-side audit also used temporary headless visual checks with mocked browser input only to verify UI state and geometry; that temporary review infrastructure is not part of the product branch.

Manual pre-deployment validation still includes:

```text
real controllers
real mouse capture
120/144/240+ Hz where available
multi-monitor behavior
latest Chrome / Edge / Firefox desktop
Safari/mobile graceful degradation
background/foreground navigation behavior
```

Untested cases must remain explicitly documented rather than inferred from mocks.
