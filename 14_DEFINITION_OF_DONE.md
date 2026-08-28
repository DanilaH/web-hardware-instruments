# Project Definition of Done

## Highest-priority gate: UX

The project is not done unless every primary tool page passes all applicable requirements:

- at 1366×768 desktop, the main interaction and key result/status fit within one viewport for desktop-relevant tools;
- a first-time visitor can identify what action to take without reading below-the-fold text;
- there is at most one visually dominant action at a time;
- primary result appears in the same tool region;
- no dashboard-like metric overload;
- no unnecessary graph/table/history/settings in the main tool;
- functional visuals are used where they materially improve understanding;
- no visualization exists only to make the page look busier;
- unsupported/waiting states explain the next action concisely;
- spacing/typography remain polished rather than cramped;
- ~390px mobile integrity passes where the browser/device capability makes the tool meaningful.

Touch Screen Test follows its explicit mobile-first acceptance rules in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

Failure on this section blocks completion even if code is technically correct.

## Full v1 product

Full v1 routes:

```text
/
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test
/mouse-dpi-test
/fps-test
/refresh-rate-test
/keyboard-tester
/about
/privacy
```

All seven full-v1 tool implementations and the code-side full-v1 audit are complete.

Their exact behavior remains governed by the existing full-v1 docs, especially `18_DECISIONS_AND_BOUNDARIES.md`.

## Post-v1 Hardware Expansion 1

Expansion 1 is approved and governed by:

```text
20_POST_V1_HARDWARE_EXPANSION_SPEC.md
```

Approved routes:

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

Expansion 1 must be implemented sequentially and must not regress full-v1 behavior except reviewed related-link/internal-navigation updates.

### Expansion 1 code-complete

A route may be code-complete when:

- implementation matches `20`;
- build/typecheck/tests pass;
- pure calculations/heuristics have deterministic tests where applicable;
- lifecycle/cleanup is correct;
- unsupported states are readable;
- target visual/headless viewport review passes;
- measurement wording is honest;
- no raw input is uploaded/stored;
- no unrelated Audio/CPS/dashboard scope leaks in.

Mock/headless browser input may validate state/geometry only. It is not real hardware evidence.

### Expansion 1 release-ready

Before an indexed production release that includes a route, complete the real-device/browser/camera checks explicitly required by `20` for that route.

This includes, where relevant:

- real mouse/button/wheel/polling smoke;
- real touch-device smoke;
- real keyboard rollover/ghosting smoke;
- real fullscreen/fallback smoke;
- real camera smoke for Frame Skipping.

A route may be code-complete before the external hardware required for release-ready status is available. Do not claim release validation that did not occur.

## Public deployment gate

Public deployment is a separate boundary and is intentionally deferred until a real production domain is purchased.

Before any public indexed release:

- replace `https://hardware-testing.invalid` with the real production origin;
- keep indexing disabled until that real origin is reviewed in the same change;
- complete required route-specific real-device/browser QA honestly;
- verify all released routes return 200;
- verify canonical, robots, and sitemap output against the real origin;
- deploy over HTTPS;
- connect Google Search Console;
- submit the generated sitemap;
- run final production smoke.

Do not treat mock/headless browser checks as proof of real hardware coverage.

## Full-v1 tool boundaries

### Gamepad Tester

Primary view contains detection state, generic controller, button states, stick positions, and triggers when available. Technical metadata does not dominate the main view.

### Stick Drift

Primary flow: release sticks → start → short measurement → simple per-stick result. No statistics dashboard.

### Deadzone

Primary view: live stick, p95 center-noise measurement, documented heuristic suggested starting deadzone. No slider/advanced simulator.

### Mouse DPI

Primary view includes distance/unit/start-reset/movement instruction/relative movement-capture visualization/estimated DPI and documented Pointer Lock fallbacks. No fake physical-distance progress.

### FPS

Primary view: observed browser FPS, median frame time, short live trace. No dashboard/chart controls.

### Refresh Rate

Primary view: estimated Hz and optional `Closest common mode` only within documented tolerance.

### Keyboard

Primary view: compact keyboard, pressed keys, concise last-key/status feedback. No raw event log.

## Technical

- static build succeeds;
- strict TypeScript;
- no duplicate native acquisition loops/listeners across tools;
- full-v1 capability services remain `GamepadService`, `FrameSampler`, `KeyboardInputService`, `MouseMovementService`;
- Expansion 1 additionally approves `MouseInputService` and `TouchInputService`;
- shared Fullscreen utility is a progressive-enhancement helper, not a hardware acquisition service;
- `MouseMovementService` remains specialized for Mouse DPI capture;
- `MouseInputService` owns ordinary mouse event acquisition/polling profile, while controllers own held/counter/interpretation state;
- native snapshots/events are adapted at the tool boundary before pure calculations/renderers consume tool semantics;
- cleanup for rAF/listeners/timers/locks/fullscreen observers;
- no unnecessary dependencies/backend.

## SEO

- unique title/meta/H1;
- primary tool remains above the fold where appropriate;
- static explanatory HTML below tool;
- canonical plumbing is ready for the real origin;
- sitemap/robots switch with reviewed indexing configuration;
- no synonym/thin routes;
- only implemented routes are linked/listed as live tools.

## Performance

- fast initial interaction;
- no large unnecessary runtime;
- no primary-tool layout shift;
- no decorative payload bloat;
- bounded histories/trails/sample buffers;
- avoid per-sample DOM churn in high-frequency paths.

## Accessibility

- keyboard navigation;
- visible focus;
- labels;
- no color-only state;
- result text equivalents;
- functional visualizations retain textual/numeric equivalents where needed;
- `touch-action:none` only on the active Touch diagnostic surface;
- no global keyboard `preventDefault()`.

## Privacy

- raw hardware/input streams remain local;
- privacy copy matches reality;
- raw gamepad/device identifiers are not displayed, stored, or sent;
- touch/pointer/key/frame streams are not sent to analytics.

## QA

- automated tests pass;
- target viewport UX pass;
- browser smoke pass where automation is appropriate;
- route-specific real-device checks performed before release-ready status;
- untested hardware/browser cases documented rather than inferred.

## Exact-boundary compliance

- full-v1 dependency/measurement behavior matches `18_DECISIONS_AND_BOUNDARIES.md`;
- Expansion 1 behavior matches `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`;
- scope/release decisions match `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`;
- no arbitrary result thresholds are invented outside source-of-truth;
- CSS/runtime dependency boundaries are respected;
- display/timing tools respect `FrameSampler` ownership;
- DPI visualization never claims physical progress it cannot know;
- touch coverage never manufactures measured cells via interpolation;
- polling never claims true USB/hardware sample rate;
- Rollover/Ghosting never overclaim hardware certification;
- Frame Skipping never claims browser-only automatic detection.
