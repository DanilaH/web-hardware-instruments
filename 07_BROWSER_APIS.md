# Browser API and Measurement Rules

## General rule

Browser APIs report browser-visible state, not necessarily raw hardware state.

Documentation and UI must distinguish these.

# Gamepad

Primary API:

```ts
navigator.getGamepads()
```

Use for:

- connected controller enumeration
- buttons
- triggers
- axes

Known product considerations:

- a controller may not become visible until the user interacts with it;
- IDs can vary by browser/platform;
- axis ordering and mapping can differ on non-standard devices.

Do not hardcode assumptions beyond standard mappings without guards.

For non-standard mappings, the Gamepad Tester fallback uses numbered button indicators and numbered normalized axis indicators/bars. It must not imply physical placement or expose raw `gamepad.id`.

# Keyboard

Primary events:

```text
keydown
keyup
```

Use:

```text
KeyboardEvent.code
```

for physical key position.

Use:

```text
KeyboardEvent.key
```

for interpreted key value.

Clear held state when:

- window blurs;
- document becomes hidden.

Do not capture text entered into unrelated fields as analytics.

Full-v1 Keyboard Tester plus Expansion 1 Rollover/Ghosting reuse `KeyboardInputService`; do not create separate keyboard acquisition implementations.

# Mouse

## Mouse DPI

`MouseMovementService` remains specialized for Mouse DPI movement capture.

Primary sources include:

```text
pointer/mouse movement
movementX
movementY
Pointer Lock
```

Preferred DPI acquisition uses Pointer Lock requested from the explicit Start user gesture.

Request `unadjustedMovement: true` first. If the platform reports that unadjusted/raw movement is unsupported, retry normal Pointer Lock. If Pointer Lock is unavailable, fall back to unlocked mouse movement.

The UI must not pretend fallback movement is hardware counts. `movementX` units can vary by browser/OS.

Mouse DPI must always be described as estimated.

Distance input and finish-click arming semantics are defined in `18_DECISIONS_AND_BOUNDARIES.md` and must not be independently reinterpreted.

## Expansion 1 ordinary mouse diagnostics

`MouseInputService` owns ordinary browser mouse acquisition for the approved Expansion 1 mouse tools:

```text
button down/up
wheel
ordinary pointer movement
explicit high-frequency polling profile
blur / visibility clear signals
```

When Pointer Events are used, ignore a present `pointerType` that is not `"mouse"`. Touch/pen input on hybrid hardware must not be presented as mouse input.

For the polling profile, select one acquisition source for a measurement session according to the exact precedence/fallback rules in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`. Do not merge timestamps from concurrent raw/coalesced/basic event streams into one result.

Browser-observed pointer sample frequency is not guaranteed USB/device hardware polling rate.

# Touch

Expansion 1 uses `TouchInputService` with Pointer Events and accepts only:

```text
pointerType === "touch"
```

Mouse and pen/stylus input are not equivalent to finger-touch input for this tool.

For high-motion coverage, `getCoalescedEvents()` may provide multiple browser-observed pointer samples that the user agent combined into one dispatched event. Those samples may count as observed touch coverage when they are finite and actually inside the active test surface. Never synthesize intermediate coverage samples merely to connect two points.

`navigator.maxTouchPoints` is a capability hint/report, not proof that a specific touch contact will be delivered to the page.

`touch-action: none` applies only to the active diagnostic surface. Normal page scrolling/zoom behavior remains available outside it.

Blur or hidden visibility invalidates active contact state. A hands-off observation interval must be continuously observable; if focus/visibility is lost, cancel that run rather than claiming a complete quiet interval.

# Display

Primary acquisition:

```text
requestAnimationFrame
document.visibilityState
```

The measurement clock is the timestamp passed to the `requestAnimationFrame` callback.

Do not mix `performance.now()` timestamps into FPS/refresh-rate measurement windows when rAF callback timestamps are already available.

Use visibility handling to invalidate measurements when the tab is backgrounded. `FrameSampler` owns this lifecycle and emits the reset semantic defined in `18_DECISIONS_AND_BOUNDARIES.md`; display tools must not implement competing native rAF acquisition loops.

Potential distortions:

- browser scheduling;
- compositor timing;
- battery saver;
- multi-monitor timing;
- background throttling;
- unstable frame production.

Expansion 1 Frame Skipping reuses `FrameSampler` for pattern timing/readiness. Browser timing can support a camera test but cannot prove physical monitor frame skipping by itself. Its exact readiness/capture-epoch semantics live in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

# Fullscreen

Expansion 1 approves one small shared progressive-enhancement Fullscreen helper for:

- Touch Screen Test;
- Dead Pixel Test;
- Backlight Bleed Test.

The helper owns feature detection, request, exit, actual fullscreen-state observation, rejection handling, and cleanup.

A fullscreen request must occur from eligible user activation. Success is based on actual fullscreen state, not merely the absence of a synchronous exception.

Every tool must remain usable with its documented in-page fallback when Fullscreen is unsupported/rejected.

# WebHID

Do not use WebHID in the current approved scope.

Reasons:

- permission UX;
- limited compatibility;
- higher product complexity;
- unnecessary for current approved tools.

Add only after a specific future feature cannot be achieved satisfactorily with broadly supported APIs and the scope change is explicitly approved.

# Web Audio / MediaDevices

Not part of Hardware Expansion 1.

If microphone/audio tools are approved later, treat permission handling as a distinct product concern.

# Accuracy language matrix

| Measurement | Label |
|---|---|
| Gamepad button pressed | direct browser-observed state |
| Gamepad axis value | direct browser-observed state |
| Stick center offset | calculated from browser-observed axes |
| Deadzone suggestion | heuristic |
| Mouse DPI | estimate |
| Mouse button/wheel input | browser-observed input |
| Mouse polling test | observed browser pointer sample rate, not guaranteed hardware polling |
| Touch input / coverage | browser-observed finger-touch input / test-area coverage |
| Touch hands-off check | unexpected browser touch input observed during a complete visible interval |
| Keyboard rollover | maximum simultaneous browser-observed key set, not NKRO certification |
| Keyboard ghosting | expected vs browser-observed combination, assuming user followed instruction |
| Browser FPS | observed browser rendering rate |
| Display refresh rate | estimate |
| Dead Pixel / Backlight | visual inspection only |
| Frame Skipping | camera-assisted visual evidence; browser readiness is not a monitor verdict |
| Physical keyboard hardware latency | not supported accurately |
| Mouse hardware polling rate | do not claim exact from browser pointer delivery |
| Gamepad hardware polling rate | do not claim exact |

# Browser support behavior

For every tool:

```text
if unsupported:
    explain capability is unavailable
    do not show broken controls
    offer related supported tools when sensible
```

Do not hide the entire page because the tool is unsupported.

# Browser API access pattern

Native acquisition goes through the corresponding small typed boundary:

| Native capability | Boundary |
|---|---|
| Gamepad API | `GamepadService` |
| `requestAnimationFrame` timing | `FrameSampler` |
| Keyboard events | `KeyboardInputService` |
| Mouse DPI movement / Pointer Lock | `MouseMovementService` |
| Ordinary mouse buttons/wheel/movement/polling | `MouseInputService` |
| Finger-touch Pointer Events | `TouchInputService` |
| Fullscreen request/exit/state | shared Fullscreen helper |

Tool-specific logic consumes normalized events/samples/snapshots and owns interpretation/presentation state.

Do not scatter direct native acquisition across UI components, and do not generalize the specialized Mouse DPI service merely for naming uniformity.

# Gamepad mapping boundary

For `mapping === "standard"`:

- use the rich generic controller visualization;
- standard stick axis semantics may power Drift/Deadzone.

For non-standard mapping:

- Gamepad Tester provides only numbered button indicators and numbered normalized axis indicators/bars;
- it does not guess physical control placement;
- Stick Drift and Deadzone do not guess which axes are physical sticks in full v1.

If multiple gamepads are visible, auto-select the first visible gamepad and show a compact selector with neutral labels such as `Controller 1`, `Controller 2`.

# Secure-context / embedding boundary

Production is HTTPS.

Gamepad access can be affected by browser Permissions Policy and some Gamepad functionality is secure-context dependent. The product is designed as a top-level page, not an embedded third-party widget.

# Display timing boundary

`requestAnimationFrame()` generally follows display refresh cadence and is normally paused/throttled in hidden tabs.

Therefore:

- measurement is valid only while the document is visible;
- hide/background transitions reset display measurements through `FrameSampler`;
- FPS means this page's delivered animation frames, not the FPS of another game/application;
- refresh rate is an estimate from browser-visible cadence, not a hardware EDID readout;
- Frame Skipping browser readiness/capture timing is invalidated when `FrameSampler` resets.

# Keyboard shortcut boundary

Some browser/OS-reserved shortcuts may never be exposed to page JavaScript.

Keyboard diagnostics must not claim that an unobserved reserved shortcut proves a broken key, and must not globally `preventDefault()` to force reserved combinations through.
