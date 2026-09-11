# Technical Architecture

## Architectural goal

A static site with isolated interactive browser modules.

```text
Astro page / static HTML
        ↓
tool controller / UI binder
       ↙ ↘
pure math   browser capability service
                ↓
          native browser API
```

Not every tool needs a hardware capability service. Pure rendered-output tools such as Printer Test Page stay tool-local and use the narrow browser primitive they actually need.

## Recommended project shape

Full-v1 shape:

```text
src/
├── browser/
│   ├── gamepad-service.ts
│   ├── frame-sampler.ts
│   ├── keyboard-input-service.ts
│   └── mouse-movement-service.ts
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── seo/
│   └── tool-shell/
├── tools/
│   ├── gamepad/
│   │   ├── tester/
│   │   ├── drift/
│   │   └── deadzone/
│   ├── mouse/
│   │   └── dpi/
│   ├── display/
│   │   ├── fps/
│   │   └── refresh-rate/
│   └── keyboard/
│       └── tester/
├── visuals/
├── lib/
├── pages/
├── styles/
└── types/
```

Later approved expansions add only concrete folders/boundaries required by their owning specs. Do not pre-create empty layers merely to match a future tree.

Keep the shape shallow.

## Dependency direction

Correct dependency shape:

```text
page
 ↓
tool controller / UI binder
 ├──→ pure calculation/config helpers
 ├──→ browser capability service when the job needs acquisition
 └──→ visualization / rendered reference
```

Pure calculation/config helpers must not import browser services, DOM, SVG, or Canvas code.

Browser capability services must not import tool-specific calculations or renderers.

Renderers consume already-prepared view data and must not acquire hardware data themselves.

When native snapshots/events need tool semantics, adapt them at the tool boundary before pure calculations or renderers consume them.

## Shared infrastructure

### Gamepad

One shared `GamepadService` powers:

- Gamepad Tester
- Stick Drift Test
- Deadzone Test

Do not create independent Gamepad polling implementations.

### Display

One shared `FrameSampler` powers:

- FPS Test
- Refresh Rate Test
- Expansion 1 Frame Skipping Test

`FrameSampler` owns native rAF acquisition and display visibility lifecycle. Tool controllers own their own warmup/window/calculation/trace/pattern semantics.

Exact full-v1 reset behavior remains in `18_DECISIONS_AND_BOUNDARIES.md`; exact Frame Skipping semantics are in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

Expansion V2 deterministic display-pattern tools use the shared Display Pattern Engine defined by `23_HARDWARE_EXPANSION_V2_SPEC.md`. Monitor Test and Screen Uniformity Test are production consumers; OLED Burn-In reuses the same primitive when its own atomic wave ships. The engine owns pattern order/state, manual navigation, rendered pattern composition, overlay visibility, and integration with the existing Fullscreen helper. It does not own SEO copy, measurement claims, or hardware acquisition.

Do not overload `FrameSampler` with deterministic visual-pattern ownership and do not create a second fullscreen framework for V2 display-pattern tools.

### Keyboard

`KeyboardInputService` owns key event acquisition and clear signals. Tool controllers own held-code sets, maxima, expected-combination comparison, and DOM highlighting.

It is reused by:

- Keyboard Tester
- Keyboard Rollover Test
- Keyboard Ghosting Test

Do not create a second keyboard acquisition implementation.

### Mouse

Full-v1 Mouse DPI keeps its specialized `MouseMovementService` for Pointer Lock/raw-unadjusted/regular/unlocked movement capture.

Expansion 1 ordinary mouse diagnostics use the separately approved `MouseInputService` for:

- button down/up;
- wheel events;
- ordinary pointer movement;
- explicit high-frequency polling profile.

Do **not** generalize `MouseMovementService` into all mouse behavior and do not make `MouseInputService` own DPI Pointer Lock capture.

`MouseInputService` emits acquisition events/clear signals; tool controllers own held-button state, counters, direction strips, rapid-repeat interpretation, and polling calculations.

### Touch

Expansion 1 adds `TouchInputService`, specialized for finger-touch Pointer Events and lifecycle/clear semantics used by Touch Screen Test.

Mouse/pen input must not be normalized as touch.

### Printer

Printer Test Page has **no printer capability service**.

Its dependency shape is intentionally narrow:

```text
ToolPage
  ↓
PrinterTest.astro
  ├── printer-pattern.ts     pure paper/profile configuration
  └── printer-controller.ts  local UI state + temporary print DOM/style + window.print()
```

The printable reference is authored with local HTML/SVG foreground content. The controller may invoke browser print UI but must not detect printers, read telemetry, use WebUSB/WebHID, upload documents, or infer cartridge/nozzle state.

Temporary print-only DOM/style is lifecycle state and must be removed after print/cancel and on destroy.

### Fullscreen

Expansion 1 permits a small shared progressive-enhancement Fullscreen helper for Touch, Dead Pixel, and Backlight Bleed. Monitor Test, Screen Uniformity Test, and later V2 display-pattern routes reuse the same helper through shared display-inspection infrastructure.

It owns feature detection/request/exit/state observation/cleanup only. It is not a hardware acquisition service and every tool needs an in-page fallback.

### Localization / V2 content composition

The original six locale files remain the strict source for the pre-V2 catalog. Expansion V2 jobs may use **tool-local exhaustive locale bundles** to avoid repeatedly rewriting six very large files, provided all of these rules hold:

```text
one approved ToolId
+ all six locale entries
+ one shared implementation
+ composition through src/i18n/content/index.ts
= one resolved getSiteContent(locale) contract
```

This is not a second locale-availability system and does not allow fallback content. A modular V2 ToolId enters the type unions only in the same atomic wave that registers its real tool implementation. `getSiteContent(locale)` remains the single resolved content API consumed by pages/homepage/navigation.

Tool-local runtime strings may likewise use one exhaustive `Record<Locale, ...>` module when the new tool has self-contained controls. Existing global runtime-message contracts remain unchanged unless the shared runtime architecture itself needs to change.

### Analytics

Use one event wrapper if analytics are enabled.

### Tool lifecycle

Every interactive module should expose explicit cleanup.

Example:

```ts
interface ToolController {
  destroy(): void;
}
```

Cleanup includes relevant event listeners, rAF loops, timers, pointer lock, fullscreen observers/state, temporary print DOM/styles, media tracks, and subscriptions.

## TypeScript

Use strict TypeScript.

Recommended:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

Avoid `any` in tool logic.

## State

Do not introduce a global state library.

Per-tool local state is enough.

Acquisition services should not absorb presentation state merely to make it reusable.

## Rendering

Use native, purpose-specific rendering:

```text
DOM/CSS → controls, text, result readouts, keyboard, simple state surfaces,
          deterministic display patterns/gradients/grids
SVG     → controller, stick plots, deadzone geometry, mouse/touch visuals, printable vector references
Canvas  → FPS/refresh traces and Frame Skipping pattern
```

Do not add a charting library.

For Canvas, scale the backing store for `devicePixelRatio` so visuals stay crisp; rendering scale must never be mixed into measurement calculations.

Printable diagnostic references should prefer HTML/SVG foreground/vector primitives for essential information so browser “background graphics” settings are not the sole carrier of the test content.

## Build output

Static output. No SSR requirement.

## Privacy architecture

Raw measurements such as:

```text
gamepad axis samples
pressed keys
mouse movement/button/wheel streams
touch contact streams
frame timing series
```

remain local by default.

Printer reference markup is generated locally and no document/printer telemetry is uploaded. Monitor Test and Screen Uniformity Test render deterministic local patterns and acquire no panel telemetry.

Analytics may record only coarse product events such as:

```text
tool_started
tool_completed
unsupported_browser
```

Do not send raw key presses, pointer/touch streams, frame samples, document contents, or device identifiers.

## Error handling

Browser feature failures must be represented as user-readable states.

Do not throw uncaught exceptions for unsupported APIs.

## Feature detection

Always detect capability before use.

Do not rely on UA sniffing as the primary capability decision.

# Browser Capability Service Layer

## Rule

Native browser APIs remain the source of truth for acquisition jobs, but tool UI consumes them through small typed capability boundaries.

```text
Page / Tool UI
      ↓
tool-specific calculations/state
      ↓
thin browser capability service
      ↓
native browser API
```

A tool that only renders a local reference and invokes a standard UI primitive does not need a fake capability service merely for architectural symmetry.

## Approved capability services

### Full-v1

```text
GamepadService
FrameSampler
KeyboardInputService
MouseMovementService
```

These remain stable.

### Expansion 1 additions

```text
MouseInputService
TouchInputService
```

### Expansion V2

```text
CameraService   only when Webcam ships
```

Printer Test Page explicitly has no PrinterService. The Fullscreen helper, Display Pattern Engine, and screen-info helper are separate from this acquisition-service list.

Exact Expansion 1 responsibilities/profiles/events are defined in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`. Exact V2 capability boundaries are defined in `23_HARDWARE_EXPANSION_V2_SPEC.md`.

## Responsibilities

A capability service may contain:

- feature detection;
- native API/event registration;
- polling;
- normalization;
- typed snapshots/samples/events;
- subscriptions;
- lifecycle/cleanup;
- directly relevant browser quirks.

It must not contain:

- page layout;
- SEO copy;
- visual rendering;
- analytics;
- unrelated tool calculations;
- global application state;
- tool presentation state such as held-button sets or counters.

## Interface style

Keep interfaces deliberately small.

Do not add methods for hypothetical future needs.

## Why this layer exists

It prevents:

- duplicated loops/listeners;
- inconsistent normalization;
- UI coupled to browser quirks;
- cleanup leaks;
- separate tools measuring the same capability differently.

This is a small correctness boundary, not an architecture project.

## Capability service lifecycle

For approved acquisition services:

- `subscribe()` never implicitly starts acquisition;
- the owning tool controller explicitly starts acquisition when appropriate;
- `stop()` stops polling/listeners but keeps the instance reusable;
- `destroy()` is idempotent, stops acquisition, removes remaining listeners/subscribers, and makes the instance unusable;
- only one active listener/loop set exists per service instance/capability on a page.

Because Astro navigation is page-based, a fresh service instance per tool-page load is expected. No cross-page singleton is required.

## Styling boundary

Use plain CSS, CSS custom properties, and Astro-scoped styles.

Do not add Tailwind, CSS-in-JS runtime, or component/UI library.

## Runtime dependency boundary

Production UI must not require React, Vue, Svelte, a chart library, state library, or general-purpose event library.

Small build/dev dependencies are allowed when they directly support Astro, sitemap generation, type checking, or tests.
