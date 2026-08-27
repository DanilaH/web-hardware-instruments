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

Clear state when:

- window blurs
- document becomes hidden

Do not capture text entered into unrelated fields as analytics.

# Mouse

Primary sources:

```text
pointermove
mousemove
movementX
movementY
```

Preferred DPI acquisition uses Pointer Lock requested from the explicit Start user gesture.

Request `unadjustedMovement: true` first. If the platform reports that unadjusted/raw movement is unsupported, retry normal Pointer Lock. If Pointer Lock is unavailable, fall back to unlocked mouse movement.

The UI must not pretend fallback movement is hardware counts. `movementX` units can vary by browser/OS.

Mouse DPI must always be described as estimated.

# Display

Primary:

```text
requestAnimationFrame
performance.now()
document.visibilityState
```

Use visibility checks to avoid invalid measurements when the tab is backgrounded.

Potential distortions:

- browser scheduling
- compositor timing
- battery saver
- multi-monitor timing
- background throttling
- unstable frame production

# Fullscreen

Fullscreen may be useful later for:

- dead pixel test
- display test

It is not required for core MVP pages except if UX clearly benefits.

# WebHID

Do not use WebHID in MVP.

Reasons:

- permission UX
- limited compatibility
- higher product complexity
- unnecessary for current validated tools

Add only after a specific feature cannot be achieved satisfactorily with broadly supported APIs.

# Web Audio / MediaDevices

Not part of the initial hardware MVP.

If microphone/audio tools are added later, treat permission handling as a distinct product concern.

# Accuracy language matrix

| Measurement | Label |
|---|---|
| Gamepad button pressed | direct browser-observed state |
| Gamepad axis value | direct browser-observed state |
| Stick center offset | calculated from browser-observed axes |
| Deadzone suggestion | heuristic |
| Mouse DPI | estimate |
| Browser FPS | observed browser rendering rate |
| Display refresh rate | estimate |
| Physical keyboard hardware latency | not supported accurately in MVP |
| Mouse hardware polling rate | do not claim exact without stronger method |
| Gamepad hardware polling rate | do not claim exact in MVP |

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

All native acquisition should go through the corresponding thin typed capability service:

| Native capability | Service |
|---|---|
| Gamepad API | `GamepadService` |
| `requestAnimationFrame` + Performance | `FrameSampler` |
| Keyboard events | `KeyboardInputService` |
| Pointer/mouse movement | `MouseMovementService` |

Tool-specific logic consumes normalized samples/snapshots from these services.

Do not scatter direct native API calls across UI components.


# Gamepad mapping boundary

For `mapping === "standard"`:

- use the rich generic controller visualization;
- standard stick axis semantics may power Drift/Deadzone.

For non-standard mapping:

- Gamepad Tester provides only a compact generic button/axis fallback;
- Stick Drift and Deadzone do not guess which axes are physical sticks in MVP.

If multiple gamepads are visible, auto-select the first visible gamepad and show a compact selector.

# Secure-context / embedding boundary

Production is HTTPS.

Gamepad access can be affected by browser Permissions Policy and some Gamepad functionality is secure-context dependent. The MVP is designed as a top-level page, not an embedded third-party widget.

# Display timing boundary

`requestAnimationFrame()` generally follows display refresh cadence and is normally paused/throttled in hidden tabs.

Therefore:

- measurement is valid only while the document is visible;
- hide/background transitions reset display measurements;
- FPS means this page's delivered animation frames, not the FPS of another game/application;
- refresh rate is an estimate from browser-visible cadence, not a hardware EDID readout.

# Keyboard shortcut boundary

Some browser/OS-reserved shortcuts may never be exposed to page JavaScript.

Keyboard Tester must not claim that an unobserved reserved shortcut proves a broken key.
