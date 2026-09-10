# HardwareInspect — Hardware Expansion V2 Product & Technical Specification

**Status:** approved implementation contract  
**Date:** 2026-09-10  
**Repository:** `DanilaH/web-hardware-instruments`  
**Production origin:** `https://hardwareinspect.com`  
**Research ID:** `20260910123657992_60df693e-4cc9-4c0b-b108-739214f99f44`  
**Discovery run:** `20260910160232265_0097e1d2-a61d-4ab2-a55a-390a1fe525e6`  
**Enrichment ID:** `20260910162926364_035b90b5-8a9c-4712-8880-be83ccd9685d`

This is the normalized repository source of truth for Hardware Expansion V2. It incorporates the owner-approved implementation handoff and the independent pre-implementation review corrections.

It supersedes chat discussion and raw Runner decision labels for this wave. It does not retroactively change completed Full-v1 or Expansion 1 behavior.

---

# 0. Authority and precedence

Use these contracts together:

```text
19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md
  durable strategy / scope gate / release boundary

18_DECISIONS_AND_BOUNDARIES.md
  shared global + Full-v1 algorithms / lifecycle / browser rules

23_HARDWARE_EXPANSION_V2_SPEC.md
  exact V2 scope / route behavior / new capability boundaries /
  V2 SEO patches / sequencing / V2 QA

20_POST_V1_HARDWARE_EXPANSION_SPEC.md
  exact already-implemented Expansion 1 behavior

22_LOCALIZATION_SPEC.md
  locale/routing/content/runtime-message architecture /
  canonical/hreflang/localization QA
```

Rules:

- `23` may add only the V2 routes/capability boundaries explicitly approved here.
- `23` does not weaken global privacy, lifecycle, dependency-direction, accessibility or measurement-honesty rules from `18`/`19`.
- `22` owns how an approved job is localized; it does not authorize new jobs.
- Existing “current catalog = 18” lists remain true until a V2 route is actually merged. Update current-state catalog docs atomically with implemented routes; never advertise placeholders.
- If a genuinely shared rule conflicts, fix the documentation before product code proceeds.

Do not reopen the SEO thesis, invent extra routes, broaden into generic benchmark/gaming utilities, or redesign completed tools for aesthetic consistency.

---

# 1. Approved scope and order

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
0. Foundation / EN content-source cleanup / IA preparation / existing SEO patch
1. Printer Test Page
2. Shared Display Pattern Engine + Monitor Test
3. Screen Uniformity Test
4. OLED Burn-In Test
5. Screen Resolution Checker
6. Webcam Test
7. stop broad expansion; reassess WATCH only from first-party evidence
```

This intentionally groups the three Display Pattern Engine consumers before the independent Resolution tool.

### Existing-page SEO/copy patch

Keep URLs and diagnostic behavior stable while applying approved presentation wording to:

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

### No standalone routes

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

These are absorbed sub-intents/synonyms, low-priority jobs, or measurement-heavy directions outside this wave.

---

# 2. Evidence interpretation

The research used 193 direct root keywords, a 26-query human shortlist and 14 enrichment clusters.

Interpretation rules:

- Keyword Surfer figures are US-volume evidence.
- Google was configured `hl=en`, `gl=us`, but observed physical location was Chelyabinsk Oblast, Russia; use that SERP primarily as competition/intent evidence, not a perfect US-localized snapshot.
- Common Crawl presence is bounded sampled history, not exact first-ever-seen date.
- `not_found` is not proof of historical absence.
- Close synonyms are one intent family, not additive traffic.

Examples:

```text
webcam test / webcam tester / computer camera test
  = one intent family

printer test page / print test page / test print page
  = one 22.2k head class, not 66.6k traffic
```

Corrected product decisions override the mismatched persisted Runner labels:

```text
OLED / gray uniformity      BUILD
Printer test page           BUILD
GPU tester                  WATCH
Color printer test page     BUILD-AS-FEATURE in /printer-test-page
Monitor ghosting            WATCH
```

---

# 3. Product roles

```text
/printer-test-page            acquisition_anchor
/monitor-test                 acquisition_anchor
/webcam-test                  acquisition_anchor
/screen-uniformity-test       strong_supporting_tool
/screen-resolution-checker    strong_supporting_tool
/oled-burn-in-test             strong_supporting_tool
```

Printer is the strongest low-burden opportunity; Monitor fills the broad Display-entry gap; Uniformity/Burn-In reuse a cheap shared visual foundation; Resolution is an immediate browser-information tool; Webcam has very large demand but a strong established SERP and should be treated as a long-run acquisition bet.

---

# 4. Architecture and atomic registration

Keep:

```text
Astro static output
TypeScript strict + noUncheckedIndexedAccess
plain CSS / CSS variables / Astro-scoped styles
native browser APIs
SVG / Canvas / DOM
Vitest
Node 24
pnpm 11
```

No React/Vue/Svelte, Tailwind, UI framework, backend, database, auth, generic HardwareService, WebHID/WebUSB experiment, heavy runtime i18n framework or speculative dependency.

## 4.1 Tool channels

The type system may be prepared for:

```text
controller
mouse
keyboard
display
touch
camera
printer
```

Assignments:

```text
printer-test-page           -> printer
webcam-test                 -> camera
monitor-test                -> display
screen-uniformity-test      -> display
oled-burn-in-test           -> display
screen-resolution-checker   -> display
```

### Atomic ToolId rule

Foundation may add `camera` / `printer` **channel capability**, but must not pre-register unfinished V2 ToolIds.

A new V2 ToolId enters the central registry only in a coherent block that also supplies:

```text
real component/controller
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

This prevents placeholder routes, incomplete locale matrices and silent English fallback.

Empty Camera/Printer groups must not appear in homepage/navigation.

## 4.2 English presentation: one source

Current localized tools already use shared `ToolPage` + `src/i18n/content/{locale}.ts`, while EN root pages duplicate presentation content.

Foundation must narrowly converge EN onto the same content path:

```text
EN root semantic URL
  -> ToolPage
  -> en content
  -> shared tool component/controller
```

Keep EN URLs unchanged. Do not alter controller behavior while doing this refactor.

## 4.3 ToolPage map

`ToolPage.astro` remains the exhaustive stable `ToolId -> component` map. A registered ToolId missing a component should be a compile-time failure where practical.

## 4.4 Homepage

Remove exact-five assumptions:

- no hard-coded `repeat(5, ...)` rail;
- no positional fixed-index hero labels;
- no hard-coded `groups.slice(0, 2)` / `groups.slice(2)` split.

Generate from **implemented** group data. Keep 1366×768 compact; balance two desktop columns approximately 4/3 when all seven groups exist; do not compress seven mobile labels into unreadable columns.

Full-wave taxonomy:

```text
Controller
Mouse
Keyboard
Display
Touch
Camera
Printer
```

### Homepage browser-boundary timing

Foundation makes the hero/input model data-driven but does **not** advertise unimplemented capabilities.

Visible browser-boundary labels must reflect implemented groups only:

- existing five remain visible during Foundation;
- `Print` is added when Printer Test Page ships;
- `Camera` is added when Webcam Test ships.

When both are live, the conceptual full-state wording is:

```text
Controller · Pointer · Keyboard · Display · Touch · Camera · Print
        ↓
Browser APIs · local events · rendered test patterns
        ↓
Observed · estimated · visual inspection
No raw diagnostic input upload
```

Printer must read as rendered diagnostic output, not printer telemetry.

## 4.5 RelatedTools

Replace implicit all-sibling/fallback behavior with explicit typed relations or an equally explicit capped selection.

Binding durable rule:

```text
normally 2 related tools
maximum 3 when genuinely useful
```

This overrides the raw handoff examples that listed five Monitor relations/seven focused links.

Approved V2 graph:

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
  -> empty

printer-test-page
  -> empty
```

`RelatedTools` must render nothing cleanly for an empty set. No unrelated cross-links for singleton channels.

## 4.6 Visual taxonomy

Camera and Printer are taxonomy channels, not automatic permission for two new bright color families.

Keep the five existing restrained chromatic mappings for Controller/Mouse/Keyboard/Display/Touch. Camera/Printer use neutral instrument/chassis treatment plus real semantic state colors unless an explicit later visual review approves a restrained palette extension.

Do not create a seven-color rainbow.

---

# 5. Shared V2 primitives

## 5.1 Display Pattern Engine

Shared by:

```text
/monitor-test
/screen-uniformity-test
/oled-burn-in-test
```

Own only:

```text
pattern definitions/order
active pattern state
manual previous/next
fullscreen enter/exit via existing helper
active-stage keyboard navigation
touch/click navigation
hide/show overlay
cleanup
```

P0 is manual. Do not add unattended auto-advance merely because the engine could support it.

Suggested shape:

```ts
type DisplayPattern =
  | { kind: 'solid'; label: string; value: string }
  | { kind: 'gradient'; label: string; css: string }
  | { kind: 'bars'; label: string; /* deterministic definition */ }
  | { kind: 'grid'; label: string; /* deterministic definition */ };
```

SEO wording does not belong in the primitive.

### Encoded gray-reference rule

Percent gray presets are **encoded sRGB reference levels**, not physical luminance percentages.

For a gray preset `p` in `0..100`:

```ts
const channel = Math.round((255 * p) / 100);
const color = `rgb(${channel} ${channel} ${channel})`;
```

Therefore representative encoded values are:

```text
5%   -> 13  (#0D0D0D)
10%  -> 26  (#1A1A1A)
25%  -> 64  (#404040)
50%  -> 128 (#808080)
75%  -> 191 (#BFBFBF)
100% -> 255 (#FFFFFF)
```

UI/copy may say `5% Gray` as a reference-pattern label but must not imply measured 5% panel luminance.

### Keyboard handling

Only while the diagnostic stage is active, handled navigation keys may suppress their default page-scroll behavior where needed. Do not install global page-wide interception. Do not block ordinary form-control input. Escape remains browser/fullscreen exit behavior; observe fullscreen state rather than trying to trap Esc.

## 5.2 Screen-info helper

For Resolution Checker and optional compact Monitor summary:

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

Exact estimate:

```ts
estimatedDevicePixelWidth = Math.round(screenWidthCss * devicePixelRatio);
estimatedDevicePixelHeight = Math.round(screenHeightCss * devicePixelRatio);
```

Use terminology:

```text
Browser-reported screen size
Estimated device-pixel dimensions
Browser viewport
Device pixel ratio
```

Never call the estimate native/physical panel resolution.

## 5.3 CameraService

V2 approves one new acquisition boundary, e.g. `src/browser/camera-service.ts`.

Own:

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

No audio.

Small lifecycle:

```text
start(deviceId?)
listVideoDevices
switchDevice
getSettings
stop
destroy
```

`stop()`/`destroy()` stop every active media track. Switching must replace/stop the prior stream cleanly.

## 5.4 Printer has no hardware service

Printer Test Page uses generated local markup/SVG + print CSS + `window.print()`.

No printer detection, cartridge/nozzle state, telemetry, WebUSB or WebHID.

---

# 6. `/printer-test-page`

## User job

Print a controlled reference page and visually inspect obvious print-quality problems.

## Primary UI

```text
Printer Test Page
short explanation
paper size: A4 / Letter
test profile: Full / Color / Grayscale
[Print Test Page]
compact preview
```

Paper references:

```text
A4     210 × 297 mm
Letter 8.5 × 11 in
portrait P0
```

Profile semantics:

```text
Full
  common text/line/alignment references + grayscale + color sections

Color
  common text/line/alignment references + color patches/gradients

Grayscale
  common text/line/alignment references + grayscale patches/gradient
```

Printed content should include:

- fine black text at multiple useful sizes;
- thin horizontal/vertical line and grid references;
- alignment/crosshair markers;
- grayscale patches and smooth ramp;
- R/G/B/C/M/Y/K/neutral-gray patches in applicable profiles;
- useful color gradients in applicable profiles;
- page-edge/safe-area references without requiring borderless printing.

Prefer SVG/HTML foreground graphics for essential diagnostics. Do not depend exclusively on print-background settings.

Tell users to choose `100% / Actual Size` when checking physical spacing/alignment. Browser print preview is enough; no PDF generator in P0.

## Honesty

Browser/OS/driver/printer color management may transform colors. No claim of raw CMYK separation, exact nozzle isolation, cartridge state, certified color accuracy or automatic root-cause diagnosis.

Recommended meaning:

> Use the printed pattern to look for missing color, visible banding, blurred text, uneven density or alignment problems.

## EN metadata

```text
Title: Printer Test Page — Print a Color & Grayscale Test Online
H1: Printer Test Page
Meta: Print a free printer test page with color patches, grayscale, fine lines, alignment marks and text to visually check print quality.
```

## Acceptance

- no site chrome in print preview/output;
- A4 + Letter portrait fit without accidental clipping;
- essential elements survive without background-graphics dependency;
- compact screen preview;
- print cancellation leaves UI usable;
- no printer-health verdict or exact CMYK/nozzle claim;
- no upload.

---

# 7. `/monitor-test`

## User job

One quick guided visual first pass for common obvious monitor/screen issues.

## Exact P0 order

```text
White
Black
Red
Green
Blue
50% Gray
5% Gray
Grayscale gradient
Color gradient
Black-level reference
White-level reference
Sharpness/grid reference
```

`5% Gray` uses the encoded gray rule from section 5.1. It is not a physical luminance statement.

Primary action: `Start Monitor Test`.

Fullscreen is progressive enhancement; keep a large in-page fallback.

Active-stage controls:

```text
Click/tap/Space/Right Arrow -> next
Left Arrow                  -> previous
Esc                         -> browser/fullscreen exit
```

Labels/instructions must be hideable during inspection.

May help visually inspect pixel-like points, obvious tint anomalies, brightness/uniformity differences, black-field leakage/clouding, visible gradient banding, basic black/white-level separation and obvious sharpness/geometry issues.

No color-accuracy certification, response-time number, contrast-ratio number, pass/fail or health verdict.

Use only the capped RelatedTools graph; no seven-link Display directory.

## EN metadata

```text
Title: Monitor Test — Test Your Screen & Display Online
H1: Monitor Test
Meta: Run a guided fullscreen monitor test with solid colors, gray fields, gradients and basic display patterns to visually inspect common screen issues.
```

Natural body vocabulary may include `screen test`, `display test`, `monitor color test`, `screen color test`; no synonym routes.

## Acceptance

- no scrolling inside active pattern stage;
- fullscreen + fallback;
- touch/click/keyboard navigation;
- hideable overlay;
- no automatic verdict;
- no accidental animation contaminating static inspection fields;
- no calibration/hardware-measurement overclaim.

---

# 8. `/screen-uniformity-test`

## User job

Flat gray references for visual inspection of uneven brightness, tint, banding, mura/clouding or dirty-screen-effect-like patches.

Exact presets, using section 5.1 encoding:

```text
5% Gray
10% Gray
25% Gray
50% Gray
75% Gray
100% White
```

Manual switching only. A 1–100% slider is optional only if it remains simpler than presets; it is not required.

This is pure visual inspection. The browser does not measure luminance uniformity without external hardware.

Do not display percentage uniformity, panel-variance score, pass/fail or color delta.

Conservative conditions:

```text
normal viewing brightness
reduce distracting reflections
normal viewing position first
compare several gray levels
confirm whether issue also appears in real content
```

No universal maximum-brightness instruction.

## EN metadata

```text
Title: Screen Uniformity Test — Check Gray Uniformity & DSE
H1: Screen Uniformity Test
Meta: Use fullscreen gray fields to visually inspect screen uniformity, dirty screen effect, banding, tint and uneven brightness on OLED or LCD displays.
```

## Acceptance

- deterministic encoded values;
- fullscreen + fallback;
- hideable controls;
- DSE wording natural;
- no score/verdict;
- no guarantee that variation is a defect.

---

# 9. `/oled-burn-in-test`

## User job

Controlled solid/gray references that make persistent image-retention/burn-in-like shapes easier to see.

Exact short sequence:

```text
Red
Green
Blue
White
50% Gray
25% Gray
75% Gray
Black
```

Gray fields use section 5.1 encoded values.

Inspection only, not repair.

Do not add flashing pixel-fixer sequences, long high-brightness loops, repair mode, burn-in percentage or timers encouraging hours of static display.

Copy must distinguish possible permanent OLED burn-in, temporary image retention, panel non-uniformity and tint/mura. Browser patterns cannot prove which is present.

Recommended meaning:

> Persistent shapes visible across several neutral or solid fields may be worth investigating. This visual test cannot determine whether an artifact is permanent burn-in, temporary retention or another uniformity issue.

## EN metadata

```text
Title: OLED Burn-In Test — Check Screen Burn-In & Image Retention
H1: OLED Burn-In Test
Meta: Use fullscreen solid colors and gray fields to visually check for persistent image shapes, screen burn-in and image retention on OLED displays.
```

## Acceptance

- no flashing/repair claim/percentage;
- manual navigation;
- fullscreen + fallback;
- clear burn-in vs retention distinction;
- max-3 relevant relations.

---

# 10. `/screen-resolution-checker`

## User job

Immediately show what screen/viewport values this browser reports now.

No Start button.

Primary:

```text
Browser-reported screen size
1920 × 1080 CSS px
```

Secondary:

```text
Estimated device-pixel dimensions
Browser viewport
Available screen area
Device pixel ratio
Color depth
Orientation when available
```

Source values:

```text
screen.width / height
screen.availWidth / availHeight
window.innerWidth / innerHeight
window.devicePixelRatio
screen.colorDepth
screen.orientation?.type when available
```

Estimated device-pixel dimensions use the exact `Math.round(css * dpr)` rule from section 5.2.

Recompute on resize and relevant orientation change. No Multi-Screen Window Placement permission in P0.

Do not claim native/physical monitor resolution; zoom, OS scaling, browser behavior and privacy behavior can affect reported values.

## EN metadata

```text
Title: Screen Resolution Checker — What Is My Screen Resolution?
H1: Screen Resolution Checker
Meta: See the screen size, browser viewport, device pixel ratio and estimated device-pixel dimensions reported by your browser.
```

## Acceptance

- immediate primary value;
- resize updates viewport;
- orientation updates applicable values;
- estimate visibly labelled;
- no native-panel claim;
- no permission.

---

# 11. `/webcam-test`

## User job

Confirm a webcam can be opened in-browser and view the current video stream.

Initial:

```text
Webcam Test
Your camera stays on this device.
[Start Camera]
```

Permission only after Start.

Use:

```ts
navigator.mediaDevices.getUserMedia({ video: true, audio: false });
```

After permission:

```text
live preview
selected camera
track/browser-reported stream resolution
track-reported frameRate when available
aspect ratio
[Stop Camera]
```

After permission, enumerate video inputs when supported and allow switching when multiple cameras exist.

If displayed-frame measurement is ever added via `requestVideoFrameCallback`, label it separately as an observed video-frame rate. Do not merge it with track-reported `frameRate`. Measured FPS is optional and omitted from P0 unless implementation remains clearly simpler with it.

Normalize at least:

```text
API unavailable
permission denied
no camera found
camera in use / unreadable
constraint/device-switch failure
stream ended
```

No raw exception stacks.

### Privacy

- no media upload;
- no recording;
- no snapshot persistence;
- no backend;
- no microphone permission;
- Stop/destroy/navigation stop active tracks;
- switch cleans up replaced stream.

Screenshot/capture is out of P0.

## EN metadata

```text
Title: Webcam Test — Check Your Camera Online
H1: Webcam Test
Meta: Test your webcam directly in the browser with a live camera preview and browser-reported stream information. No recording or upload.
```

Supporting terms: `webcam tester`, `camera test online`, `computer camera test`.

## Acceptance

- explicit-action permission;
- no audio permission;
- actionable denied/no-camera/in-use states;
- clean stop/navigation/switch lifecycle;
- no request carries media frames;
- one-camera flow works with limited enumeration;
- no camera-quality score.

---

# 12. Existing-page SEO/copy patch

Presentation only; diagnostic algorithms/caveats remain unchanged.

## Gamepad Tester

```text
H1: Gamepad Tester
Title: Gamepad Tester — Test Controllers & Joysticks Online
Meta: Test gamepad and controller buttons, analog sticks, D-pad and triggers directly in your browser. Works as a quick controller and joystick input checker.
```

No universal compatibility claim.

## Stick Drift

```text
H1: Stick Drift Test
Title: Stick Drift Test — Check Controller Analog Stick Drift
Meta: Test controller stick drift in your browser by measuring the observed center offset of both analog sticks while untouched.
```

Measurement logic unchanged.

## Mouse Polling Rate

```text
Title: Mouse Polling Rate Test — Check Mouse Hz Online
```

Keep browser-observed pointer-sample-rate caveat; not USB polling certification.

## Mouse DPI

Keep `Mouse DPI Test`; add `DPI analyzer` only naturally in explanatory text. Keep `Estimated DPI`.

## Keyboard Rollover

```text
H1: Keyboard Rollover Test
Title: Keyboard Rollover Test — NKRO & Simultaneous Key Check
```

Add natural `NKRO testing and browser limitations` wording. No NKRO certification.

## Keyboard Tester

Keep dominant title/H1. Add `keyboard checker` only naturally in intro/explanation.

## Dead Pixel / Touch Screen

Mostly preserve existing pages. No stuck-pixel synonym route; no multi-touch/ghost-touch/dead-zone synonym routes.

---

# 13. Localization

Locales remain:

```text
en
pt-BR
de
fr
es
ru
```

EN is unprefixed. Every locale keeps the same English semantic slug. No localized slugs.

Every registered V2 ToolId must have complete content for all six locales before route generation. No English placeholder fallback.

Preferred primary vocabulary:

| Tool | pt-BR | de | fr | es | ru |
|---|---|---|---|---|---|
| Webcam | Teste de Webcam | Webcam-Test | Test de webcam | Prueba de Webcam | Проверка веб-камеры онлайн |
| Printer | Página de teste da impressora | Drucker-Testseite | Page de test imprimante | Página de prueba de impresora | Тестовая страница принтера |
| Monitor | Teste de Monitor | Monitor-Test / Bildschirmtest | Test d'écran | Prueba de Monitor / Test de Pantalla | Тест монитора |
| Resolution | Resolução da Tela | Bildschirmauflösung prüfen | Résolution de l'écran | Resolución de Pantalla | Разрешение экрана |
| Uniformity | Teste de uniformidade da tela | Test der Bildschirmgleichmäßigkeit / Grauuniformität | Test d'uniformité de l'écran | Prueba de uniformidad de pantalla | Тест равномерности экрана |
| Burn-In | Teste de burn-in OLED | OLED-Burn-in-Test | Test de burn-in OLED | Prueba de burn-in OLED | Тест на выгорание OLED |

Do not mechanically translate established technical loanwords.

### Privacy timing

Do **not** publish camera privacy language before Webcam ships.

In the Webcam block update all locale privacy pages to preserve:

```text
Controller, keyboard, mouse, touch, frame-timing and camera data are processed locally.
Camera video is not uploaded, recorded or stored by Hardware Inspect.
```

Printer page copy must say it generates a local reference, does not inspect printer telemetry and uploads no documents.

---

# 14. SEO generation

For each new route:

```text
H1 + concise intro
actual tool immediately
useful explanation below
limitations / measurement boundary
RelatedTools only when semantically relevant
```

Use the existing centralized canonical/hreflang pipeline. No hand-coded competing SEO tags.

Every registered V2 job must generate:

```text
1 EN root URL
5 localized URLs
self canonical
reciprocal en / pt-BR / de / fr / es / ru hreflang
x-default -> EN when emitted by current pipeline
sitemap entries for every indexable alternate
```

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

No synonym route zoo. Structured data is optional; no fake ratings/reviews/usage/offers.

---

# 15. Measurement language

Allowed families:

```text
Observed
Browser-reported
Estimated
Visual inspection
May indicate
Worth investigating
Not detected in this browser test
Controlled reference
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
Printer        controlled printable reference; no printer telemetry
Display V2     visual inspection; no physical luminance/colorimeter measurement
Resolution     browser-reported CSS values + estimated device pixels
Webcam         permissioned local browser stream + track/browser observations
```

---

# 16. QA

Automated minimum **after both review passes**:

```bash
pnpm typecheck
pnpm test
pnpm build
```

Add pure tests for applicable:

- encoded gray/pattern definitions and order;
- screen-info `Math.round` calculation;
- camera error normalization/lifecycle helpers;
- print-profile state logic.

Manual targets:

```text
Desktop: Chrome / Edge / Firefox; Safari where available
Mobile: iOS Safari / Android Chrome for responsive/fullscreen/camera behavior
```

Printer manual QA:

- Chrome + Firefox print preview;
- A4 + Letter portrait;
- 100% / Actual Size guidance;
- no site chrome;
- essential foreground/color/vector content without background-graphics dependency.

Webcam manual QA:

- allow / deny / previously denied / no camera;
- two cameras + switch if available;
- stop;
- navigation away;
- another app holding camera if reproducible;
- network inspection once for no media upload.

Display manual QA:

- in-page stage;
- fullscreen and rejection/unavailable fallback;
- keyboard/touch/click navigation;
- Esc/fullscreen state;
- high-DPI;
- mobile orientation;
- control overlay hide/restore.

Mocks/headless checks validate logic/state/rendering, not real printer output, real camera hardware or physical panel defects.

---

# 17. Atomic implementation waves

Each block follows:

```text
implementation
-> self-review #1
-> fixes
-> visual/UX review
-> fixes
-> self-review #2 final diff
-> fixes
-> build/typecheck/tests/CI
-> validation fixes/rerun
-> squash merge
```

## Wave 0 — Foundation

Do:

1. converge EN root pages onto shared ToolPage/content source;
2. prepare camera/printer channel + icon typing, without ToolIds;
3. replace implicit RelatedTools sibling/fallback logic with explicit capped relations for currently implemented tools;
4. make homepage category/column/hero model data-driven from implemented groups;
5. apply existing-page SEO/copy patch;
6. preserve all current controller/measurement behavior.

Do not:

- register unfinished V2 ToolIds;
- expose empty Camera/Printer groups;
- show Camera/Print in hero before those jobs ship;
- publish camera privacy copy yet.

## Wave 1 — Printer

Atomically add ToolId + component/controller + all six locales + Printer homepage/hero representation + SEO/hreflang/sitemap + print QA.

## Wave 2 — Monitor

Add shared Display Pattern Engine and atomically register Monitor Test with all locales/SEO/QA.

## Wave 3 — Uniformity

Reuse engine; atomically register Screen Uniformity with all locales/SEO/QA.

## Wave 4 — OLED Burn-In

Reuse engine; atomically register OLED Burn-In with all locales/SEO/safety QA.

## Wave 5 — Resolution

Add screen-info helper; atomically register Resolution Checker with all locales/SEO/calculation QA.

## Wave 6 — Webcam

Add CameraService; atomically register Webcam Test with all locales, Camera homepage/hero representation, privacy update and permission/lifecycle QA.

---

# 18. Post-release evidence

After V2, stop broad keyword expansion and use first-party data:

```text
Printer:     printer test page / print test page / color printer test page
Monitor:     monitor test / screen test / display test / monitor color test
Uniformity:  screen uniformity / oled uniformity / gray/grey uniformity / DSE
Resolution:  screen resolution checker / what is my screen resolution / monitor resolution
Burn-in:     oled burn in test / screen burn test / image retention test
Webcam:      webcam test / webcam tester / camera test online / computer camera test
```

Do not split a route because of one or two impressions. Require repeated independent intent plus a real SERP/user-job boundary.

---

# 19. Expansion V2 Definition of Done

### Product

- six approved jobs exist and work;
- no rejected synonym routes;
- existing tools not functionally regressed;
- honest measurement/inspection language.

### Architecture

- central typed tool definitions;
- Camera/Printer channels typed;
- EN presentation one source;
- homepage data-driven and exposes only implemented groups;
- explicit RelatedTools max 3;
- CameraService lifecycle cleaned up;
- shared Display pattern logic;
- no generic new service layer.

### SEO/localization

- approved title/H1/meta or reviewed equivalent;
- correct canonical/hreflang/sitemap;
- complete `en`, `pt-BR`, `de`, `fr`, `es`, `ru` for every registered new job;
- no English placeholder fallback;
- no synonym landing pages;
- existing SEO patch applied.

### Privacy

- camera media not uploaded/recorded/stored;
- Printer uploads nothing and claims no telemetry;
- camera privacy copy ships atomically with Webcam;
- no backend/account flow.

### Quality

- self-review #1;
- visual/UX review;
- self-review #2 final diff;
- typecheck/test/build/SEO guard green;
- applicable real/manual Printer/Display/Webcam checks recorded honestly;
- 1366×768 desktop and applicable mobile layouts usable.

---

# 20. Anti-goals

Do not add:

```text
GPU
controller vibration
monitor ghosting
MIDI/audio
CPS/reaction-time
CPU/RAM/system benchmark pages
WebHID/WebUSB experiments
backend analytics storage
accounts
persistent/shareable diagnostic history
AI diagnosis
automatic warranty verdicts
burn-in repair/flashing
fake hardware scores
localized slugs
UI framework
redesign of all existing tools
placeholder ToolIds
empty homepage categories
```

If a requested detail needs an anti-goal, stop that detail and preserve scope.

---

# 21. Product thesis

Keep HardwareInspect as:

```text
focused device diagnostics
+ browser-observable signals
+ controlled visual/output references
+ explicit measurement boundaries
+ no install
+ no account
+ local-first behavior
```

V2 strengthens that shape without turning the site into a generic “all computer tools” directory. After V2, let first-party GSC evidence decide whether any WATCH direction deserves another wave.