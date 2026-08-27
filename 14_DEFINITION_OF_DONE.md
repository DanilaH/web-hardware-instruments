# Project Definition of Done

## Highest-priority gate: UX

The project is not done unless every primary tool page passes all of these:

- at 1366×768 desktop, the main interaction and key result/status fit within one viewport;
- a first-time visitor can identify what action to take without reading below-the-fold text;
- there is at most one visually dominant action at a time;
- primary result appears in the same tool region;
- no dashboard-like metric overload;
- no unnecessary graph/table/history/settings in the main tool;
- functional visuals are used where they materially improve understanding;
- no visualization exists only to make the page look busier;
- live visualization and key result remain readable together in the same viewport;
- unsupported/waiting states explain the next action in one short message;
- spacing/typography remain polished rather than cramped.

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

All seven approved tool implementations must pass the code-side audit before the project is considered full-v1 complete in code.

## Public deployment gate

Public deployment is a separate boundary after full-v1 code completion. It is intentionally deferred until a real production domain is purchased.

Before any public indexed release:

- replace `https://hardware-testing.invalid` with the real production origin;
- keep indexing disabled until that real origin is reviewed in the same change;
- complete required real-device/browser QA honestly;
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
- `MouseMovementService` owns mouse/pointer acquisition;
- no duplicate native acquisition loops/listeners across tools;
- native snapshots are adapted at the tool boundary before pure calculations/renderers consume tool semantics;
- cleanup for rAF/listeners/timers/locks;
- no unnecessary dependencies/backend.

## SEO

- unique title/meta/H1;
- primary tool remains above the fold;
- static explanatory HTML below tool;
- canonical plumbing is ready for the real origin;
- sitemap/robots switch with the reviewed indexing configuration;
- no synonym routes.

## Performance

- fast initial interaction;
- no large unnecessary runtime;
- no primary-tool layout shift;
- no decorative payload bloat;
- bounded histories/trails;
- avoid avoidable DOM churn in measurement hot paths.

## Accessibility

- keyboard navigation;
- visible focus;
- labels;
- no color-only state;
- result text equivalents;
- functional visualizations retain textual/numeric equivalents where needed.

## Privacy

- raw hardware/input streams remain local;
- privacy copy matches reality;
- raw gamepad IDs are not displayed, stored, or sent.

## QA

- automated tests pass;
- target viewport UX pass;
- browser smoke pass where automation is appropriate;
- real-device checks performed before deployment where hardware is required/available;
- untested hardware/browser cases documented rather than inferred.

## Exact-boundary compliance

- dependency direction matches `18_DECISIONS_AND_BOUNDARIES.md`;
- no arbitrary result thresholds were invented;
- CSS/runtime dependency boundaries are respected;
- standard/non-standard gamepad behavior matches the spec;
- display tools reset on document visibility loss;
- no DPI visualization claims physical progress that the browser cannot know;
- visual zooms are labelled so they do not overstate measurement magnitude.
