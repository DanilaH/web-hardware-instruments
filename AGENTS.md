# Agent Instructions

These instructions are mandatory for coding agents working in this repository.

## 1. Source-of-truth order

Before changing product code, read the documents that own the affected decision.

Start with:

1. `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` — durable product strategy, current/approved scope, expansion rule, deployment/release boundary;
2. `18_DECISIONS_AND_BOUNDARIES.md` — global and full-v1 exact algorithms, lifecycle semantics, browser behavior, and technical boundaries;
3. `23_HARDWARE_EXPANSION_V2_SPEC.md` — exact Hardware Expansion V2 scope, route behavior, new capability boundaries, V2 SEO/copy patches, sequencing, and route-specific QA;
4. `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` — exact behavior, algorithms, UX, and route-specific QA for the implemented Expansion 1 routes;
5. `22_LOCALIZATION_SPEC.md` — exact locale set, localized route/SEO architecture, terminology boundaries, runtime-message i18n rules, hreflang/canonical behavior, and localization QA;
6. `13_AGENT_RULES.md` — mandatory engineering/review rules;
7. `16_UX_ACCEPTANCE.md` — interaction and viewport acceptance;
8. `17_FUNCTIONAL_VISUAL_SYSTEM.md` — durable visual-system rules;
9. `14_DEFINITION_OF_DONE.md` — code-complete and release-ready gates.

Supporting references when relevant:

- `03_TOOL_SPECS.md` — original full-v1 route contracts;
- `06_ARCHITECTURE.md` — current architecture shape and dependency direction;
- `07_BROWSER_APIS.md` — browser capability/measurement notes;
- `05_SEO_CONTENT.md` — durable SEO/content rules;
- `02_INFORMATION_ARCHITECTURE.md` — current catalog/navigation model;
- `12_LAUNCH_PLAN.md` — production/release execution checklist;
- `11_IMPLEMENTATION_PLAN.md` — completed implementation history plus maintenance workflow;
- `24_EXPANSION_V2_IMPLEMENTATION_ROADMAP.md` — non-normative execution roadmap for the approved V2 scope once present.

If `18`, `19`, and `23` appear to conflict on shared architecture, privacy, lifecycle, measurement honesty, browser behavior, or scope, stop and report the conflict. Do not guess or invent a compromise.

`23_HARDWARE_EXPANSION_V2_SPEC.md` owns exact V2 route-specific decisions and may explicitly add V2 capability boundaries. It does not weaken shared global rules from `18`/`19` or existing Expansion 1 behavior from `20`.

For localization work, `22_LOCALIZATION_SPEC.md` owns locale routing, translation/i18n architecture, localized SEO metadata, hreflang/canonical behavior, and terminology. It does **not** decide whether a new diagnostic route is approved. Expansion V2 routes are authorized by `23`; once a V2 ToolId is registered, the same `22` localization architecture applies and all six current locales must be complete atomically.

The old E1.0 → E1.7 order is completed development history. It is **not** a current instruction to keep implementing Expansion 1 stages.

## 2. Mandatory product and architecture boundaries

- Astro static output.
- Strict TypeScript with `noUncheckedIndexedAccess`.
- Plain CSS / CSS custom properties / Astro-scoped styles.
- Native browser APIs through the approved thin capability services/helpers.
- No React, Vue, Svelte, Tailwind, component library, chart library, global state library, backend, database, auth, AI, WebHID/WebUSB, or speculative architecture without an explicit approved need.
- Do not invent measurement semantics, thresholds, filters, sample durations, accuracy claims, or hardware-health verdicts.
- Do not create placeholder or coming-soon indexable pages.
- One page = one real user job/search intent.
- Primary interaction must satisfy the applicable one-screen/device-class UX acceptance rules.
- Raw hardware/input/media streams remain local and must not be sent to analytics.

Approved acquisition boundaries across implemented/approved scope:

```text
GamepadService
FrameSampler
KeyboardInputService
MouseMovementService
MouseInputService
TouchInputService
CameraService          Expansion V2 only, when Webcam ships
```

The shared Fullscreen utility is a progressive-enhancement helper, not a hardware acquisition service. The V2 Display Pattern Engine and screen-info helper are deterministic/shared tool primitives, not generic hardware-service layers. Printer Test Page does not get a printer hardware service.

Do not duplicate native acquisition loops/listeners merely to make a tool self-contained.

## 3. Review before automated validation

For every coherent implementation or maintenance block, use this exact sequence:

```text
implementation
→ self-review #1
→ review fixes
→ visual / UX review
→ visual / UX fixes
→ self-review #2 on the final diff
→ review fixes
→ only then build / typecheck / tests / CI
→ fix validation failures
→ rerun validation until green
→ squash merge
```

Do **not** wait for, poll, or use CI/test results while code/product/visual review is still open. Automated validation is the final gate, not an input to the review.

If a validation fix materially changes behavior, architecture, lifecycle, measurement semantics, or UX, re-review the impacted part. Pure compile/test corrections do not require restarting unrelated review work.

Before merge, verify the applicable subset of:

```text
build
typecheck
tests
target viewport UX
keyboard/focus accessibility
cleanup/lifecycle
measurement wording
privacy boundary
locale completeness / canonical / hreflang / sitemap
```

Report honestly what was not validated on real hardware, real camera, real printer output, or physical display defects.

## 4. Toolchain

Use:

```text
Node.js 24 LTS
pnpm
Astro check for type checking
Vitest for unit tests
```

Expected scripts:

```text
pnpm dev
pnpm build
pnpm typecheck
pnpm test
```

Playwright is appropriate only when a critical browser-flow/lifecycle test materially benefits from browser automation. Do not add it merely because it is common in frontend projects.

## 5. Current project state

The currently implemented production catalog contains 18 code-side-audited tools.

### Controller

```text
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test
```

### Mouse

```text
/mouse-tester
/mouse-button-test
/mouse-scroll-test
/double-click-test
/mouse-polling-rate-test
/mouse-dpi-test
```

### Keyboard

```text
/keyboard-tester
/keyboard-rollover-test
/keyboard-ghosting-test
```

### Display

```text
/fps-test
/refresh-rate-test
/frame-skipping-test
/dead-pixel-test
/backlight-bleed-test
```

### Touch

```text
/touch-screen-test
```

Full v1 and Hardware Expansion 1 are implementation-complete and code-side audited. Localization of the existing 18-tool catalog is implemented for English plus `pt-BR`, `de`, `fr`, `es`, and `ru` using the shared diagnostic logic and locale-aware routing/content architecture.

Hardware Expansion V2 is now approved under `23_HARDWARE_EXPANSION_V2_SPEC.md` and adds exactly six planned production jobs:

```text
/printer-test-page
/monitor-test
/screen-uniformity-test
/oled-burn-in-test
/screen-resolution-checker
/webcam-test
```

These routes do **not** count as implemented merely because they are documented. Do not expose placeholders or empty Camera/Printer homepage categories. Register each V2 ToolId atomically with its real component, all six locale content entries, route generation, SEO metadata, relation decision and applicable tests.

The old E1.0 → E1.7 sequence is retained in historical/supporting documents only to explain how the catalog was built and reviewed. There is no approved E1.8.

Reviewed maintenance may touch any current route when it preserves that route's user job, exact measurement contract, privacy boundary, and architecture ownership. Correctness, accessibility, IA, SEO, maintainability, localization, and UX polish are legitimate cross-catalog maintenance work.

New product scope outside the implemented catalog and the six approved V2 routes still requires fresh evidence under `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` and a reviewed exact contract before implementation.

## 6. Durable measurement boundaries

Never upgrade browser-visible data into claims the browser cannot prove.

Examples:

- Gamepad state is browser-observed; do not expose raw device IDs or guess non-standard physical mappings.
- Stick Drift reports observed center offset, not a good/bad controller verdict.
- Deadzone suggestion is the documented heuristic, not a universal correct setting.
- Mouse DPI is estimated from browser movement plus user-provided physical distance.
- Mouse Polling reports browser-observed pointer sample rate, not guaranteed USB/device polling.
- Keyboard Rollover is maximum simultaneous browser-observed input, not NKRO certification.
- Keyboard Ghosting compares a guided expected set with browser-observed input; reserved shortcuts may never reach the page.
- Touch coverage uses only actually observed in-surface touch samples; interpolation/clamping must not manufacture measured cells.
- FPS and Refresh Rate use `FrameSampler` and browser-visible rAF timing, not another application's FPS or EDID.
- Dead Pixel and Backlight Bleed are visual-inspection tools, not automatic display diagnosis.
- Frame Skipping uses browser timing only for readiness/sequential pattern control; real camera photos provide the physical evidence.
- Printer Test Page is a controlled printable reference, not printer telemetry or exact CMYK/nozzle isolation.
- Monitor/Uniformity/OLED Burn-In are visual-inspection tools, not luminance/colorimeter measurements, pass/fail or repair systems.
- Screen Resolution Checker reports browser CSS-pixel values and estimated device-pixel dimensions, not guaranteed physical/native panel resolution.
- Webcam reports a permissioned browser media stream and browser/track observations; it does not upload media or produce a camera-quality score.

Use `18`, `20`, and `23` for the exact formulas/state machines/contracts. Localization must preserve the same certainty/uncertainty level in every language.

## 7. Styling and visual boundaries

The product uses the authored instrument system defined in `17_FUNCTIONAL_VISUAL_SYSTEM.md`:

```text
light instrument chassis
+ dark diagnostic surfaces only where they have functional meaning
+ restrained hardware-family channel colors
+ domain-specific browser/input/output geometry
+ strong measurement typography
+ state/signal-driven motion only
```

The existing five chromatic channel colors map to Controller, Mouse, Keyboard, Display, and Touch. Expansion V2 adds Camera and Printer as taxonomy channels, but does not automatically add two new bright channel colors. Use the neutral instrument treatment for Camera/Printer unless an explicit reviewed visual-system update approves a restrained extension.

Channel colors reinforce family identity and active signal; they do not replace success/warning/error semantics and must not turn the catalog into a rainbow UI.

No decorative gradient washes, glass, neon, gaming chrome, nested dashboard cards, ornamental charts, fake instrument readouts, or generic AI/SaaS visual chrome.

A CSS `linear-gradient()` is allowed when it is only the implementation primitive for a functional technical grid/reference ruling. Judge the rendered purpose, not the CSS function name. `17_FUNCTIONAL_VISUAL_SYSTEM.md` owns the exact visual grammar if a supporting document contains older wording.

Responsive layouts should preserve task/result proximity rather than mechanically stacking every desktop tile into a long column.

Localization must be tested for text expansion, especially German/French/Russian labels; do not shrink critical typography into illegibility merely to preserve an English-width layout.

## 8. Lifecycle and cleanup

Every relevant rAF loop, timer, listener, subscription, pointer lock/capture, fullscreen observer/state, media track, and bfcache/navigation transition needs an explicit cleanup/restart path.

Browser capability services own acquisition lifecycle. Tool controllers own interpretation and presentation state.

Camera switching/stop/destroy must stop replaced/active media tracks. Printer uses browser print UI and has no persistent hardware acquisition lifecycle.

Do not move held sets, counters, heuristic interpretation, or visual state into acquisition services merely for reuse.

## 9. Deployment boundary

The canonical production origin is:

```text
https://hardwareinspect.com
```

Production indexing is enabled. Do not revert to `hardware-testing.invalid` or disable indexing unless an explicit release/incident decision requires it.

Localized routes use the same HTTPS production origin, self-referencing canonicals, and the hreflang rules in `22_LOCALIZATION_SPEC.md`.

Do not claim Search Console submission, indexing, real-device QA, real-printer QA, real-camera QA, or cross-browser QA that has not actually happened for newly released V2 routes.

For deployment/release checks, follow `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`, `12_LAUNCH_PLAN.md`, `22_LOCALIZATION_SPEC.md`, and V2-specific gates in `23_HARDWARE_EXPANSION_V2_SPEC.md`.

## 10. Non-normative historical/research documents

Do not use these as implementation requirements:

- `AUDIT_V4.md`;
- `GLOBAL_GOAL_AUDIT_V5.md`;
- `RESEARCH_EVIDENCE_2026-08.md`.

They are review/research context only.
