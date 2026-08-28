# Exact Decisions and Boundaries

This file is the conflict-resolution source of truth for **global and full-v1/MVP** implementation behavior.

`20_POST_V1_HARDWARE_EXPANSION_SPEC.md` may add explicitly approved post-v1 capability boundaries and route semantics for Hardware Expansion 1. It does not retroactively change full-v1 behavior.

If `20` appears to conflict with this file on a genuinely shared global rule such as privacy, dependency direction, lifecycle discipline, measurement honesty, or runtime constraints, the mismatch must be resolved in documentation before product code proceeds. Do not silently choose one interpretation.

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

Full-v1 rendering boundary:

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

Expansion 1 may extend these same native rendering families only as explicitly described in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` (for example mouse/touch visuals, fullscreen inspection stages, and the Frame Skipping Canvas pattern). It does not authorize a visualization framework or charting runtime.

# 3. Browser capability services

Exactly four thin acquisition boundaries were approved for full v1/MVP:

```text
GamepadService
FrameSampler
KeyboardInputService
MouseMovementService
```

They remain stable and must not be renamed/generalized merely to make post-v1 architecture look uniform.

Expansion 1 explicitly adds only:

```text
MouseInputService
TouchInputService
```

plus the shared Fullscreen helper, which is **not** a hardware acquisition service. Exact Expansion 1 responsibilities live in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

All approved capability services own native acquisition, feature detection, normalization, lifecycle, and cleanup for their assigned job.

They do not own UI, SEO, analytics, result wording, or tool-specific calculations/presentation state.

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

One active acquisition loop/listener set per service/capability per page.

## FrameSampler visibility/reset contract

`FrameSampler` is the only owner of the display timing capability's `visibilitychange` acquisition lifecycle. FPS, Refresh Rate, and Expansion 1 Frame Skipping must not install independent competing rAF acquisition/reset loops.

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
- FPS and Refresh Rate controllers own their own warmup, rolling windows, calculations, trace history, and result presentation;
- Frame Skipping owns its Expansion 1 readiness/capture-epoch interpretation defined in `20`, while still reusing this same sample/reset stream.

The sampler must not calculate FPS, refresh rate, or frame-skipping verdicts itself.

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

For MVP, `percentile95` uses the deterministic nearest-rank definition:

```text
sort radial magnitudes ascending
rank = ceil(0.95 * sampleCount)
percentile95 = sorted[rank - 1]
```

No interpolation is applied between samples.

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

Expansion 1 Touch Screen Test is explicitly mobile/tablet oriented and follows its additional real-device acceptance rules in `20`.

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

The first Gamepad page was the full-v1 visual-system checkpoint. Expansion 1 reuses that system and performs route-specific visual checkpoints defined in `20` rather than redesigning the visual language.

# 15. Analytics boundary

Required at public launch:

```text
Google Search Console
```

Optional:

```text
coarse product analytics
```

If enabled:

- no raw hardware/input streams;
- no per-frame/per-key/per-pointer/per-touch events;
- prefer no-cookie/no-local-storage configuration;
- do not interrupt the tool with a product-analytics consent experience unless legally required.

Production DoD does not require custom analytics to be enabled.

# 16. Ads boundary

Ads are a later monetization layer.

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

Global/full-v1 behavior follows this document. Expansion 1 behavior follows `20` within these global boundaries rather than being independently re-decided by the agent.

# 18. Operational simplicity

The approved project has no:

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

A feature that requires recurring server/data maintenance is outside current approved scope unless explicitly approved.

# 19. Strategy and Expansion cross-reference

This document owns global/full-v1 exact implementation behavior and cross-cutting technical boundaries.

Business objective, approved scope, release order, and expansion rules are defined by `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`.

Exact post-v1 Hardware Expansion 1 route behavior, additional approved acquisition boundaries, algorithms, UX, and route-specific QA are defined by `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

If a requirement appears to conflict across these documents, do not silently override one; resolve the source-of-truth conflict before product code changes.
