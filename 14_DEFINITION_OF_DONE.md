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
- live visualization and key result remain readable together in the same viewport where that desktop gate applies;
- unsupported/waiting states explain the next action in one short message;
- spacing/typography remain polished rather than cramped.

Touch Screen Test follows its explicit mobile-first acceptance rules in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

Failure on this section blocks completion even if the code is technically correct.

## Full v1 product

Full v1 required routes:

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

Every tool must be a real implementation, not a placeholder.

All seven approved tool implementations and the code-side full-v1 audit are complete.

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

Expansion 1 must be implemented sequentially and must not regress full-v1 behavior except reviewed related-tool/internal-link updates or genuine correctness fixes.

### Expansion 1 code-complete

A route may be code-complete when:

- implementation matches `20`;
- build/typecheck/tests pass;
- exact pure calculations/heuristics are covered where applicable;
- lifecycle/cleanup is correct;
- unsupported states are readable;
- target visual/headless review passes;
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

A route may be code-complete before external hardware required for release-ready status is available. Do not claim validation that did not occur.

## Public deployment gate

Public deployment is a separate boundary after code completion. It is intentionally deferred until a real production domain is purchased.

Before any public indexed release:

- replace `https://hardware-testing.invalid` with the real production origin;
- keep indexing disabled until that real origin is reviewed in the same change;
- complete required real-device/browser QA honestly for every released route;
- verify all released routes return 200;
- verify canonical, robots, and sitemap output against the real origin;
- deploy over HTTPS;
- connect Google Search Console;
- submit the generated sitemap;
- run final production smoke.

Do not treat mock/headless browser checks as proof of real hardware coverage.

## Gamepad Tester

Primary view contains:

- detection state;
- generic controller;
- button states;
- stick positions;
- triggers when available.

Technical metadata does not dominate the main view.

## Stick Drift

Primary flow:

```text
release sticks
start
short measurement
simple per-stick result
```

No statistics dashboard.

## Deadzone

Primary view:

- live stick;
- p95 center-noise measurement;
- documented heuristic suggested starting deadzone.

No slider or advanced simulator in MVP.

## Mouse DPI

Primary view:

- distance;
- unit;
- start/reset;
- movement instruction;
- relative movement-capture visualization without fake centimeter progress;
- estimated DPI;
- raw Pointer Lock path plus graceful fallbacks.

No trial history/chart required.

## FPS

Primary view:

- observed browser FPS;
- median frame time;
- short 8-second live FPS trace showing recent drops.

No dashboard or chart controls.

## Refresh Rate

Primary view:

- estimated Hz;
- optional `Closest common mode` only within the documented 3% tolerance.

Measurement runs automatically where safe.

## Keyboard

Primary view:

- compact keyboard;
- pressed keys;
- concise last-key/status feedback.

No raw event log.

## Technical

- static build succeeds;
- strict TypeScript;
- shared typed `GamepadService`;
- shared typed `FrameSampler`;
- `KeyboardInputService` owns keyboard event acquisition;
- `MouseMovementService` owns Mouse DPI movement/Pointer Lock acquisition;
- Expansion 1 additionally approves `MouseInputService` for ordinary mouse input/polling and `TouchInputService` for finger-touch acquisition;
- shared Fullscreen utility is a progressive-enhancement helper, not a hardware acquisition service;
- tool controllers, not acquisition services, own held-button/held-key/counter/interpretation presentation state;
- no duplicate native acquisition loops/listeners across tools;
- native snapshots/events are adapted at the tool boundary before pure calculations/renderers consume tool semantics;
- cleanup for rAF/listeners/timers/locks/fullscreen observers;
- no unnecessary dependencies/backend.

## SEO

- unique title/meta/H1;
- primary tool remains above the fold where the device-class gate applies;
- static explanatory HTML below tool;
- canonical plumbing is ready for the real origin;
- sitemap/robots switch with the reviewed indexing configuration;
- no synonym/thin routes;
- only implemented routes are linked/listed as live tools.

## Performance

- fast initial interaction;
- no large unnecessary runtime;
- no primary-tool layout shift;
- no decorative payload bloat;
- bounded histories/trails/sample buffers;
- avoid avoidable DOM churn in measurement hot paths;
- no per-sample DOM writes in high-frequency polling/timing paths.

## Accessibility

- keyboard navigation;
- visible focus;
- labels;
- no color-only state;
- result text equivalents;
- functional visualizations retain textual/numeric equivalents where needed;
- `touch-action:none` only on active touch diagnostic surface;
- no global keyboard `preventDefault()`.

## Privacy

- raw hardware/input streams remain local;
- privacy copy matches reality;
- raw gamepad/device identifiers are not displayed, stored, or sent;
- raw touch/pointer/key/frame streams are not sent to analytics.

## QA

- automated tests pass;
- target viewport UX pass;
- browser smoke pass where automation is appropriate;
- real-device checks performed before release-ready/public deployment where hardware is required;
- untested hardware/browser cases documented rather than inferred.

## Exact-boundary compliance

- full-v1 dependency/measurement behavior matches `18_DECISIONS_AND_BOUNDARIES.md`;
- Expansion 1 behavior matches `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`;
- scope/release decisions match `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`;
- no arbitrary result thresholds were invented outside source-of-truth;
- CSS/runtime dependency boundaries are respected;
- standard/non-standard gamepad behavior matches the spec;
- display tools respect `FrameSampler` ownership and reset semantics;
- no DPI visualization claims physical progress that the browser cannot know;
- visual zooms are labelled so they do not overstate measurement magnitude;
- touch coverage never manufactures measured cells via interpolation;
- polling never claims true USB/hardware sample rate;
- Rollover/Ghosting never overclaim hardware certification;
- Frame Skipping never claims browser-only automatic detection.
