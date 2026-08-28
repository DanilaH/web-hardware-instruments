# Functional Visual System

## Design decision

The product should feel like a purpose-built browser diagnostic instrument, not a generic utility directory, SaaS dashboard, gaming surface, developer console, or AI-generated technology landing page.

The approved direction is:

```text
instrument minimalism + authored identity
=
light instrument chassis
+ dark diagnostic surfaces only where they have functional meaning
+ restrained hardware-channel color coding
+ domain-specific browser/input geometry
+ strong measurement typography
+ motion tied to state, signal, or recency
```

Visual personality is a product requirement. If two solutions are equally functional and lightweight, prefer the one that gives Hardware Tests a more distinctive and high-quality identity.

Distinctiveness must come from the product domain rather than generic decorative novelty.

Good sources of identity:

- hardware input channels;
- browser/API boundaries;
- measurement geometry;
- actual signal/state changes;
- device-specific spatial relationships;
- clear local-processing/privacy cues.

Bad sources of identity:

- generic dark-tech atmosphere;
- gradient washes;
- glow for mood;
- fake measurements;
- fake instrument readouts;
- decorative grids that imply data which is not real;
- arbitrary numbered sections;
- excessive monospace/uppercase microcopy;
- generic SaaS card chrome;
- visual motifs that could be moved unchanged to an unrelated AI, crypto, or CRM landing page.

## Functional beauty rule

A visual element earns its place only if it does at least one of these:

1. helps the user perform the test;
2. makes the result easier to understand;
3. shows change over time;
4. exposes instability, drift, noise, position, coverage, or input state;
5. makes current state obvious;
6. explains a real product boundary, such as hardware input being observed through browser-native APIs on the current device;
7. creates product identity from a true hardware/browser concept without implying fake measurements.

If it does none of these, remove it.

Decorative visuals must never compete with diagnostic visuals.

## Authorship / anti-generic rule

The product should remain structurally familiar and easy to trust, but its visual signature should be specific to Hardware Tests.

Use this test:

```text
If the brand name were replaced with an unrelated product,
would this visual still make equal sense?
```

If yes, the visual is probably too generic.

Do not chase novelty by making navigation or controls unusual. Keep interaction patterns conventional; put individuality into typography, material treatment, hardware-channel coding, browser-boundary diagrams, and functional motion.

## Visual language

### Base palette and material model

The approved base is light-first and neutral:

- warm off-white / instrument-neutral page and chassis surfaces;
- near-black / graphite text;
- crisp neutral borders and separators;
- white or slightly warm working surfaces;
- dark graphite only for surfaces that intentionally read as a diagnostic display, measurement stage, or browser-boundary instrument screen.

The homepage establishes the material metaphor:

```text
light chassis
+
dark instrument display
```

Do not turn every tool card into a dark panel. Dark surfaces are meaningful exceptions, not a global theme.

### Hardware-channel colors

The product may use five restrained channel colors for the five current hardware families:

```text
Controller
Mouse
Keyboard
Display
Touch
```

The current approved direction uses muted, low-saturation channel tones rather than a single global cyan/blue accent.

The exact hue values may be tuned during implementation, but the semantic mapping should remain stable once shared across the product.

Channel color is appropriate for:

- small category signal ticks;
- category icons;
- active/focused state;
- short signal traces;
- live input markers where the hardware family is relevant;
- subtle hover/focus reinforcement;
- matching input-channel lines inside a browser-boundary diagram.

Channel color is **not** appropriate for:

- full card fills;
- large tinted backgrounds;
- coloring every line of copy;
- giving every one of the 18 tools its own unrelated color;
- replacing success/warning/error semantics.

The user should be able to notice the category system without needing hover, but the page must still read primarily as a neutral diagnostic instrument rather than a rainbow UI.

### Semantic colors

Success, warning, and error colors are allowed when they carry real meaning.

They are independent of hardware-channel colors.

Never rely on semantic colors without text or numeric labels.

Do not introduce success/error styling merely to imply hardware health when the tool only reports browser observation or visual inspection.

### Dark mode

Not required in current approved scope.

Do not design the whole product around a dark gaming aesthetic.

A system-following dark mode may be added later after the light system is stable and separately approved.

## Typography

Use a clean sans-serif for interface text.

The typography should feel deliberate and technical without becoming a generic startup/system-default look or a full-page monospace interface.

A production webfont may be introduced only if it materially improves identity/readability and has acceptable licensing, loading cost, fallback behavior, and maintenance cost. Self-hosting is preferred if a font is adopted.

Use tabular or monospaced numerals for actual measurements:

```text
144 FPS
143.9 Hz
3.8%
1600 DPI
972 Hz
```

Do not use monospace merely to make ordinary navigation or decorative labels look technical.

Measurement numbers can be visually large, but headings should remain compact and task-first.

## Geometry

Prefer:

- thin crisp lines;
- restrained borders;
- modest corner radius;
- straight structural divisions;
- simple circles, axes, tracks, crosshairs when the underlying test actually needs them;
- hardware/browser-boundary diagrams whose geometry explains the product.

Avoid:

- giant pill-shaped cards;
- repeated 12–20px rounded rectangles as the default visual grammar;
- glossy or decorative gradient washes;
- glass effects;
- 3D hardware renderings;
- large decorative blobs;
- nested-card soup;
- fake oscilloscope/calibration imagery with invented values;
- arbitrary blueprint grids used only to signal “technical”.

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
browser-boundary instrument screen guides
```

Judge the rendered purpose, not the CSS function name.

## Icons and brand mark

Use one coherent thin-line icon language for hardware/tool recognition.

Icons should normally appear directly on the surface rather than automatically inside rounded colored tiles.

A small local subset of lightweight SVG geometry is preferred over shipping a large runtime icon system when only a narrow set is needed. If a package is later adopted, it must remain tree-shakeable and must not add client-side runtime cost for static icons.

The brand mark should derive from the product model, not a generic tech symbol. The approved direction is based on input traces meeting a browser/local-observation boundary rather than a generic target/crosshair mark.

## Motion

Motion should represent data, state, recency, or a meaningful signal path.

Good:

- a current FPS point moving through time;
- a fading stick-position trail;
- a deadzone marker following the stick;
- a live mouse-relative-movement trace confirming capture;
- mouse button/wheel feedback reacting to input;
- touch markers/trails following actually observed contacts;
- a key lighting up on press;
- a frame-skipping test pattern advancing with browser timing;
- a short category-colored signal line reacting on hover/focus;
- a restrained homepage input-channel trace that visually terminates at the browser boundary.

Bad:

- floating background particles;
- pulsing cards for decoration;
- decorative hero motion unrelated to input/browser concepts;
- card lift/bounce as the main personality device;
- unnecessary page transitions;
- continuous glow or ambient animation.

Use CSS for small UI/state motion. Do not add an animation library for identity polish alone.

Respect `prefers-reduced-motion`.

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

The trail stays compact and mostly monochrome, with the current/live portion using the relevant signal treatment.

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

The homepage is the identity reference for the visual refresh.

It should feel like a real product surface rather than a plain directory, while staying compact enough that the catalog remains visible quickly.

Approved composition:

```text
compact branded header
light instrument-chassis hero
  ├─ H1 + concise explanation + human-readable trust facts
  └─ dark browser-boundary instrument screen
hardware category rail
catalog grouped by Controller / Mouse / Keyboard / Display / Touch
```

The hero must not contain fake measurement values or decorative oscilloscope/calibration readouts.

The dark instrument screen may explain the true product model:

```text
hardware input
→ browser-native APIs / browser boundary
→ observed on this device
```

Trust copy should use language an ordinary user can understand, for example:

```text
no install
no account
input stays on this device
```

Do not rely on unexplained phrases such as `raw input stays local` as the only privacy/trust statement.

The five category channels may use visible but restrained color coding in:

- category rail signal lines;
- category icons;
- section signal ticks;
- matching browser-boundary input traces;
- hover/focus signal motion.

Tool rows themselves should remain mostly neutral.

Desktop should use the available shell width efficiently without becoming a dashboard. Mobile should preserve clear category landmarks and show real tool content in the first viewport whenever practical.

Do not autoplay decorative mini diagnostic animations across the homepage. Any homepage motion must explain a signal path or state and must respect reduced-motion preferences.

The rich measurement visuals still belong inside the tools themselves.

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
- channel colors must never be the sole category/state indicator;
- SVG controls need semantic labels where relevant;
- motion must remain legible with reduced-motion preference;
- reduced motion should remove decorative interpolation, not real diagnostic state;
- Touch coverage/live contacts need textual metrics/status;
- fullscreen visual-inspection tools need clear pre-entry instructions and an obvious exit/fallback path;
- responsive visual reordering must preserve a logical DOM/focus experience.

# Performance

Target visuals should be lightweight.

- use SVG for controller/radial geometry and generic mouse visuals where appropriate;
- use DOM/CSS for keyboard, controls, simple state surfaces, category signals, and homepage browser-boundary diagrams;
- use Canvas for FPS/refresh traces and Frame Skipping pattern;
- use DOM/SVG for touch overlays only with bounded nodes/state;
- cap histories/trails/sample-driven visuals;
- do not retain unbounded arrays;
- avoid third-party chart or animation libraries;
- clean up animation loops/listeners;
- do not create DOM nodes per high-frequency polling sample;
- static iconography must not require client-side runtime JavaScript.

# Final design tests

For every visual ask:

```text
If I remove this visual, does the user lose information, task clarity,
or a product-specific identity cue grounded in a true hardware/browser concept?
```

If the answer is no, remove it.

Also ask:

```text
Could this exact visual be moved unchanged to an unrelated AI/CRM/crypto site?
```

If yes, make it more product-specific or remove it.
