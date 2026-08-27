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
4. exposes instability, drift, noise, or position;
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
- live trace.

Do not wash the entire interface in the accent.

### Semantic colors

Success, warning, and error colors are allowed when they carry meaning.

They are exceptions to the mostly monochrome system.

Never rely on them without text or numeric labels.

### Dark mode

Not required for MVP.

Do not design the whole product around a dark gaming aesthetic.

A system-following dark mode may be added later after the light system is stable.

## Typography

Use a clean sans-serif for interface text.

Use tabular or monospaced numerals for measurements:

```text
144 FPS
143.9 Hz
3.8%
1600 DPI
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
- glossy effects;
- gradients;
- glass;
- 3D hardware renderings;
- large decorative blobs.

## Motion

Motion should represent data or state.

Good:

- a current FPS point moving through time;
- a fading stick-position trail;
- a deadzone marker following the stick;
- a live mouse-relative-movement trace confirming capture;
- a key lighting up on press.

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

## Tool layout model

On desktop, the main tool should usually have one dominant visualization plus one compact result/control region.

Typical model:

```text
┌──────────────────────────────────────────────┐
│ instruction / status                        │
│                                              │
│  PRIMARY VISUALIZATION      KEY RESULT       │
│                             144 FPS          │
│                             6.9 ms            │
│                                              │
│  compact secondary action/details           │
└──────────────────────────────────────────────┘
```

The visualization may occupy most of the card.

Do not break the card into many metric tiles.

## Viewport budget

At 1366×768:

```text
compact header
H1
one-line intro
tool card
```

must fit.

The primary tool should normally stay roughly within a 440–520px vertical budget.

If a visualization needs more space, remove secondary content before increasing page height.

## Visualization primitives

Prefer native SVG / Canvas.

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

These are not a generic dashboard component library. Keep them small and purpose-specific.

---

# Per-tool visual design

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

Do not build a permanent heat map or complex analytics view in MVP.

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

No deadzone slider or simulator in MVP.

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
- multiple advanced modes.

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

Do not add a categorical stability label in MVP; the trace itself shows recent variance/drops.

### Do not add

- five metric cards;
- separate variance card;
- full chart legend;
- zoom controls;
- export.

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

FPS Test emphasizes short-term rendering performance and drops.

Refresh Rate Test emphasizes stable cadence and the inferred display mode.

Do not make the two pages visually identical even if they reuse the same sampler.

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

`code` and `key` may be shown in a small Details area.

### Do not add

- keypress timeline;
- event log;
- chart;
- animated background.

---

# Homepage visual direction

The homepage should remain much calmer than tool pages.

Use compact category/tool cards with:

- simple line icon or tiny functional glyph;
- tool name;
- one-line job description.

Do not autoplay mini diagnostic animations across the homepage.

The rich visuals belong inside the tools themselves.

## Retention through useful continuation

After a result, show one small related-tool section.

Example:

```text
Controller looks responsive.

Next:
Check stick drift
Check deadzone
```

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

Do not let H1, navigation, or SEO copy visually overpower the tool.

# Accessibility

Functional beauty must remain accessible.

- live traces need numeric equivalents;
- active states cannot rely only on color;
- SVG controls need semantic labels where relevant;
- motion must remain legible with reduced-motion preference;
- reduced motion should remove decorative interpolation, not real diagnostic state.

# Performance

Target visuals should be lightweight.

- use SVG for controller and radial/stick geometry;
- use DOM/CSS for the keyboard and ordinary controls;
- use Canvas for FPS and refresh-rate time traces;
- use DOM + simple SVG geometry for the mouse movement guide;
- cap history samples;
- do not retain unbounded arrays;
- avoid third-party chart libraries;
- clean up animation loops.

# Final design test

For every visual ask:

```text
If I remove this visual, does the user lose information or task clarity?
```

If the answer is no, remove it.
