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

Expansion 1 may add only the concrete folders/boundaries required by `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`; do not pre-create empty layers merely to match a future tree.

Keep the shape shallow.

## Dependency direction

Correct dependency shape:

```text
page
 ↓
tool controller / UI binder
 ├──→ pure calculation helpers
 ├──→ browser capability service
 └──→ visualization renderer
```

Pure calculation helpers must not import browser services, DOM, SVG, or Canvas code.

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

### Fullscreen

Expansion 1 permits a small shared progressive-enhancement Fullscreen helper for Touch, Dead Pixel, and Backlight Bleed.

It owns feature detection/request/exit/state observation/cleanup only. It is not a hardware acquisition service and every tool needs an in-page fallback.

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

Cleanup includes relevant event listeners, rAF loops, timers, pointer lock, fullscreen observers/state, and subscriptions.

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
DOM/CSS → controls, text, result readouts, keyboard, simple state surfaces
SVG     → controller, stick plots, deadzone geometry, mouse/touch visuals where useful
Canvas  → FPS/refresh traces and Frame Skipping pattern
```

Do not add a charting library.

For Canvas, scale the backing store for `devicePixelRatio` so visuals stay crisp; rendering scale must never be mixed into measurement calculations.

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

Analytics may record only coarse product events such as:

```text
tool_started
tool_completed
unsupported_browser
```

Do not send raw key presses, pointer/touch streams, frame samples, or device identifiers.

## Error handling

Browser feature failures must be represented as user-readable states.

Do not throw uncaught exceptions for unsupported APIs.

## Feature detection

Always detect capability before use.

Do not rely on UA sniffing as the primary capability decision.

# Browser Capability Service Layer

## Rule

Native browser APIs remain the source of truth, but tool UI consumes them through small typed capability boundaries.

```text
Page / Tool UI
      ↓
tool-specific calculations/state
      ↓
thin browser capability service
      ↓
native browser API
```

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

The Fullscreen helper is separate from this acquisition-service list.

Exact Expansion 1 responsibilities/profiles/events are defined in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

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
