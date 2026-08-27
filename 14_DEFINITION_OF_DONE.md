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

## First production launch gate

The site may go to production before full v1 when these routes are complete:

```text
/
/gamepad-tester
/fps-test
/refresh-rate-test
/mouse-dpi-test
/about
/privacy
```

For the first production release:

- every listed tool is fully functional;
- UX/QA/SEO requirements in this document apply to the released tools;
- homepage lists only released tools;
- sitemap contains only real indexable routes;
- Search Console is connected;
- no placeholder routes are published.

Full v1 completion remains a separate milestone containing all seven tools.

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
- cleanup for rAF/listeners/timers;
- no unnecessary dependencies/backend.

## SEO

- unique title/meta/H1;
- primary tool remains above the fold;
- static explanatory HTML below tool;
- canonical;
- sitemap;
- robots;
- no synonym routes.

## Performance

- fast initial interaction;
- no large unnecessary runtime;
- no primary-tool layout shift;
- no decorative payload bloat.

## Accessibility

- keyboard navigation;
- visible focus;
- labels;
- no color-only state;
- result text equivalents.

## Privacy

- raw hardware/input streams remain local;
- privacy copy matches reality.

## QA

- automated tests pass;
- browser smoke pass;
- target viewport UX pass;
- real-device checks performed where hardware is available;
- untested hardware/browser cases documented.

## Production

- final domain;
- HTTPS;
- Search Console;
- sitemap submitted;
- custom analytics verified if enabled;
- production smoke complete.


## Exact-boundary compliance

- dependency direction matches `18_DECISIONS_AND_BOUNDARIES.md`;
- no arbitrary result thresholds were invented;
- CSS/runtime dependency boundaries are respected;
- standard/non-standard gamepad behavior matches the spec;
- display tools reset on document visibility loss;
- no DPI visualization claims physical progress that the browser cannot know.
