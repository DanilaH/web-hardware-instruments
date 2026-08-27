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
│   ├── controller/
│   ├── radial-plot/
│   └── traces/
├── lib/
│   ├── math/
│   └── analytics/
├── pages/
├── styles/
│   ├── tokens.css
│   └── global.css
└── types/
```

Keep the shape shallow. Do not create empty architectural layers just to match this tree.

## Dependency direction

The previous `core → browser adapter` direction is explicitly forbidden.

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

## Shared infrastructure

### Gamepad

One shared gamepad state/polling layer should power:

- Gamepad Tester
- Stick Drift Test
- Deadzone Test

Do not create three independent `requestAnimationFrame` polling implementations.

### Display

One shared frame sampler should power:

- FPS Test
- Refresh Rate Test
- future Frame Skipping Test

`FrameSampler` owns the native rAF acquisition loop and display visibility lifecycle. It emits normalized timing events plus an explicit reset semantic when the current timing session becomes invalid.

Tool controllers consume those events and own their own warmup/window/calculation/trace state. FPS and Refresh Rate must not add independent `visibilitychange` listeners to implement duplicate measurement-reset behavior.

The exact reset contract is defined in `18_DECISIONS_AND_BOUNDARIES.md`.

### Analytics

Use one event wrapper.

### Tool lifecycle

Every interactive module should expose explicit cleanup.

Example:

```ts
interface ToolController {
  destroy(): void;
}
```

Cleanup:

- event listeners
- requestAnimationFrame loops
- timers
- pointer lock state if applicable

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

## Rendering

Use these MVP boundaries:

```text
DOM/CSS      → controls, text, result readouts, keyboard grid
SVG          → controller, stick plots, deadzone geometry, mouse relative-movement guide
Canvas       → FPS and refresh-rate time traces
```

Do not add a charting library.

For Canvas, scale the backing store for `devicePixelRatio` so traces stay crisp; this affects rendering only and must never be mixed into measurement calculations.

## Build output

Prefer static output.

No SSR requirement for MVP.

## Privacy architecture

Raw measurements such as:

```text
gamepad axis samples
pressed keys
mouse movement
frame timing series
```

must remain local by default.

Analytics should record only coarse product events such as:

```text
tool_started
tool_completed
unsupported_browser
```

Do not send raw key presses or device sample streams.

## Error handling

Browser feature failures must be represented as user-readable states.

Do not throw uncaught exceptions for unsupported APIs.

## Feature detection

Always detect capability before use.

Do not rely only on user-agent sniffing.

# Browser Capability Service Layer

## Rule

Native browser APIs remain the source of truth, but tool UI should consume them through a small typed capability service/adapter.

Architecture:

```text
Page / Tool UI
      ↓
tool-specific calculations/state
      ↓
thin browser capability service
      ↓
native browser API
```

## Required capability services

### `GamepadService`

Owns:

```text
navigator.getGamepads()
gamepad polling
connection/disconnection state
normalization
cleanup
```

Used by:

```text
Gamepad Tester
Stick Drift Test
Deadzone Test
```

These tools must not each start an independent Gamepad polling loop.

### `FrameSampler`

Owns:

```text
requestAnimationFrame()
rAF callback timestamps
start/stop
visibility handling
sample/reset subscription
cleanup
```

Used by:

```text
FPS Test
Refresh Rate Test
Frame Skipping Test later
```

FPS and Refresh Rate share acquisition/lifecycle semantics but apply different interpretation/presentation.

### `KeyboardInputService`

Owns:

```text
keydown
keyup
pressed-key state acquisition
blur / visibility cleanup
subscription
```

Used by Keyboard Tester and future keyboard diagnostics.

### `MouseMovementService`

Owns:

```text
pointer/mouse movement acquisition
movement deltas
raw Pointer Lock request plus documented Pointer Lock/unlocked fallbacks
start/stop
cleanup
```

Used by Mouse DPI and future mouse diagnostics.

## Responsibilities

A capability service may contain:

- feature detection;
- native API/event registration;
- polling;
- normalization;
- typed snapshots/samples;
- subscriptions;
- lifecycle/cleanup;
- directly relevant browser quirks.

It must not contain:

- page layout;
- SEO copy;
- visual rendering;
- analytics;
- unrelated tool calculations;
- global application state.

## Interface style

Keep interfaces deliberately small.

Example:

```ts
type Unsubscribe = () => void;

interface GamepadService {
  isSupported(): boolean;
  start(): void;
  stop(): void;
  getSnapshot(): GamepadSnapshot[];
  subscribe(listener: (snapshot: GamepadSnapshot[]) => void): Unsubscribe;
  destroy(): void;
}
```

FrameSampler should expose one typed subscription stream with sample/reset semantics. Exact syntax may differ; `18_DECISIONS_AND_BOUNDARIES.md` owns the behavior.

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

For all four capability services:

- `subscribe()` never implicitly starts acquisition;
- the owning tool controller calls `start()` on mount;
- `stop()` stops polling/listeners but keeps the instance reusable;
- `destroy()` is idempotent, calls `stop()`, removes all remaining listeners/subscribers, and makes the instance unusable;
- only one active acquisition loop/listener set exists per capability on a page.

Because Astro navigation is page-based in MVP, a fresh service instance per tool-page load is expected. No cross-page singleton is required.

## Styling boundary

Use plain CSS, CSS custom properties, and Astro-scoped styles where convenient.

Do not add Tailwind, a CSS-in-JS runtime, or a component/UI library in MVP.

## Runtime dependency boundary

The production UI must not require React, Vue, Svelte, a chart library, a state library, or a general-purpose event library.

Small build/dev dependencies are allowed when they directly support Astro, sitemap generation, type checking, or tests.
