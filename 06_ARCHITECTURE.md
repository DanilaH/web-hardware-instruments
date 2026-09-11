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

Expansion V2 deterministic display-pattern tools use the shared Display Pattern Engine defined by `23_HARDWARE_EXPANSION_V2_SPEC.md`. Monitor Test, Screen Uniformity Test, and OLED Burn-In Test are production consumers. The engine owns pattern order/state, manual navigation, rendered pattern composition, overlay visibility, and integration with the existing Fullscreen helper. It does not own SEO copy, measurement claims, or hardware acquisition.

Screen Resolution Checker does **not** use `FrameSampler` or the Display Pattern Engine. It uses a small tool-local screen-info helper that reads standard browser screen/viewport values and computes only the documented `Math.round(css * devicePixelRatio)` estimate. The helper is not a hardware acquisition service and does not request Multi-Screen Window Placement permission.

Do not overload `FrameSampler` with deterministic visual-pattern ownership or screen-information reporting, and do not create a second fullscreen framework for V2 display-pattern tools.

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

### Camera

Webcam Test uses the V2 `CameraService` as its single media-acquisition boundary.

```text
ToolPage
  ↓
WebcamTest.astro / webcam-controller.ts
  ↓
CameraService
  ↓
navigator.mediaDevices
```

`CameraService` owns:

- `getUserMedia` feature detection and video-only acquisition;
- optional video-device enumeration after permission;
- selected-device switching;
- active stream/track ownership;
- browser-reported track settings;
- normalized acquisition errors and stream-ended handling;
- stopping/releasing every active track on stop/destroy/replacement.

The tool controller owns presentation state, `<video>` attachment, localized status/errors, device-select UI and formatting of track settings. It never requests microphone audio, records/captures media, uploads frames, or introduces a backend.

A failed switch must not destroy a still-valid existing stream. A successful switch replaces the prior stream and stops its tracks cleanly.

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

Expansion 1 permits a small shared progressive-enhancement Fullscreen helper for Touch, Dead Pixel, and Backlight Bleed. Monitor Test, Screen Uniformity Test, and OLED Burn-In Test reuse the same helper through shared display-inspection infrastructure.

It owns feature detection/request/exit/state observation/cleanup only. It is not a hardware acquisition service and every tool needs an in-page fallback.

### Localization / V2 content composition

The original six locale files remain the strict source for the pre-V2 catalog. Expansion V2 jobs use **tool-local exhaustive locale bundles** where appropriate to avoid repeatedly rewriting six very large files, provided all of these rules hold:

```text
one approved ToolId
+ all six locale entries
+ one shared implementation
+ composition through src/i18n/content/index.ts
= one resolved getSiteContent(locale) contract
```

This is not a second locale-availability system and does not allow fallback content. A modular V2 ToolId enters the type unions only in the same atomic wave that registers its real tool implementation. `getSiteContent(locale)` remains the single resolved content API consumed by pages/homepage/navigation.

Tool-local runtime strings may likewise use one exhaustive `Record<Locale, ...>` module when the tool has self-contained controls. Existing global runtime-message contracts remain unchanged unless the shared runtime architecture itself needs to change.

Webcam additionally composes the camera privacy statements into all six resolved Privacy pages in the same atomic wave as the route; camera privacy text must not exist as a false product claim before camera acquisition is actually shipped.

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

Cleanup includes relevant event listeners, rAF loops, timers, pointer lock, fullscreen observers/state, temporary print DOM/styles, media tracks, resize/orientation listeners, and subscriptions.

Camera pagehide/navigation must stop the active stream. A bfcache restore does not silently reacquire camera access; the user can explicitly start it again.

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

Acquisition services should not absorb presentation state merely to make them reusable.

## Rendering

Use native, purpose-specific rendering:

```text
DOM/CSS → controls, text, result readouts, keyboard, simple state surfaces,
          deterministic display patterns/gradients/grids, webcam preview shell
SVG     → controller, stick plots, deadzone geometry, mouse/touch visuals, printable vector references
Canvas  → FPS/refresh traces and Frame Skipping pattern
video   → permissioned Webcam media stream preview
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
camera video frames
```

remain local by default.

Printer reference markup is generated locally and no document/printer telemetry is uploaded. Monitor Test, Screen Uniformity Test, and OLED Burn-In Test render deterministic local patterns and acquire no panel telemetry. Screen Resolution Checker reads only browser-exposed screen/viewport values and requests no screen-enumeration permission. Webcam video remains attached locally to the page's `<video>` element; Hardware Inspect does not record, upload or persist it.

Analytics may record only coarse product events such as:

```text
tool_started
tool_completed
unsupported_browser
```

Do not send raw key presses, pointer/touch streams, frame samples, camera frames, document contents, or device identifiers.

## Error handling

Browser feature failures must be represented as user-readable states.

Do not throw uncaught exceptions or expose raw exception stacks for unsupported/denied/unreadable media APIs.

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

A tool that only renders a local reference or reads passive standard browser properties does not need a fake capability service merely for architectural symmetry.

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
CameraService
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
- subscriptions/callbacks required for acquisition lifecycle;
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

- acquisition starts only from the owning tool's explicit lifecycle/action;
- `stop()` stops/releases native acquisition while keeping the instance reusable where the service contract allows it;
- `destroy()` is idempotent, stops acquisition, removes remaining listeners/subscribers/callback ownership, and makes the instance unusable;
- only one active listener/loop/stream set exists per service instance/capability on a page.

For `CameraService`, successful switching acquires the replacement before releasing the previous valid stream; stop/destroy/replacement stop every track they own.

Because Astro navigation is page-based, a fresh service instance per tool-page load is expected. No cross-page singleton is required.

## Styling boundary

Use plain CSS, CSS custom properties, and Astro-scoped styles.

Do not add Tailwind, CSS-in-JS runtime, or component/UI library.

Camera and Printer use the neutral taxonomy channel by default rather than creating new bright channel colors; semantic live/error state may use restrained success/error colors inside the tool.

## Runtime dependency boundary

Production UI must not require React, Vue, Svelte, a chart library, state library, or general-purpose event library.

Small build/dev dependencies are allowed when they directly support Astro, sitemap generation, type checking, or tests.
