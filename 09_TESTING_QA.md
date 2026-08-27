# Testing and QA

## Testing philosophy

The highest-risk bugs are not generic rendering bugs. They are:

- wrong diagnostics;
- stale input states;
- browser API lifecycle bugs;
- misleading precision;
- device-specific failures.

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

Test:

```text
frame interval statistics
outlier handling
rolling averages
Hz estimation
nearest common refresh mode
```

### Mouse DPI

Test:

```text
cm → inches conversion
distance validation
DPI estimate formula
movement accumulation and reset
```

### Keyboard

Most browser event behavior should be integration-tested, but state reducers/helpers can be unit tested.

## Integration tests

Use browser automation for non-device UI flow where possible.

Mock browser inputs for:

```text
GamepadService snapshots
FrameSampler timing streams
Keyboard events
MouseMovementService deltas
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

Check:

- raw/unadjusted Pointer Lock path where supported
- regular Pointer Lock fallback
- unlocked movement fallback
- moving left and right
- cancel with Escape
- finish by click
- different OS pointer scaling/acceleration settings for fallback behavior
- browser zoom changes for fallback behavior

### Display

Check if possible:

- 60 Hz
- 120/144 Hz
- multi-monitor setup
- moving tab between monitors
- background/foreground tab

### Keyboard

Check:

- normal keyboard
- modifiers
- repeated keydown
- blur during held keys
- typing into form inputs
- Tab navigation

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

## Failure cases

Explicitly test:

- API unavailable
- permission/interaction required
- device disconnected mid-test
- tab hidden
- browser window loses focus
- invalid physical distance
- zero samples
- noisy/unstable sample stream
- requestAnimationFrame interrupted

## SEO QA

Verify:

- unique title
- unique H1
- canonical
- sitemap entry
- no accidental noindex
- HTML contains primary explanatory text without JS execution
- internal links resolve
- 404 works

## Accessibility QA

Keyboard-navigate the whole page.

Verify accessible equivalents for:

- controller visualization state;
- icon buttons;
- result summaries;
- Canvas traces via numeric/text output.

The controller SVG itself may be `aria-hidden` if the same state is available in concise text; do not make every decorative SVG sub-part individually focusable.
