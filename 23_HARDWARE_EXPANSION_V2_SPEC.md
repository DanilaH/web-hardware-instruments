# HardwareInspect — Hardware Expansion V2 Product & Technical Specification

**Status:** approved implementation contract  
**Date:** 2026-09-10  
**Repository:** `DanilaH/web-hardware-instruments`  
**Production origin:** `https://hardwareinspect.com`  
**Research:** HardwareInspect Expansion V2  
**Research ID:** `20260910123657992_60df693e-4cc9-4c0b-b108-739214f99f44`  
**Discovery run:** `20260910160232265_0097e1d2-a61d-4ab2-a55a-390a1fe525e6`  
**Enrichment ID:** `20260910162926364_035b90b5-8a9c-4712-8880-be83ccd9685d`

This document is the normalized repository source of truth for Hardware Expansion V2. It incorporates the owner-approved `HARDWAREINSPECT_EXPANSION_V2_IMPLEMENTATION_HANDOFF_2026-09-10.md` and resolves the implementation ambiguities found during independent pre-implementation review.

It supersedes chat discussion and raw research decision labels for this wave. It does not retroactively change completed Full-v1 or Expansion 1 diagnostic behavior.

---

# 0. Source-of-truth integration and precedence

Use the repository contracts together:

```text
19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md
  durable business/product strategy, expansion rule, release boundary

18_DECISIONS_AND_BOUNDARIES.md
  shared/global + Full-v1 exact algorithms, lifecycle and browser behavior

23_HARDWARE_EXPANSION_V2_SPEC.md
  exact Expansion V2 scope, route behavior, new capability boundaries,
  V2 SEO/copy patches, sequencing and route-specific QA

20_POST_V1_HARDWARE_EXPANSION_SPEC.md
  exact Expansion 1 behavior for already implemented routes

22_LOCALIZATION_SPEC.md
  locale registry, localized routing/content/runtime-message architecture,
  canonical/hreflang behavior and localization QA
```

Rules:

- `23` may add new V2 routes and capability boundaries only where explicitly stated here.
- `23` does not weaken global privacy, lifecycle, dependency-direction, accessibility or measurement-honesty rules from `18`/`19`.
- `22` owns how an approved tool is localized; it does not decide whether a new diagnostic job exists.
- If a genuinely shared rule conflicts across these documents, stop and fix the documentation before product code proceeds.
- Existing “current catalog = 18” lists in supporting/current-state documents remain factually correct until a V2 route is actually merged. Update those lists atomically with implemented routes rather than pre-advertising placeholders.

Do not reopen the SEO thesis, invent extra routes, broaden scope into generic benchmark/gaming utilities, or redesign completed tools for aesthetic consistency.

---

# 1. Executive decision

Expansion V2 adds exactly six production routes:

```text
/printer-test-page
/monitor-test
/screen-uniformity-test
/oled-burn-in-test
/screen-resolution-checker
/webcam-test
```

Final implementation order:

```text
0. Foundation / content-source cleanup / existing SEO patch / IA preparation
1. Printer Test Page
2. Shared Display Pattern Engine + Monitor Test
3. Screen Uniformity Test
4. OLED Burn-In Test
5. Screen Resolution Checker
6. Webcam Test
7. Reassess WATCH items only after shipping + first-party evidence
```

The Display order above intentionally groups the three shared pattern-engine consumers before the independent Screen Resolution tool. This resolves the older handoff mismatch where one summary placed Resolution before OLED while the release section grouped OLED with the shared Display foundation.

### Existing-page SEO/copy patch

Keep URLs stable while applying the approved wording updates to:

```text
/gamepad-tester
/controller-stick-drift-test
/mouse-polling-rate-test
/mouse-dpi-test
/keyboard-rollover-test
/keyboard-tester        minor only
/dead-pixel-test        mostly leave intact
/touch-screen-test      mostly leave intact
```

### WATCH — not production commitments

```text
controller vibration test
GPU browser test / stress test
monitor ghosting test
```

### Do not create standalone routes

```text
/color-printer-test-page
/monitor-color-test
/screen-color-test
/dirty-screen-effect-test
/what-is-my-screen-resolution
/display-test
/screen-test
/color-banding-test
/midi-tester
/mouse-drag-test
/keyboard-chatter-test
```

Those phrases are either sub-intents, synonyms, low-priority jobs or measurement-heavy jobs outside the current honesty/effort threshold.

---

# 2. Evidence interpretation

The combined discovery research contains 193 direct root keywords. The human shortlist used 26 representative queries and produced 14 enrichment clusters.

Treat the evidence carefully:

- Keyword Surfer figures are US-volume evidence.
- Google was configured `hl=en`, `gl=us`, but observations reported physical location Chelyabinsk Oblast, Russia; use that SERP primarily as competition/intent evidence rather than a perfect US-localized snapshot.
- Historical presence is bounded sampled Common Crawl evidence, not exact first-ever-seen date.
- Do not turn `not_found` into proof that a domain did not exist.
- Do not sum close synonyms into a traffic forecast.

Examples:

```text
webcam test / webcam tester / computer camera test
  = one dense user-intent family, not additive traffic

printer test page / print test page / test print page
  = one cluster with a measured 22.2k head class, not 66.6k traffic
```

The finalized Runner archive had five decision-label mismatches. For implementation, this document owns the corrected decisions:

```text
OLED / gray uniformity      BUILD
Printer test page           BUILD
GPU tester                  WATCH
Color printer test page     BUILD-AS-FEATURE in /printer-test-page
Monitor ghosting            WATCH
```

---

# 3. Product opportunity roles

```text
/printer-test-page
  acquisition_anchor

/monitor-test
  acquisition_anchor

/webcam-test
  acquisition_anchor

/screen-uniformity-test
  strong_supporting_tool

/screen-resolution-checker
  strong_supporting_tool

/oled-burn-in-test
  strong_supporting_tool
```

Effort-adjusted rationale:

- Printer is the strongest easy new opportunity: dense 22.2k head class, weak/young entrants, very low implementation burden.
- Monitor Test fills the broad Display entry-point gap while absorbing screen/display/color-test wording.
- Uniformity has useful OLED/gray/DSE demand with weak specialized entrants and very low production burden once the shared pattern engine exists.
- Resolution is a cheap instant-answer browser-information tool.
- OLED Burn-In is a separate inspection job that reuses the same controlled-pattern foundation.
- Webcam has by far the largest demand class but a strong established SERP, so it is a long-run acquisition bet rather than an easy ranking claim.

---

# 4. Fixed architecture and atomic registration rule

Current stack remains:

```text
Astro static output
TypeScript strict + noUncheckedIndexedAccess
plain CSS / CSS custom properties / Astro-scoped styles
native browser APIs
SVG / Canvas / DOM
Vitest
Node 24
pnpm 11
```

No React/Vue/Svelte, Tailwind, UI framework, backend, database, auth, generic hardware abstraction, WebHID/WebUSB experiment, heavy runtime i18n framework or speculative dependency.

## 4.1 Tool channels

`ToolChannel` may be prepared to support:

```text
controller
mouse
keyboard
display
touch
camera
printer
```

Planned assignments:

```text
printer-test-page           -> printer
webcam-test                 -> camera
monitor-test                -> display
screen-uniformity-test      -> display
oled-burn-in-test           -> display
screen-resolution-checker   -> display
```

### Atomic ToolId registration — binding clarification

Do **not** register all six new `ToolId`s during Foundation merely because the type system can represent them.

A new V2 `ToolId` enters the central registry only in the same coherent implementation block that also provides:

```text
real tool component/controller
EN content
pt-BR content
de content
fr content
es content
ru content
ToolPage mapping
route generation
related-tool decision
SEO metadata
applicable tests
```

This prevents placeholder pages, incomplete locale matrices, exhaustive-map breakage and temporary English fallbacks.

Camera/Printer channel types and icon capability may be prepared during Foundation, but empty channels must not appear in homepage/navigation until a real tool in that channel is registered.

## 4.2 English content: one source of truth

Current localized routes use the shared `ToolPage` + `src/i18n/content/{locale}.ts` path, while English root tool pages still duplicate presentation copy.

Foundation must remove that duplication narrowly:

```text
English root semantic URL
    -> shared ToolPage
    -> en content object
    -> same tool component/controller as localized routes
```

Keep English URLs unchanged. Do not redesign controllers while centralizing page content.

## 4.3 Typed ToolPage map

`ToolPage.astro` remains the exhaustive map from stable `ToolId` to tool component. A missing registered `ToolId` should remain a compile-time problem where practical.

## 4.4 Homepage: data driven, no premature exposure

Remove assumptions that there are exactly five channels:

- no hard-coded `repeat(5, ...)` category rail;
- no fixed-index hero label array;
- no fixed `groups.slice(0, 2)` / `groups.slice(2)` split.

Generate categories from implemented group data. When the full wave is live, the catalog has seven taxonomy groups and 24 tools:

```text
Controller
Mouse
Keyboard
Display
Touch
Camera
Printer
```

Desktop at 1366×768 must remain compact. A two-column group distribution should balance approximately 4/3 once all seven groups exist. Mobile must not compress seven labels into unreadable columns.

Update the browser-boundary concept so Printer is represented honestly as rendered output rather than observed hardware input:

```text
Controller · Pointer · Keyboard · Display · Touch · Camera · Print
        ↓
Browser APIs · local events · rendered test patterns
        ↓
Observed · estimated · visual inspection
No raw diagnostic input upload
```

Do not imply printer telemetry.

## 4.5 Related tools: explicit and capped

Replace implicit all-sibling/fallback behavior with an explicit typed relation graph or equally explicit capped curated selection.

Durable IA rule remains binding:

```text
normally 2 related tools
maximum 3 when genuinely useful
```

This resolves the raw handoff example that listed five Monitor Test relations and a seven-link focused-path block. Do not turn Display pages into a link directory merely because the channel grows to nine tools.

Approved V2 examples:

```text
monitor-test
  -> dead-pixel-test
  -> screen-uniformity-test
  -> refresh-rate-test

screen-uniformity-test
  -> monitor-test
  -> backlight-bleed-test
  -> oled-burn-in-test

oled-burn-in-test
  -> screen-uniformity-test
  -> dead-pixel-test
  -> monitor-test

screen-resolution-checker
  -> monitor-test
  -> refresh-rate-test
  -> fps-test

dead-pixel-test
  -> monitor-test
  -> screen-uniformity-test
  -> backlight-bleed-test

webcam-test
  -> empty relation set is valid

printer-test-page
  -> empty relation set is valid
```

`RelatedTools` must render nothing cleanly for an empty relation set. Do not force unrelated cross-device links.

## 4.6 Visual channel rule

Camera and Printer are new **taxonomy channels**, but this wave does not automatically authorize two more bright chromatic families.

The existing five restrained Controller/Mouse/Keyboard/Display/Touch channel colors remain stable. Camera and Printer should use the neutral instrument/chassis treatment plus functional state colors where needed unless a later explicit visual review approves a restrained extension of the channel palette.

Do not turn seven homepage groups into a seven-color rainbow.

---

# 5. Shared technical primitives

Do not build a generic `HardwareService`.

## 5.1 Shared Display Pattern Engine

Used by:

```text
/monitor-test
/screen-uniformity-test
/oled-burn-in-test
```

Responsibilities:

```text
pattern definition
active pattern state
manual previous/next
optional bounded auto-advance only where approved for Monitor Test
fullscreen enter/exit via existing helper
keyboard controls
touch/click controls
hide/show control overlay
cleanup
```

Suggested pattern model:

```ts
type DisplayPattern =
  | { kind: 'solid'; label: string; value: string }
  | { kind: 'gradient'; label: string; css: string }
  | { kind: 'bars'; label: string; /* deterministic definition */ }
  | { kind: 'grid'; label: string; /* deterministic definition */ };
```

Keep rendering deterministic/local. SEO wording does not belong in the engine.

## 5.2 Screen-info helper

For `/screen-resolution-checker` and optional Monitor Test summary:

```ts
interface BrowserScreenInfo {
  screenWidthCss: number;
  screenHeightCss: number;
  availWidthCss: number;
  availHeightCss: number;
  viewportWidthCss: number;
  viewportHeightCss: number;
  devicePixelRatio: number;
  estimatedDevicePixelWidth: number;
  estimatedDevicePixelHeight: number;
  colorDepth?: number;
  orientation?: string;
}
```

Binding terminology:

```text
Browser-reported screen size
Estimated device-pixel dimensions
Browser viewport
Device pixel ratio
```

Never call `screen.width * devicePixelRatio` native/physical panel resolution.

## 5.3 CameraService

Expansion V2 approves one focused new acquisition boundary, e.g. `src/browser/camera-service.ts`.

Responsibilities:

```text
feature detection
permissioned getUserMedia video acquisition
device enumeration after permission when labels are available
selected video-device switching
stream lifecycle
track settings
stop/release
error normalization
```

Do not include audio.

Lifecycle may be:

```text
create
start(deviceId?)
listVideoDevices
switchDevice
getSettings
stop
destroy
```

`stop()` and `destroy()` must stop every active media track. A switch must stop/replace the prior stream cleanly.

## 5.4 Printer has no hardware service

Printer Test Page is a generated printable reference:

```text
tool controller
print-pattern component
print CSS
window.print()
```

No printer detection, no cartridge state, no telemetry, no WebUSB/WebHID.

---

# 6. Route contract — `/printer-test-page`

## User job

> Print a controlled reference page and visually inspect obvious print-quality problems.

## Primary experience

Above the fold:

```text
Printer Test Page
short explanation
paper size: A4 / Letter
test profile: Full / Color / Grayscale
[Print Test Page]
compact on-screen preview
```

Printed reference should contain practical diagnostic content:

- fine black text at multiple useful sizes;
- thin horizontal/vertical line and grid patterns;
- alignment/crosshair references;
- discrete grayscale patches + smooth grayscale ramp;
- red/green/blue/cyan/magenta/yellow/black/neutral-gray patches;
- useful color gradients for visible transition/banding inspection;
- page-edge/safe-area references that do not require borderless printing.

Prefer print-safe SVG/HTML foreground graphics. Essential diagnostic elements must not depend exclusively on CSS background printing.

Support A4 and Letter. Tell users to use `100% / Actual Size` when checking physical spacing/alignment.

Browser print preview is sufficient for P0; no PDF generator.

## Honesty boundary

A browser/OS/driver/printer pipeline may transform colors. Do not claim raw CMYK separations, exact nozzle isolation, color-accuracy certification, cartridge state or automatic root-cause diagnosis.

Use wording such as:

> Use the printed pattern to look for missing color, visible banding, blurred text, uneven density or alignment problems.

## EN metadata

```text
Title: Printer Test Page — Print a Color & Grayscale Test Online
H1: Printer Test Page
Meta: Print a free printer test page with color patches, grayscale, fine lines, alignment marks and text to visually check print quality.
```

## Acceptance

- print preview has no site header/footer/navigation;
- A4 and Letter portrait layouts avoid accidental clipping;
- essential test elements do not rely on “Print background graphics”;
- screen preview remains compact;
- cancelling print leaves UI usable;
- no printer-health pass/fail;
- no exact CMYK/nozzle-isolation claim;
- no user-content upload.

---

# 7. Route contract — `/monitor-test`

## User job

> Run one quick guided visual screen test for common obvious display problems.

This is the broad Display entry point; it does not replace focused pages.

## P0 pattern sequence

```text
White
Black
Red
Green
Blue
50% Gray
5–10% Gray
Grayscale gradient
Color gradient
Black-level pattern
White-level pattern
Sharpness/grid pattern
```

Keep the set modest; do not create a 40-pattern calibration suite.

Primary action: `Start Monitor Test`.

Fullscreen is progressive enhancement. Always keep a large in-page fallback.

Controls:

```text
Click/tap/Space/Right Arrow -> next
Left Arrow                  -> previous
Esc                         -> exit
```

Pattern instruction/label may appear temporarily but must be hideable so it does not contaminate inspection.

The test may help users visually inspect dead/stuck-pixel-like points, tint anomalies, brightness/uniformity differences, leakage/clouding, visible banding, basic black/white-level separation and obvious sharpness/geometry issues.

Do not claim color accuracy, physical response time, contrast ratio, panel pass/fail or hardware health.

Use the capped RelatedTools set from section 4.5. Additional Display diagnostics remain discoverable from homepage/catalog; do not render a seven-link “everything Display” block.

## EN metadata

```text
Title: Monitor Test — Test Your Screen & Display Online
H1: Monitor Test
Meta: Run a guided fullscreen monitor test with solid colors, gray fields, gradients and basic display patterns to visually inspect common screen issues.
```

Natural body vocabulary may include `screen test`, `display test`, `monitor color test`, `screen color test` without creating those URLs.

## Acceptance

- active pattern renders without scrolling inside the stage;
- fullscreen and in-page fallback work;
- touch/click/keyboard navigation works;
- no automatic pass/fail;
- related continuation is capped and relevant;
- static inspection patterns are not contaminated by accidental animation;
- no unsafe calibration/hardware-measurement claims.

---

# 8. Route contract — `/screen-uniformity-test`

## User job

> Use flat gray fields to visually inspect uneven brightness, tint, banding, mura or dirty-screen-effect-like patches.

Recommended presets:

```text
5% Gray
10% Gray
25% Gray
50% Gray
75% Gray
100% White
```

A 1–100% slider is optional only if it stays simpler than presets. Pattern switching is manual; no long unattended loop.

This is pure visual inspection. Users may look for darker/lighter patches, tint variation, vertical bands, mura/clouding and DSE.

The browser does not measure luminance uniformity without external hardware. Do not display uniformity percentage, panel-variance score, pass/fail or color delta.

Conservative instructions:

```text
use normal viewing brightness
reduce distracting reflections
inspect from normal viewing position first
compare several gray levels
confirm whether the issue is visible in real content
```

Do not universally instruct maximum brightness.

## EN metadata

```text
Title: Screen Uniformity Test — Check Gray Uniformity & DSE
H1: Screen Uniformity Test
Meta: Use fullscreen gray fields to visually inspect screen uniformity, dirty screen effect, banding, tint and uneven brightness on OLED or LCD displays.
```

## Acceptance

- deterministic gray values;
- fullscreen + in-page fallback;
- controls can be hidden;
- no score/pass-fail;
- DSE wording appears naturally;
- no guarantee that visible variation is a defect.

---

# 9. Route contract — `/oled-burn-in-test`

## User job

> Use controlled solid colors and gray fields to make persistent image-retention/burn-in-like patterns easier to see.

Recommended short sequence:

```text
Red
Green
Blue
White
50% Gray
25% Gray
75% Gray
Black optional supporting field
```

This is an inspection tool, not a repair tool.

Do not add flashing pixel-fixer sequences, long high-brightness loops, “repair burn-in” mode, burn-in percentage or countdowns encouraging hours of static display.

The page must distinguish possible permanent OLED burn-in, temporary image retention, panel non-uniformity and tint/mura. A browser pattern cannot prove which is present.

Recommended meaning:

> Persistent shapes visible across several neutral or solid fields may be worth investigating. This visual test cannot determine whether an artifact is permanent burn-in, temporary retention or another uniformity issue.

## EN metadata

```text
Title: OLED Burn-In Test — Check Screen Burn-In & Image Retention
H1: OLED Burn-In Test
Meta: Use fullscreen solid colors and gray fields to visually check for persistent image shapes, screen burn-in and image retention on OLED displays.
```

## Acceptance

- no flashing or repair claim;
- no burn-in percentage;
- manual pattern navigation;
- fullscreen fallback;
- clear burn-in vs retention distinction;
- relevant links to Uniformity/Dead Pixel/Monitor within the max-3 rule.

---

# 10. Route contract — `/screen-resolution-checker`

## User job

> What screen size, viewport and estimated device-pixel dimensions does this browser report right now?

No Start button. Render immediately.

Primary:

```text
Browser-reported screen size
1920 × 1080 CSS px
```

Secondary values:

```text
Estimated device-pixel dimensions
Browser viewport
Available screen area
Device pixel ratio
Color depth
Orientation
```

Recompute on relevant resize/orientation changes. A manual Refresh action is optional.

Do not add Multi-Screen Window Placement API permission complexity in P0.

## Measurement honesty

`window.screen.width/height` are browser-reported CSS-pixel dimensions.

`screen.width * devicePixelRatio` is an **estimated device-pixel dimension**, not guaranteed native physical panel resolution. Browser zoom, OS scaling, browser behavior and privacy protections can affect values.

Never write “your native monitor resolution is definitely ...”.

## EN metadata

```text
Title: Screen Resolution Checker — What Is My Screen Resolution?
H1: Screen Resolution Checker
Meta: See the screen size, browser viewport, device pixel ratio and estimated device-pixel dimensions reported by your browser.
```

## Acceptance

- primary result appears immediately;
- viewport updates on resize;
- orientation changes update applicable values;
- estimate is explicitly labeled;
- no exact native-panel claim;
- no permission required.

---

# 11. Route contract — `/webcam-test`

## User job

> Confirm that a webcam can be opened in the browser and see the video currently delivered by it.

Initial state:

```text
Webcam Test
Your camera stays on this device.
[Start Camera]
```

Only the explicit Start action may trigger permission.

Use:

```ts
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: false,
});
```

After permission:

```text
live preview
selected camera
browser/track-reported stream resolution
track-reported frameRate when available
aspect ratio
[Stop Camera]
```

After permission, enumerate video devices when supported and allow camera switching if multiple inputs are available.

If measured displayed frame rate is later added with `requestVideoFrameCallback`, label it separately as browser/video-frame observation. Do not mix it with track-reported `frameRate` under one ambiguous number. Measured FPS is optional in P0.

Normalize user-facing errors for at least:

```text
camera API unavailable
permission denied
no camera found
camera already in use / cannot be read
constraint/device-switch failure
stream ended
```

Do not show raw exception stacks.

### Privacy — binding

- no frame upload;
- no stream upload;
- no recording;
- no backend;
- no snapshot persistence;
- Stop stops all active tracks;
- destroy/navigation stops all active tracks;
- switching replaces/stops the prior stream;
- no microphone permission.

A screenshot/capture feature is omitted from P0.

## EN metadata

```text
Title: Webcam Test — Check Your Camera Online
H1: Webcam Test
Meta: Test your webcam directly in the browser with a live camera preview and browser-reported stream information. No recording or upload.
```

Natural supporting vocabulary: `webcam tester`, `camera test online`, `computer camera test`.

## Acceptance

- permission only after explicit action;
- audio permission never requested;
- denied permission produces actionable state;
- active tracks stop on Stop/navigation/destroy;
- device switching cleans up prior stream;
- no network request contains media frames;
- one-camera flow works if enumeration is limited;
- no camera-quality score.

---

# 12. Existing-page SEO/copy patch

These changes are presentation/SEO only. Existing diagnostic algorithms and caveats remain unchanged.

## `/gamepad-tester`

```text
H1: Gamepad Tester
Title: Gamepad Tester — Test Controllers & Joysticks Online
Meta: Test gamepad and controller buttons, analog sticks, D-pad and triggers directly in your browser. Works as a quick controller and joystick input checker.
```

Natural intro may mention gamepad/controller/joystick. Do not imply every controller is supported; standard/non-standard mapping caveats remain.

## `/controller-stick-drift-test`

Front-load the stronger generic head:

```text
H1: Stick Drift Test
Title: Stick Drift Test — Check Controller Analog Stick Drift
Meta: Test controller stick drift in your browser by measuring the observed center offset of both analog sticks while untouched.
```

Measurement logic is unchanged.

## `/mouse-polling-rate-test`

```text
Title: Mouse Polling Rate Test — Check Mouse Hz Online
```

Keep browser-observed pointer-sample-rate caveat; do not imply direct USB reports.

## `/mouse-dpi-test`

Keep H1 `Mouse DPI Test`. Add `DPI analyzer` only as secondary natural vocabulary, e.g.:

> This mouse DPI analyzer estimates DPI from browser-observed movement over a physical distance you provide.

Keep `Estimated DPI` terminology.

## `/keyboard-rollover-test`

```text
H1: Keyboard Rollover Test
Title: Keyboard Rollover Test — NKRO & Simultaneous Key Check
```

Add natural section wording such as `NKRO testing and browser limitations`. Never claim NKRO certification.

## `/keyboard-tester`

Keep existing dominant Keyboard Tester title/H1 stable. Add `keyboard checker` naturally in intro/explanation only.

## `/dead-pixel-test`

Mostly leave intact. Existing dead/stuck-pixel coverage already owns the synonym family. No new synonym page.

## `/touch-screen-test`

Do not split into multi-touch, ghost-touch or dead-zone pages. Existing broad route already covers those browser-observable sub-jobs.

---

# 13. Localization and content completeness

Implemented locales remain:

```text
en
pt-BR
de
fr
es
ru
```

English remains unprefixed. Localized routes keep the English semantic slug:

```text
/webcam-test
/de/webcam-test
/es/webcam-test
/ru/webcam-test
```

No localized slugs in this wave.

Every registered V2 ToolId must have complete content for all six locales before it enters route generation. No per-tool English placeholder fallback.

Preferred primary local vocabulary:

| Tool | pt-BR | de | fr | es | ru |
|---|---|---|---|---|---|
| Webcam | Teste de Webcam | Webcam-Test | Test de webcam | Prueba de Webcam | Проверка веб-камеры онлайн |
| Printer | Página de teste da impressora | Drucker-Testseite | Page de test imprimante | Página de prueba de impresora | Тестовая страница принтера |
| Monitor | Teste de Monitor | Monitor-Test / Bildschirmtest | Test d'écran | Prueba de Monitor / Test de Pantalla | Тест монитора |
| Resolution | Resolução da Tela | Bildschirmauflösung prüfen | Résolution de l'écran | Resolución de Pantalla | Разрешение экрана |
| Uniformity | Teste de uniformidade da tela | Test der Bildschirmgleichmäßigkeit / Grauuniformität | Test d'uniformité de l'écran | Prueba de uniformidad de pantalla | Тест равномерности экрана |
| Burn-In | Teste de burn-in OLED | OLED-Burn-in-Test | Test de burn-in OLED | Prueba de burn-in OLED | Тест на выгорание OLED |

Do not mechanically translate established technical terms when local usage keeps a loanword/hybrid.

### Privacy content timing — binding clarification

Do **not** update public privacy copy in Foundation to describe a camera feature that is not shipped yet.

Update all locale privacy pages in the Webcam implementation block, atomically with `/webcam-test`, preserving this meaning:

```text
Controller, keyboard, mouse, touch, frame-timing and camera data are processed locally.
Camera video is not uploaded, recorded or stored by Hardware Inspect.
```

Printer copy should state that the page generates a reference and does not inspect printer telemetry or upload documents.

---

# 14. SEO implementation requirements

For every new route:

```text
H1 + concise intro
actual tool immediately
useful explanatory content below
limitations / measurement boundary
RelatedTools only when semantically useful
```

Avoid SEO sludge before the tool.

Use the existing centralized canonical/hreflang pipeline. Do not hand-code conflicting tags in components.

Every registered route must generate:

- one EN root URL;
- five localized counterparts;
- self canonical;
- reciprocal `en`, `pt-BR`, `de`, `fr`, `es`, `ru` hreflang;
- `x-default` to EN where current architecture emits it;
- sitemap entry for every indexable alternate.

Do not create synonym-route aliases merely to target phrases.

Canonical intent ownership:

```text
/printer-test-page
  printer test page / print test page / test print page / color printer test page

/monitor-test
  monitor test / screen test / display test / monitor color test / screen color test

/screen-uniformity-test
  gray/OLED uniformity / DSE

/screen-resolution-checker
  checker + what-is-my-screen-resolution intent

/oled-burn-in-test
  OLED burn-in test / screen burn test

/webcam-test
  webcam test / webcam tester / computer camera test
```

Structured data is optional. Do not delay shipping for it and do not invent ratings, reviews, usage counts or offers.

---

# 15. Measurement-honesty contract

Allowed language families:

```text
Observed
Browser-reported
Estimated
Visual inspection
May indicate
Worth investigating
Not detected in this browser test
```

Avoid:

```text
Certified
Guaranteed
Healthy hardware
Broken hardware
Exact native panel resolution
Exact USB polling rate
Exact printer color accuracy
Exact camera quality
Burn-in percentage
Automatic repair
```

Specific boundaries:

```text
Printer
  controlled printable reference; no printer telemetry

Monitor / Uniformity / Burn-In
  visual inspection only; no physical luminance/colorimeter measurement

Resolution
  browser-reported CSS screen size + estimated device-pixel dimensions

Webcam
  permissioned browser media stream + track/browser observations
```

---

# 16. Testing strategy

Automated minimum after review:

```bash
pnpm typecheck
pnpm test
pnpm build
```

Add pure tests where applicable for:

- screen-info calculation/rounding;
- display-pattern ordering/definitions;
- camera error normalization;
- print-profile state logic.

Do not mock a printer into a fake physical-output verdict or mock display defects into proof of panel behavior.

Manual browser targets:

```text
Desktop: Chrome, Edge, Firefox; Safari where available
Mobile: iOS Safari, Android Chrome for responsive/fullscreen/camera behavior
```

### Printer manual QA

- Chrome and Firefox print preview;
- A4 + Letter;
- portrait layout;
- 100% / Actual Size guidance;
- essential vector/color elements survive without relying on background graphics;
- site chrome hidden from print.

### Webcam manual QA

- allow;
- deny;
- previously denied;
- no camera;
- two cameras if available;
- switch;
- stop;
- navigate away while streaming;
- another app holding camera if reproducible;
- inspect network once to confirm no media upload.

### Display pattern QA

- in-page stage;
- fullscreen;
- fullscreen rejection/unavailable fallback;
- keyboard navigation;
- touch navigation;
- Esc;
- high-DPI screen;
- mobile orientation;
- controls hide/restore.

Headless/mocked checks may prove state, rendering and cleanup logic. They are not proof of real printer output, real camera hardware or physical panel defects.

---

# 17. Release sequencing — atomic waves

Each wave is a coherent production-valid block. Follow the repository review-before-validation workflow for every block.

## Wave 0 — Foundation + existing SEO patch

Do:

1. unify English page content through the shared ToolPage/content source;
2. prepare `camera` / `printer` channel types and icon capability only;
3. replace implicit related sibling/fallback behavior with a typed capped relation graph for the **currently implemented** catalog;
4. make homepage category generation and column distribution data-driven using implemented groups only;
5. apply approved existing-page SEO/copy upgrades;
6. keep all current controllers/measurements unchanged.

Do **not**:

- register any unfinished V2 ToolId;
- expose empty Camera/Printer categories;
- publish camera privacy copy before Webcam exists.

## Wave 1 — Printer

Atomically add:

```text
printer-test-page ToolId
Printer component/controller
all six locale content entries
Printer homepage group
SEO/canonical/hreflang/sitemap
print QA
```

## Wave 2 — Display pattern foundation + Monitor

Build the shared Display Pattern Engine, then atomically register `/monitor-test` with all locale/SEO/QA requirements.

## Wave 3 — Screen Uniformity

Reuse the same engine; atomically register `/screen-uniformity-test` with all locales and QA.

## Wave 4 — OLED Burn-In

Reuse the same engine; atomically register `/oled-burn-in-test` with all locales and safety/inspection QA.

## Wave 5 — Screen Resolution

Add the screen-info helper and atomically register `/screen-resolution-checker` with all locales and measurement-honesty tests.

## Wave 6 — Webcam

Add CameraService and atomically register `/webcam-test` with all locales, camera-specific privacy copy and permission/lifecycle QA.

---

# 18. Search Console operating plan after release

Do not immediately start another broad keyword-research wave.

After shipping, use first-party evidence:

- sitemap discovery/indexing;
- page-level impressions/clicks;
- actual query vocabulary;
- absorbed sub-intent impressions;
- cannibalization/canonical anomalies.

Watch query groups:

```text
Printer:     printer test page / print test page / color printer test page
Monitor:     monitor test / screen test / display test / monitor color test
Uniformity:  screen uniformity / oled uniformity / gray/grey uniformity / DSE
Resolution:  screen resolution checker / what is my screen resolution / monitor resolution
Burn-in:     oled burn in test / screen burn test / image retention test
Webcam:      webcam test / webcam tester / camera test online / computer camera test
```

Do not split a route because of one or two impressions. Require a clearly independent repeated intent plus a real SERP/user-job boundary.

---

# 19. Definition of Done for Expansion V2

Expansion V2 is complete only when all applicable gates pass.

### Product

- six approved routes exist and work;
- no rejected synonym routes exist;
- existing tools are not functionally regressed;
- all measurement/inspection language remains honest.

### Architecture

- routes use central tool definitions;
- Camera/Printer channels are typed;
- EN presentation has one content source with localized architecture;
- homepage no longer assumes exactly five channels;
- only implemented channels are exposed;
- related selection is explicit and max 3;
- CameraService lifecycle is cleaned up;
- Display pattern logic is shared where appropriate.

### SEO

- titles/H1/meta match this contract or a reviewed equivalent;
- canonicals/hreflang are correct;
- sitemap contains all approved generated pages and no synonym zoo;
- existing Gamepad/Stick Drift/NKRO/DPI/Mouse Hz wording upgrades are applied.

### Localization

- each registered new tool has complete `en`, `pt-BR`, `de`, `fr`, `es`, `ru` content;
- no locale falls back to English placeholder text;
- local primary wording follows the approved vocabulary/meaning.

### Privacy

- camera video is not uploaded/recorded/stored;
- Printer uploads nothing and does not claim telemetry;
- privacy page reflects Camera only when Webcam ships;
- no backend/account flow.

### Quality

- source review #1 complete;
- visual/UX review complete;
- final-diff review #2 complete;
- `pnpm typecheck` passes;
- `pnpm test` passes;
- `pnpm build` passes including SEO output guard;
- applicable Printer/Display/Webcam manual QA is recorded honestly;
- 1366×768 desktop UX and applicable mobile layouts remain usable.

---

# 20. Anti-goals

Do not:

```text
add GPU in this wave
add controller vibration
add monitor ghosting
add MIDI
add audio tools
add CPS / reaction-time games
add generic CPU/RAM/system benchmark pages
add WebHID/WebUSB “just because”
add backend analytics storage
add accounts
add persistent/shareable diagnostic histories
add AI hardware diagnosis
add automatic warranty verdicts
add burn-in repair/flashing
add fake hardware scores
add localized slugs
add a UI framework
redesign all existing tools
pre-register placeholder ToolIds
expose empty homepage categories
```

If an implementation detail appears to require an anti-goal, stop that detail and preserve the approved scope.

---

# 21. Final product thesis

HardwareInspect should remain:

```text
focused device diagnostics
+ browser-observable signals
+ controlled visual/output test patterns
+ explicit measurement boundaries
+ no install
+ no account
+ local-first behavior
```

V2 strengthens this shape without turning the site into a generic “all computer tools” directory.

After the wave ships, stop broad expansion research and use GSC/first-party evidence to choose the next move. GPU is the most credible larger WATCH experiment only if real evidence justifies another development wave.