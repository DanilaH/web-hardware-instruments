# Exact Decisions and Boundaries

This file is the conflict-resolution source of truth for MVP implementation.

If another numbered document conflicts with this file, this file wins and the mismatch should be fixed.

# 1. Fixed stack

```text
Astro
TypeScript strict
static output
plain CSS + CSS custom properties + Astro-scoped styles
native browser APIs
SVG
Canvas
DOM
```

Runtime exclusions:

```text
React/Vue/Svelte
Tailwind
UI/component library
chart library
global state library
backend
database
auth
paid API
AI
WebHID
```

Small build/dev dependencies for Astro, sitemap, type checking, and tests are allowed.

Approved project toolchain for scaffolding:

```text
Node.js 24 LTS
pnpm
Astro check
Vitest
```

Playwright is allowed only when a critical browser-flow/lifecycle scenario materially benefits from browser automation. Do not add it by default before such a test exists.

Expected scripts:

```text
pnpm dev
pnpm build
pnpm typecheck
pnpm test
```

Hosting provider is intentionally not fixed because the build is static and host-agnostic.

# 2. Rendering boundary

```text
DOM/CSS
→ controls
→ text/results
→ keyboard grid

SVG
→ controller visualization
→ stick/drift plots
→ deadzone geometry
→ mouse relative-movement guide

Canvas
→ FPS trace
→ refresh-rate trace
```

No generic chart library.

# 3. Browser capability services

Exactly four thin acquisition boundaries in MVP:

```text
GamepadService
FrameSampler
KeyboardInputService
MouseMovementService
```

They own native acquisition, feature detection, normalization, lifecycle, and cleanup.

They do not own UI, SEO, analytics, result wording, or tool-specific calculations.

Lifecycle:

```text
create
subscribe
start
...
stop
destroy
```

`subscribe()` does not implicitly start acquisition.

`destroy()` is idempotent and permanently disposes the instance.

One active acquisition loop/listener set per capability per page.

## FrameSampler visibility/reset contract

`FrameSampler` is the only owner of the display capability's `visibilitychange` acquisition lifecycle. FPS and Refresh Rate controllers must not install independent visibility listeners for measurement reset semantics.

The sampler emits typed events with at least these semantics:

```ts
type FrameSamplerEvent =
  | { type: 'sample'; timestamp: number }
  | { type: 'reset' };
```

Exact interface syntax may differ, but the semantic contract is fixed:

- `sample.timestamp` is the `requestAnimationFrame` callback timestamp;
- when document visibility is lost, active sampling is invalidated;
- the sampler clears its acquisition state and emits one `reset` notification;
- no hidden-tab samples are forwarded as valid measurement samples;
- when the document becomes visible again, acquisition may resume, but consumers must begin a fresh warmup/window after the reset;
- FPS and Refresh Rate controllers own their own warmup, rolling windows, calculations, trace history, and result presentation.

The sampler must not calculate FPS or refresh rate itself.

# 4. Gamepad behavior

Discovery:

- read visible gamepads from `navigator.getGamepads()`;
- use connection/disconnection events as signals;
- while a controller is selected, poll its current state with rAF.

Multiple controllers:

- auto-select the first visible controller;
- show a compact selector only when more than one is visible;
- selector labels are neutral ordinal labels: `Controller 1`, `Controller 2`, and so on;
- do not use raw `gamepad.id` as the visible label.

Standard mapping:

- rich generic controller SVG;
- standard button/stick semantics;
- Stick Drift and Deadzone supported.

Non-standard mapping:

- Gamepad Tester: compact basic fallback with numbered button indicators and numbered normalized axis indicators/bars;
- do not imply physical button/axis placement for a non-standard mapping;
- Stick Drift / Deadzone: unsupported in MVP rather than guessing physical axes.

Do not display, persist, or send raw gamepad `id` in MVP. Mapping support may be shown only when it explains a limitation.

# 5. Stick Drift algorithm

Requires standard mapping.

Flow:

```text
release both sticks
Start test
sample 3 seconds
show result
```

Standard axes:

```text
left  = axes[0], axes[1]
right = axes[2], axes[3]
```

Per stick:

```text
meanX = mean(x)
meanY = mean(y)
centerOffset = sqrt(meanX² + meanY²)
displayPercent = centerOffset * 100
```

Display to one decimal place.

Primary UI has no `Good/Bad`, severity, or pass/fail threshold.

The fading trail is visual context, not a second scoring system.

If tab visibility is lost or controller disconnects during the 3-second sample, cancel the test and require restart.

# 6. Deadzone algorithm

Requires standard mapping.

User selects left or right stick, releases it, then starts a 3-second sample.

For every sample:

```text
r = sqrt(x² + y²)
```

Then:

```text
centerNoise = percentile95(r)
suggestedDeadzone = min(1, centerNoise + 0.01)
```

Display:

- center noise as percentage, one decimal place;
- suggested deadzone rounded **up** to the nearest whole percentage point.

Example:

```text
p95 center noise = 2.7%
suggested = 3.7%
display suggested = 4%
```

This is explicitly a heuristic starting value, not a universal correct deadzone.

No deadzone slider in MVP.

# 7. Mouse DPI algorithm and UX

The user supplies the physical travel distance.

Default:

```text
10 cm
```

Distance input contract:

- value must be finite and greater than zero;
- decimal values are allowed;
- changing `cm ↔ in` converts the current value so the represented physical distance remains the same;
- no arbitrary maximum distance is required for MVP unless a later UX constraint justifies one.

Instruction:

```text
Move your mouse horizontally exactly 10 cm, then click once to finish.
```

Preferred mode:

1. Start button provides transient user activation.
2. Request Pointer Lock with `unadjustedMovement: true`.
3. If unsupported, retry regular Pointer Lock.
4. If Pointer Lock is unavailable, use unlocked movement events as fallback.
5. Start accumulation only after the selected capture mode is active.
6. Only after capture is active, arm the next eligible click as the finish action; the Start activation event must never finish the measurement it starts.
7. Accumulate signed horizontal deltas.
8. User clicks once to finish.
9. Exit Pointer Lock if active.

Unlocked fallback contract:

- collect page-level pointer/mouse movement only while the measurement session is active;
- do not require a separate physical-distance rail or pretend movement is constrained to a known centimeter region;
- the next eligible click after capture activation finishes the measurement;
- Escape, focus/capture loss, cancellation, or teardown ends the active session and clears accumulation.

Calculation:

```text
distanceInches = enteredDistance converted to inches
netHorizontalUnits = abs(sum(movementX))
estimatedDPI = netHorizontalUnits / distanceInches
```

Always label result `Estimated DPI`.

The live visualization may show relative movement from the origin, but **must not claim physical centimeter/inch progress**.

Fallback modes may be affected by OS acceleration, zoom/scaling, and browser/OS delta units.

Escape/capture loss cancels the active measurement.

# 8. FPS algorithm

Meaning:

```text
observed frame delivery of this browser page
```

It is not a game's FPS and not a GPU benchmark.

Use the `requestAnimationFrame` callback timestamp as the measurement clock. Do not mix it with `performance.now()` timestamps in the FPS calculation window.

Warmup:

```text
500 ms
```

Rolling window:

```text
1000 ms
```

FPS:

```text
(frameCount - 1) * 1000 / (lastTimestamp - firstTimestamp)
```

Supporting value:

```text
median rAF delta in the same rolling window
```

Trace:

```text
one rolling FPS point every 250 ms
8 seconds maximum history
Canvas
```

No categorical `Stable/Unstable` result in MVP.

When `FrameSampler` emits `reset`, clear the FPS window and trace state; on resumed samples, perform a fresh 500 ms warmup before producing a new measurement.

# 9. Refresh Rate algorithm

Meaning:

```text
estimate of display cadence visible to the browser
```

It is not an EDID/hardware readout.

Use the same `FrameSampler` and its rAF callback timestamps.

Warmup:

```text
500 ms
```

Estimation window:

```text
most recent 1500 ms while visible
```

Valid frame delta:

```text
finite and > 0
```

Representative interval:

```text
median valid rAF delta
```

Do not add another outlier-removal algorithm or long-frame threshold in MVP.

Estimate:

```text
estimatedHz = 1000 / medianDelta
```

Display one decimal place.

Common-mode helper list:

```text
30, 50, 60, 72, 75, 90, 100, 120, 144, 165, 180, 200, 240, 360, 480
```

Show `Closest common mode` only if:

```text
abs(estimate - mode) / mode <= 0.03
```

Otherwise omit the helper value.

When `FrameSampler` emits `reset`, clear the estimation window and trace state; on resumed samples, perform a fresh 500 ms warmup.

# 10. Keyboard behavior

Use global listeners on the dedicated Keyboard Tester page.

- `KeyboardEvent.code` drives physical-position highlighting.
- `KeyboardEvent.key` may appear as secondary text.
- repeated `keydown` does not duplicate pressed state.
- `keyup` removes from pressed set.
- blur/visibility loss clears pressed state.
- never globally call `preventDefault()`.
- Tab navigation remains normal.
- OS/browser-reserved shortcuts may be unobservable and must not be diagnosed as broken hardware.

Visual keyboard is DOM/CSS, not SVG.

# 11. FPS vs Refresh Rate page boundary

Keep both pages.

`/fps-test`:

- targets FPS/frame-rate language;
- shows short-term page frame delivery and recent drops;
- explicitly says it does not measure another game's FPS.

`/refresh-rate-test`:

- targets monitor/refresh-rate language;
- estimates base display cadence;
- shows `Closest common mode` only under the 3% rule.

Do not duplicate content/visual hierarchy verbatim.

# 12. Responsive boundary

Strict one-screen completion:

```text
viewport >= 1366×768 desktop
```

At `1024×768`:

- complete usability required;
- vertical scroll allowed.

At ~390px mobile:

- correct layout/fallback required;
- one-screen completion not required;
- some hardware capabilities may be unsupported.

# 13. Browser support target

Tier 1:

```text
latest Chrome desktop
latest Edge desktop
latest Firefox desktop
```

Tier 2 graceful degradation:

```text
latest Safari macOS
Safari iOS
Chrome Android
```

Tier 2 does not require raw Pointer Lock support.

Never use UA sniffing as the primary capability decision; use feature detection.

# 14. Visual design boundary

Direction:

```text
instrument minimalism
mostly neutral/monochrome
one restrained cool live-signal accent
data-driven motion only
strong measurement numerals
```

Exact accent hex value is intentionally left for the first human visual review.

The first Gamepad page is the visual-system checkpoint before styling is propagated.

# 15. Analytics boundary

Required:

```text
Google Search Console
```

Optional at initial launch:

```text
coarse product analytics
```

If enabled:

- no raw hardware/input streams;
- no per-frame/per-key events;
- prefer no-cookie/no-local-storage configuration;
- do not interrupt the tool with a product-analytics consent experience unless legally required.

Production DoD does not require custom analytics to be enabled.

# 16. Ads boundary

Ads are post-MVP.

When added:

- never between H1/instruction and the tool;
- never inside the tool card;
- never overlay the visualization/result;
- first preferred placement is after the primary tool/result.

# 17. Intentionally open decisions

These are not implementation gaps:

- final brand/domain;
- static hosting provider;
- exact accent color;
- optional analytics provider;
- future ad provider.

Everything else in the MVP should follow the numbered docs rather than being re-decided by the agent.

# 18. Operational simplicity

MVP has no:

```text
server process
database
scheduled job
external data synchronization
account lifecycle
manual device catalog
paid runtime API
```

Static hosting plus browser-native execution is the intended operating model.

A feature that requires recurring server/data maintenance is outside MVP unless explicitly approved.

# 19. Strategy cross-reference

This document owns exact implementation behavior.

Business objective, initial search market, staged release order, and expansion rules are defined by `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`.

If a strategic requirement appears to make an exact implementation decision inappropriate, do not silently override either document; report the conflict.
