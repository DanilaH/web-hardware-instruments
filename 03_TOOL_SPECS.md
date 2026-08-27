# MVP Tool Specifications

## Shared UX rule for every tool

The primary tool must fit into one desktop viewport and have one obvious job.

Primary UI should show only:

```text
instruction
interactive area
primary status/result
one primary action if needed
```

Secondary/raw diagnostic information may appear below the fold or inside a compact optional `Details` disclosure.

Do not build dashboard layouts.

---

# 1. Gamepad Tester

## Goal

Immediately show whether the browser sees the connected controller and whether its main inputs respond.

## Data

Use `GamepadService`, which owns access to:

```ts
navigator.getGamepads()
```

The UI must not start its own independent polling loop.

## Primary screen

Show:

- short instruction: `Connect your controller and press any button.`
- compact detected/not-detected status;
- selected-controller control only when more than one controller is visible;
- rich generic controller visualization for `mapping === "standard"`;
- button press states;
- left/right stick positions;
- trigger states when available.

For non-standard mappings, Gamepad Tester uses a compact basic fallback view instead of pretending the generic controller layout is correct.

The fallback shows numbered button indicators and numbered normalized axis indicators/bars. It must not imply physical button/axis placement.

When multiple controllers are visible, use neutral selector labels such as:

```text
Controller 1
Controller 2
```

Do not use raw `gamepad.id` as the visible selector label.

That is enough for the primary tool.

The controller SVG is not decorative: it is the main live diagnostic visualization.

## Keep technical metadata out of MVP UI

Do not show:

- gamepad index;
- raw `id`;
- raw axis arrays;
- technical API information.

Only mapping support state may be surfaced when needed to explain why the rich controller view or Drift/Deadzone is unavailable.

## Behavior

No controller:

```text
No controller detected
Connect a controller and press any button.
```

Connected:

```text
Controller detected
Press buttons and move the sticks to test them.
```

Disconnect must return cleanly to the waiting state.

---

# 2. Controller Stick Drift Test

## Goal

Answer one question:

```text
Does the stick move while I am not touching it?
```

## Flow

1. Controller is detected.
2. User is told: `Release both sticks and keep them untouched.`
3. User presses one clear `Start test` button.
4. Sample for a short fixed interval.
5. Show result in the same card.

## Primary result

Per stick:

```text
Left stick
Observed center offset: 3.8%

Right stick
Observed center offset: 0.9%
```

Do not show `Good / Bad`, `Small / Noticeable / High`, or a pass/fail label in MVP. There is no universal drift threshold across games and controller software.

The primary visualization should be a center crosshair with the current stick point and a short fading trail so drift/jitter is visible over time.

Do not expose six different statistical metrics in the primary view.

## Internal calculations

For a standard-mapped controller, sample both sticks for 3 seconds while untouched.

For each stick:

```text
meanX = mean(x samples)
meanY = mean(y samples)
centerOffset = sqrt(meanX² + meanY²)
```

Display `centerOffset × 100` as a percentage, rounded to one decimal place.

A short recent trail may visualize jitter, but secondary statistics stay out of the primary UI.

Stick Drift requires standard gamepad mapping in MVP. If the selected controller is not standard-mapped, show a clear limitation instead of guessing axis semantics.

---

# 3. Controller Deadzone Test

## Goal

Help the user understand center noise and choose a reasonable starting deadzone.

## Primary screen

- controller selection only when more than one controller is visible;
- left/right stick selection;
- live stick position;
- center-noise estimate;
- simple heuristic starting deadzone.

Example:

```text
Observed center noise: 2.7%
Suggested starting deadzone: ~4%
```

## Keep it simple

Use a radial stick plot with a visible deadzone ring. The ring should make the relationship between center noise and the suggested deadzone understandable at a glance.

Do not add an advanced deadzone simulation dashboard to MVP.

MVP has no deadzone preview slider.

For the selected standard-mapped stick:

1. ask the user to release the stick;
2. sample radial magnitude for 3 seconds;
3. compute the 95th percentile of radial magnitude;
4. calculate the heuristic starting deadzone as:

```text
suggested = min(1, p95CenterNoise + 0.01)
```

5. round the displayed suggestion up to the nearest whole percentage point.

The UI must call this a `Suggested starting deadzone` and state below the tool that it is a heuristic, not a universal correct value.

No large raw-values table.

---

# 4. Mouse DPI Test

## Goal

Estimate DPI with the fewest possible steps.

## Primary flow

```text
Distance: [ 10 ] [cm]
[ Start test ]

Move your mouse exactly 10 cm.

Estimated DPI: 1590
```

The input, action, movement area/instruction, and result must fit inside one tool card.

Do not show fake physical-distance progress: the browser cannot know how many centimeters the mouse has physically moved before DPI is known.

During capture, show a compact horizontal relative-movement trace/origin marker only to confirm that movement is being recorded.

The instruction remains explicit:

```text
Move your mouse horizontally exactly 10 cm, then click once to finish.
```

## Primary controls

Only:

- distance;
- cm/in unit;
- `Start test`;
- context-dependent `Cancel/Reset` only when needed.

Distance behavior:

- value must be finite and greater than zero;
- decimals are allowed;
- switching `cm ↔ in` converts the current value so the represented physical distance stays the same.

Do not show trial history, advanced calibration, charts, or multiple measurement modes in MVP.

## Capture behavior

Preferred acquisition mode requests Pointer Lock with `unadjustedMovement: true` from the Start user gesture.

If raw/unadjusted movement is not supported, fall back to regular Pointer Lock; if Pointer Lock itself is unavailable, fall back to normal page-level movement events while the measurement session is active.

Accumulation begins only after the selected capture mode is active.

The finish click becomes armed only after capture is active. The Start activation event must never be interpreted as the finish click for the same measurement.

In unlocked fallback, collect movement only while the measurement session is active. Do not invent a physical-distance rail or constrained centimeter movement region.

Escape, capture/focus loss, cancellation, or teardown cancels the active measurement and clears accumulation.

## Important wording

Always:

```text
Estimated DPI
```

Never imply direct hardware DPI access.

## Below the fold

The result remains an estimate in every mode. Fallback modes may be affected by:

- OS acceleration;
- browser/OS movement units;
- browser zoom/scaling;
- event processing.

Do not put a large caveat wall inside the primary interaction.

---

# 5. FPS Test

## Goal

Show the user the browser-observed frame rate immediately.

## Interaction

The measurement should start automatically when the page/tool is active.

No Start button unless a real technical reason requires it.

## Primary result

Large:

```text
Observed FPS
144
```

Secondary, compact:

```text
Median frame time: 6.9 ms
```

Do not show a categorical `Stable/Unstable` label in MVP.

Do not show a dense real-time dashboard.

Use a compact 5–10 second live FPS trace as part of the primary visualization. The trace must communicate drops/stability and remain visually lightweight. Do not add a chart library or dashboard controls.

## Technical calculation

Use the timestamp supplied to the `requestAnimationFrame` callback as the measurement clock.

Do not mix `performance.now()` timestamps into the FPS calculation window.

Use a 500 ms warmup.

Primary FPS is calculated from the most recent 1000 ms window:

```text
fps = (frameCount - 1) * 1000 / (lastTimestamp - firstTimestamp)
```

Median frame time is the median positive finite `requestAnimationFrame` delta over the same rolling window.

The live trace stores one rolling FPS point every 250 ms and keeps only the most recent 8 seconds.

If `FrameSampler` signals a reset because visibility was lost, clear measurement/trace state and perform a fresh warmup when sampling resumes.

The page must explicitly state below the primary result:

```text
This measures frame delivery in this browser page, not FPS inside a game.
```

---

# 6. Refresh Rate Test

## Goal

Answer:

```text
What refresh rate is this browser currently observing?
```

## Interaction

Measure automatically while the page is visible.

## Primary result

```text
Estimated refresh rate
143.9 Hz

Closest common mode
144 Hz
```

No complicated controls are needed.

Use a restrained cadence/frame-interval trace to show whether the estimate is stable. It should be visually quieter than the FPS trace.

No `Measure again` control is needed in MVP; the estimate updates automatically while the page remains visible.

## Technical behavior

- reuse `FrameSampler`;
- use rAF callback timestamps supplied by the sampler;
- discard the first 500 ms as warmup;
- use a rolling 1500 ms visible-tab window;
- a valid frame delta is finite and greater than zero;
- estimate refresh interval as the median valid frame delta;
- do not add a separate outlier-removal threshold/filter in MVP;
- calculate `estimatedHz = 1000 / medianDelta`;
- display Hz rounded to one decimal place;
- optionally show `Closest common mode` only when the nearest configured common mode is within 3% of the estimate;
- on a `FrameSampler` reset, clear result/trace state and perform a fresh warmup when sampling resumes.

## Below the fold

Explain multi-monitor/browser/power-saving limitations.

---

# 7. Keyboard Tester

## Goal

Let the user press keys and immediately see whether the browser receives them.

## Interaction

No Start button.

Instruction:

```text
Press any key to test it.
```

## Primary screen

- compact DOM/CSS keyboard used as the primary live visualization;
- pressed keys highlighted;
- last detected key;
- pressed-key count if multiple keys are held.

## Secondary details

`KeyboardEvent.code` and `KeyboardEvent.key` can be shown compactly, but they must not dominate the tool.

Do not show a debug-event table.

## Behavior

- `KeyboardInputService` owns global `keydown` / `keyup` listeners for this tool page;
- repeated `keydown` events must not create duplicate pressed-key state;
- clear pressed state on blur/visibility loss;
- never call `preventDefault()` globally;
- preserve Tab navigation;
- document below the tool that browser/OS-reserved shortcuts may not be observable;
- use `KeyboardEvent.code` for physical-position highlighting;
- remain useful even if visible key labels do not perfectly match every locale.

---

# Measurement honesty

The main result label must match capability:

| Tool | Primary label |
|---|---|
| Gamepad inputs | Browser-detected input |
| Stick drift | Observed center offset |
| Deadzone | Observed center noise / suggested starting deadzone |
| Mouse DPI | Estimated DPI |
| FPS | Observed FPS |
| Refresh rate | Estimated refresh rate |
| Keyboard | Detected key input |

Never replace these with stronger hardware claims for marketing.
