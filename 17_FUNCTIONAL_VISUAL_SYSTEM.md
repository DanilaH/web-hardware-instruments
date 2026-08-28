# Functional Visual System

## Design decision

The site should not copy the plain minimalism of a generic text utility.

Hardware diagnostics benefit from a stronger visual identity because the thing being measured is dynamic, spatial, or temporal.

The chosen direction is:

```text
instrument minimalism
=
mostly monochrome interface
+ one restrained live signal accent
+ data-driven motion
+ strong numeric typography
+ simple technical geometry
```

The site should feel closer to a clean measuring instrument than to:

- a SaaS dashboard;
- a gaming product;
- a developer console;
- a generic form website.

## Functional beauty rule

A visual element earns its place only if it does at least one of these:

1. helps the user perform the test;
2. makes the result easier to understand;
3. shows change over time;
4. exposes instability, drift, noise, position, coverage, or input state;
5. makes current state obvious.

If it does none of these, remove it.

Decorative visuals must never compete with diagnostic visuals.

## Visual language

### Base palette

Prefer a light-first, mostly monochrome interface:

- off-white / very light neutral page background;
- near-black text;
- white or slightly elevated tool surfaces;
- neutral gray dividers, grid lines, inactive controls;
- one cool signal accent for active/live data.

The exact accent may be tuned during visual review, but it should feel technical rather than playful.

Recommended direction:

```text
cool blue / cyan-blue signal
```

Use it for:

- live position;
- current sample;
- active control;
- selected state;
- primary action;
- live trace;
- active coverage/contact state.

Do not wash the entire interface in the accent.

### Semantic colors

Success, warning, and error colors are allowed when they carry meaning.

They are exceptions to the mostly monochrome system.

Never rely on them without text or numeric labels.

Do not introduce semantic success/error colors merely to imply hardware health when the tool only reports browser observation or visual inspection.

### Dark mode

Not required in current approved scope.

Do not design the whole product around a dark gaming aesthetic.

A system-following dark mode may be added later after the light system is stable and separately approved.

## Typography

Use a clean sans-serif for interface text.

Use tabular or monospaced numerals for measurements:

```text
144 FPS
143.9 Hz
3.8%
1600 DPI
972 Hz
```

Do not set the whole page in monospace.

Measurement numbers can be visually large, but headings should remain compact.

## Geometry

Prefer:

- thin crisp lines;
- subtle technical grids;
- restrained borders;
- modest corner radius;
- simple circles, axes, tracks, crosshairs.

Avoid:

- giant pill-shaped cards;
- glossy or decorative gradient washes;
- glass effects;
- 3D hardware renderings;
- large decorative blobs.

### CSS gradient implementation note

Do **not** interpret the visual rule as a ban on the CSS function name `linear-gradient()`.

A `linear-gradient()` is acceptable when it is merely the lightweight implementation primitive for a functional technical grid/reference line pattern, for example two 1px repeating axes behind a controller or trace. In that case the user perceives a grid, not a gradient effect.

Not acceptable:

```text
hero gradient washes
color-fade card backgrounds
glossy button gradients
neon/radial atmosphere
ornamental color transitions
```

Acceptable when useful:

```text
1px technical grid lines
reference rulings
simple measurement-oriented repeating guides
```

Judge the rendered purpose, not the CSS function name.

## Motion

Motion should represent data or state.

Good:

- a current FPS point moving through time;
- a fading stick-position trail;
- a deadzone marker following the stick;
- a live mouse-relative-movement trace confirming capture;
- mouse button/wheel feedback reacting to input;
- touch markers/trails following actually observed contacts;
- a key lighting up on press;
- a frame-skipping test pattern advancing with browser timing.

Bad:

- floating background particles;
- pulsing cards for decoration;
- continuously animated hero graphics;
- unnecessary page transitions.

### Recency encoding

A trail may fade with age.

This is useful because opacity then means:

```text
brighter = more recent
fainter = older
```

The fade is information, not decoration.

Visual interpolation is allowed only for rendering continuity. It must never manufacture measurement state, such as Touch coverage cells that the browser did not actually report.

## Tool layout model

On desktop-relevant pages, the main tool should usually have one dominant visualization plus one compact result/control region.

Typical model:

```text
┌──────────────────────────────────────────────┐
│ instruction / status                        │
│                                              │
│  PRIMARY VISUALIZATION      KEY RESULT       │
│                             144 FPS          │
│                             6.9 ms           │
│                                              │
│  compact secondary action/details           │
└──────────────────────────────────────────────┘
```

The visualization may occupy most of the card.

Do not break the card into many metric tiles.

Touch Screen Test is a mobile/tablet-oriented exception: preserve enough active surface for finger sweeps even when that requires more vertical area than the desktop card model.

## Viewport budget

At `1366×768`, desktop-relevant tools should fit:

```text
compact header
H1
one-line intro
tool card with primary result/status
```

The primary tool should normally stay roughly within a 440–520px vertical budget.

If a desktop-relevant visualization needs more space, remove secondary content before increasing page height.

At mobile widths, especially Touch Screen Test, optimize the diagnostic surface and time-to-result rather than forcing this desktop budget.

Responsive layout should not mechanically stack every desktop tile into a long single column when a compact 2-column grouping remains readable. Preserve the primary action/result near the task and keep secondary visualization/content below it when appropriate.

## Visualization primitives

Prefer native SVG / Canvas / DOM/CSS.

Do not add a charting library for these small purpose-built visuals.

Shared primitives may include:

```text
SignalTrail
CrosshairPlot
RadialPlot
ReferenceLine
MovementGuide
LiveDot
MetricReadout
StatusBadge
```

Expansion 1 additionally established narrowly scoped shared primitives such as a generic mouse visual, touch surface, fullscreen color stage, and frame-skipping renderer under `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

These are not a generic dashboard component library. Keep them small and purpose-specific.

---

# Full-v1 per-tool visual design

## 1. Gamepad Tester

### Visual

A generic controller SVG is the main interaction surface.

Show:

- face buttons;
- D-pad;
- shoulder/trigger state where possible;
- left/right stick positions.

### Functional behavior

Pressed buttons visibly activate.

Analog sticks move inside small circular wells.

Triggers can fill proportionally.

### Why it is useful

The user can diagnose the physical controller by looking at the same approximate physical layout.

### Do not add

- raw axis table in the main view;
- scrolling event log;
- controller-brand imitation;
- separate metric cards for every input.

---

## 2. Stick Drift Test

### Visual

Use a two-dimensional center plot for each stick.

The plot contains:

```text
center crosshair
current stick dot
short fading trail
subtle reference rings
```

### Meaning

The current dot shows instantaneous stick position.

The trail shows where the stick has wandered during the recent measurement window.

This makes persistent offset or jitter visible before the user reads the number.

### Result

Beside or below the plot:

```text
Observed center offset
3.8%
```

### Important

The trail should be short and decay.

Do not build a permanent heat map or complex analytics view.

---

## 3. Controller Deadzone Test

### Visual

Reuse the radial stick plot.

Add one meaningful ring representing the suggested / selected deadzone.

```text
center
deadzone ring
current stick position
```

### Meaning

The user can see whether observed center noise stays inside the proposed deadzone.

### Result

```text
Center noise: 2.7%
Suggested starting deadzone: ~4%
```

### Interaction boundary

No deadzone slider or simulator is required in the current product.

The ring visualizes the documented heuristic result; it is not an advanced configuration control.

---

## 4. Mouse DPI Test

### Visual

Use a compact horizontal relative-movement guide rather than a physical-distance progress bar.

Example concept:

```text
                 current
start ──────────────●──────────────→
```

It confirms that horizontal movement is being captured.

Do **not** label the live marker as `6.4 cm` or claim it is progressing toward `10 cm`: the physical distance is supplied by the user and cannot be inferred before DPI is calculated.

Instruction provides the physical target:

```text
Move your mouse horizontally exactly 10 cm, then click once to finish.
```

### Result

```text
Estimated DPI
1590
```

### Why it is useful

The visualization supports the physical task itself rather than only decorating the result.

### Do not add

- run history chart;
- calibration dashboard;
- multiple advanced modes without evidence.

---

## 5. FPS Test

### Visual

Use a compact live time trace over the recent 5–10 seconds.

Concept:

```text
144 FPS

────────╮      ╭──────────●
        ╰──────╯
      recent time →
```

The latest point is visually emphasized.

The trail stays compact and mostly monochrome, with the current/live portion using the signal accent.

### Meaning

The user sees:

- current level;
- stability;
- drops;
- short stalls.

### Result

Large:

```text
Observed FPS
144
```

Small:

```text
Median frame time 6.9 ms
```

Do not add a categorical stability label without an explicitly approved measurement definition; the trace itself provides recent context.

### Do not add

- five metric cards;
- separate variance card;
- full chart legend;
- zoom controls;
- export without evidence.

---

## 6. Refresh Rate Test

### Visual

Use a calm frame-cadence trace or frame-interval strip.

Preferred direction:

```text
recent frame interval
───────────────●────────────
```

The visual should communicate whether timing is stable while the tool converges on an estimate.

This page should be quieter than FPS Test.

### Result

```text
Estimated refresh rate
143.9 Hz

Closest common mode
144 Hz
```

### Distinction from FPS

FPS Test emphasizes short-term browser rendering cadence and drops.

Refresh Rate Test emphasizes stable cadence and the inferred display mode.

Do not make the two pages visually identical even though they reuse the same sampler.

---

## 7. Keyboard Tester

### Visual

The keyboard itself is the visualization.

Pressed keys light up immediately.

The most recently pressed key may retain a very short, subtle after-state if it helps the user identify it.

### Result

Compact:

```text
Last key: Space
Pressed now: 2
```

`code` and `key` may be shown as compact secondary information.

### Do not add

- keypress timeline;
- event log;
- chart;
- animated background.

---

# Expansion 1 visual additions

Exact per-route behavior remains in `20`; this section defines the shared visual direction learned from the completed implementation.

## Mouse diagnostics

Use one generic functional mouse visual where physical mapping helps the job. Button zones react to held/detected states; wheel feedback is small and directional. Focused pages may reuse the visual but should not all become identical dashboards.

Polling Rate prioritizes one large observed-rate result plus source/caveat; no live high-frequency chart is required.

## Touch Screen Test

The active surface itself is the visualization:

```text
subtle fixed grid
observed covered cells
live touch markers
short bounded trails
compact Active / Maximum / Coverage metrics
```

Pass-1 covered cells can become visually quiet during confirmation, while missed cells remain neutral/emphasized. Do not use alarming red `dead zone` styling for unobserved cells.

Out-of-surface pointer-capture samples and visual interpolation must not paint measurement coverage.

## Dead Pixel / Backlight Bleed

Use the shared fullscreen/large-stage primitive. The diagnostic stage is intentionally visually plain: exact solid color for Dead Pixel, pure black for Backlight. Any overlay is compact and may auto-hide; no decorative chrome belongs on the inspection surface.

## Frame Skipping

Use Canvas with the documented sequential pattern. The primary textual state distinguishes waiting/unstable from `READY — take the photo now.` The pattern supports camera evidence; it is not an automatic monitor-health graph.

---

# Homepage visual direction

The homepage should remain calmer than tool pages but must scale with the catalog.

The current 18-tool catalog should be grouped by device/job cluster rather than presented as one undifferentiated vertical feed:

```text
Controller
Mouse
Keyboard
Display
Touch
```

Use compact category/tool rows or cards with:

- simple line icon or tiny functional glyph;
- tool name;
- one-line job description.

Desktop should use the available shell width efficiently without becoming a dashboard. Mobile should preserve clear category landmarks so users do not have to scan 18 consecutive undifferentiated cards.

Do not autoplay mini diagnostic animations across the homepage.

The rich visuals belong inside the tools themselves.

## Retention through useful continuation

After a task/result, show one small related-tool section containing only implemented, genuinely adjacent routes.

This is a better retention mechanism than adding decorative content before the result.

---

# Visual hierarchy

Typical hierarchy:

```text
1. live visualization / primary result
2. instruction / status
3. primary action
4. one or two supporting values
5. secondary details
6. below-fold explanation
```

Route state may change the ordering. In particular, when a result is generated after an action, responsive layouts should keep that result near the action instead of forcing the user past a large secondary visualization to find it.

Do not let H1, navigation, or SEO copy visually overpower the tool.

# Accessibility

Functional beauty must remain accessible.

- live traces need numeric equivalents;
- active states cannot rely only on color;
- SVG controls need semantic labels where relevant;
- motion must remain legible with reduced-motion preference;
- reduced motion should remove decorative interpolation, not real diagnostic state;
- Touch coverage/live contacts need textual metrics/status;
- fullscreen visual-inspection tools need clear pre-entry instructions and an obvious exit/fallback path;
- responsive visual reordering must preserve a logical DOM/focus experience.

# Performance

Target visuals should be lightweight.

- use SVG for controller/radial geometry and generic mouse visuals where appropriate;
- use DOM/CSS for keyboard, controls, and simple state surfaces;
- use Canvas for FPS/refresh traces and Frame Skipping pattern;
- use DOM/SVG for touch overlays only with bounded nodes/state;
- cap histories/trails/sample-driven visuals;
- do not retain unbounded arrays;
- avoid third-party chart libraries;
- clean up animation loops/listeners;
- do not create DOM nodes per high-frequency polling sample.

# Final design test

For every visual ask:

```text
If I remove this visual, does the user lose information or task clarity?
```

If the answer is no, remove it.
