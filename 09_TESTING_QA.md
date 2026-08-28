# Testing and QA

## Testing philosophy

The highest-risk bugs are not generic rendering bugs. They are:

- wrong diagnostics;
- stale input states;
- browser API lifecycle bugs;
- misleading precision;
- device-specific failures.

Full-v1 exact QA semantics come from `18_DECISIONS_AND_BOUNDARIES.md`. Approved Post-v1 Hardware Expansion 1 adds route-specific tests and real-device gates in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

## Unit tests

Pure calculations must be unit tested.

### Gamepad

Test:

```text
radial magnitude
sample aggregation
drift summary
deadzone transform
clamping
```

### Display

For full-v1 FPS/Refresh, test only the semantics defined by `18_DECISIONS_AND_BOUNDARIES.md`:

```text
positive finite frame-delta validation
rolling-window boundaries
FPS window calculation
median frame delta
Hz estimation
nearest common refresh mode
reset/re-warm behavior
```

Do not invent an additional outlier filter, rolling-average algorithm, long-frame threshold, MAD filter, or trimming rule unless the relevant source of truth is explicitly amended first.

Expansion 1 Frame Skipping has its own provisional **readiness-gated sequential capture-epoch** semantics and tests in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`. Browser timing validates whether the camera pattern is trustworthy; it must not manufacture visual pattern gaps through elapsed-time ordinal arithmetic.

### Mouse DPI

Test:

```text
cm → inches conversion
distance validation
unit conversion preserving physical distance
DPI estimate formula
movement accumulation and reset
capture activation vs finish-click arming
```

### Expansion 1 Mouse

Use `20` for the exact list. It includes deterministic tests for:

```text
MouseInputService normalization/lifecycle
one polling source per attempt
pre-measurement source selection/fallback
selected source remains fixed during the attempt
coalesced timestamp extraction
rapid-repeat interval helper
observed polling-rate math
```

Do not invent a hidden polling liveness timeout or switch/mix timestamp sources after the 2-second measurement has begun. Insufficient samples from the selected source return the documented retry state.

### Keyboard

Most browser event behavior should be integration-tested, but state reducers/helpers can be unit tested.

Expansion 1 Rollover/Ghosting reuse the existing keyboard acquisition service; test their additional state/expected-combination semantics rather than introducing another acquisition path.

### Touch

Use `20` for exact Touch tests, including:

```text
finger-only filtering
coalesced observed samples
inside-surface measurement boundary
exact final-cell edge mapping
separate pass1/pass2 coverage
no synthetic/clamped coverage
hands-off continuous-visibility cancellation
```

## Integration tests

Use browser automation for non-device UI flow where it materially improves confidence.

Mock browser inputs for capability boundaries such as:

```text
GamepadService snapshots
FrameSampler timing/reset events
Keyboard events
MouseMovementService deltas
MouseInputService button/wheel/pointer events
TouchInputService touch events/clear signals
Fullscreen helper state transitions
```

Do not pretend mocked tests replace real hardware QA.

## Manual hardware QA matrix

### Gamepads

At least:

- Xbox-style XInput controller
- PlayStation-style controller where available
- generic/third-party controller if available

Check:

- standard mapping visualization
- non-standard mapping fallback
- multiple-controller selection
- all standard buttons
- triggers
- both sticks
- reconnect
- unplug while testing

### Mouse

Full-v1 Mouse DPI:

- raw/unadjusted Pointer Lock path where supported
- regular Pointer Lock fallback
- unlocked movement fallback
- moving left and right
- cancel with Escape
- finish by click
- Start activation cannot finish the same measurement
- unit switching preserves the configured physical distance
- different OS pointer scaling/acceleration settings for fallback behavior
- browser zoom changes for fallback behavior

Expansion 1 mouse routes additionally require the applicable real-device checks in `20`, including side buttons, wheel behavior, rapid-repeat flow, polling source/caveat, and no accidental navigation.

For Mouse Polling, verify that the visible Source matches the source selected before measurement starts and that the attempt never switches or mixes streams mid-run.

### Touch

For Touch Screen Test, real touch hardware is required for release-ready status. Follow `20` for:

- single/multi-touch;
- edges/corners and exact final-cell mapping;
- coalesced observed-sample coverage where supported;
- out-of-surface pointer-capture behavior;
- separate confirmation pass;
- pointercancel;
- hands-off guard and blur/hidden cancellation;
- fullscreen/fallback;
- mouse/pen filtering.

### Display

Full-v1 checks if possible:

- 60 Hz
- 120/144 Hz
- multi-monitor setup
- moving tab between monitors
- background/foreground tab

Expansion 1 Dead Pixel/Backlight require real visual/fullscreen/fallback smoke. Frame Skipping requires a real camera and the evidence procedure in `20`; screenshots do not count. Verify that READY disappears before an unstable timing sample advances the trusted pattern and that a fresh READY state starts a fresh sequential epoch.

### Keyboard

Full-v1:

- normal keyboard
- modifiers
- repeated keydown
- blur during held keys
- typing into form inputs
- Tab navigation

Expansion 1 additionally requires real Rollover/Ghosting combination smoke according to `20`, while preserving reserved-shortcut limitations.

## Browser matrix

Tier 1 desktop:

```text
Chrome latest
Edge latest
Firefox latest
```

Tier 2 / graceful-degradation:

```text
Safari latest on macOS
Safari iOS
Chrome Android
```

Tier 2 requires correct layout, honest unsupported/fallback states, and working tools where the needed API is available; it does not require raw Pointer Lock capability.

Touch Screen Test is mobile/tablet oriented, so its route-specific real-device matrix in `20` is part of release-ready status even though the project-wide desktop matrix remains important for desktop-relevant tools.

## Failure cases

Explicitly test where applicable:

- API unavailable
- permission/interaction required
- device disconnected mid-test
- tab hidden
- browser window loses focus
- invalid physical distance
- zero samples
- noisy/unstable sample stream
- requestAnimationFrame interrupted
- polling source unsupported before measurement starts
- insufficient samples from the selected polling source
- touch pointercancel/out-of-surface capture
- fullscreen rejected/unsupported
- continuous-observation test interrupted by blur/hidden visibility

## SEO QA

Verify only for real implemented routes intended for release:

- unique title
- unique H1
- canonical
- sitemap entry when indexing is enabled for the real production origin
- no accidental indexability of debug/placeholder routes
- HTML contains primary explanatory text without JS execution
- internal links resolve
- 404 works

The repository intentionally remains `noindex` while the `.invalid` placeholder origin is active.

## Accessibility QA

Keyboard-navigate the whole page where keyboard interaction is meaningful.

Verify accessible equivalents for:

- controller visualization state;
- icon buttons;
- result summaries;
- Canvas traces/pattern readiness via numeric/text output;
- mouse/touch visual state via concise textual status/metrics;
- fullscreen test instructions and exit behavior.

The controller SVG itself may be `aria-hidden` if the same state is available in concise text; do not make every decorative SVG sub-part individually focusable.
