# HardwareInspect Expansion V2 — Implementation Roadmap

**Status:** execution roadmap, non-normative  
**Authority:** `23_HARDWARE_EXPANSION_V2_SPEC.md` owns product/technical decisions. This file only sequences the work against the current repository shape.

If this roadmap conflicts with `AGENTS.md`, `19`, `18`, `23`, `20`, or `22`, the normative documents win.

---

# 0. Current code seams

The current implementation has several concrete seams that V2 must address before adding routes:

1. `src/pages/*.astro` — 18 English tool routes still hardcode page presentation/content and related links.
2. `src/components/pages/ToolPage.astro` — localized routes already use the shared content model and an exhaustive ToolId/component map.
3. `src/i18n/content/{locale}.ts` — already supplies typed page content for every ToolId and every implemented locale.
4. `src/config/tool-definitions.ts` — stable ToolId/href/icon/channel registry, but current related logic returns all same-channel siblings and a Touch fallback.
5. `src/config/tools.ts` — duplicates English name/description/group data and also carries a second related-tools implementation.
6. `src/pages/index.astro` — localized content is already used for tool labels, but layout still assumes exactly five groups through fixed slices and positional hero inputs.
7. `src/components/navigation/RelatedTools.astro` — already renders nothing for an empty final list, so singleton Camera/Printer support mainly requires relation-source cleanup.
8. `src/components/icons/ToolIcon.astro` — duplicates the icon-kind union locally instead of importing the canonical type.

The roadmap should reduce these specific duplication points without turning Foundation into a general architecture rewrite.

---

# 1. Branch / merge model

Use small production-valid waves rather than one giant six-tool diff.

Recommended sequence:

```text
PR A  docs + Foundation
PR B  Printer
PR C  Monitor + shared Display Pattern Engine
PR D  Screen Uniformity
PR E  OLED Burn-In
PR F  Screen Resolution
PR G  Webcam
```

Each PR follows the repository workflow independently:

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

Do not merge a route with incomplete locale content or placeholder behavior.

---

# 2. PR A — Documentation + Foundation

## A0. Documentation integration

Already required before product code:

- add normalized `23_HARDWARE_EXPANSION_V2_SPEC.md`;
- integrate V2 into `AGENTS.md`, `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`, and `05_SEO_CONTENT.md`;
- keep current-state catalog documents at 18 until routes actually ship;
- independently review the merged contracts before code changes.

## A1. Converge English tool pages onto ToolPage

Goal: one presentation content source for EN and localized routes.

For each existing English root route, reduce page file to a thin wrapper around:

```astro
<ToolPage locale="en" toolId="..." />
```

Do this mechanically; do not alter controllers/components.

Before deletion of each old page body, compare:

- H1;
- title/meta;
- explanatory sections;
- related-tool intent;
- any page-specific layout wrapper that materially affects the tool.

Apply the V2 approved EN SEO wording in `src/i18n/content/en.ts` before wrappers become authoritative.

Expected risk: medium because it touches every English route but should be presentation-only.

## A2. Collapse registry duplication narrowly

Target ownership:

```text
tool-definitions.ts
  stable ToolId / href / icon / channel / explicit relation IDs

i18n content
  localized names / descriptions / SEO / sections

tools.ts or replacement group helper
  group ordering only, derived from definitions + content where possible
```

Do not retain two separate related-tool algorithms.

Preferred implementation:

- put a typed `Record<ToolId, readonly ToolId[]>` relation graph in the stable definition layer or a nearby stable config module;
- `getRelatedToolDefinitions()` resolves only that graph;
- every relation set length <= 3;
- no singleton fallback;
- `RelatedTools.astro` naturally renders nothing for an empty set;
- remove/deprecate `getRelatedTools()` duplicate logic in `tools.ts` if no caller needs it.

Do not over-normalize into a generic graph framework.

## A3. Prepare channel/icon typing, not routes

Add `camera` and `printer` to `ToolChannel` and add icon kinds needed for future groups.

Do **not** add any V2 ToolId yet.

Ensure every exhaustive `Record<ToolChannel, ...>` in content/style/config is updated without exposing empty groups.

Prefer `ToolIcon.astro` to import the canonical `ToolIconKind` type instead of maintaining a second union if the import direction stays clean.

Camera/Printer visual treatment remains neutral per `23`; do not invent two bright family colors.

## A4. Make homepage data-driven

Current hardcoded assumptions to remove:

```text
content.inputs[0..4]
groups.slice(0, 2) / groups.slice(2)
fixed five-column category rail styling
```

Target:

- implemented tool groups drive the category rail;
- hero input rows are keyed by channel/group identity, not array index;
- columns are derived from group count with a deterministic balanced split;
- with current five groups the rendered experience should remain visually equivalent or improve only where necessary;
- Camera/Printer do not render until real tools exist;
- later Printer/Webcam waves only add data, not homepage-specific branching.

Suggested deterministic split:

```ts
const splitIndex = Math.ceil(groups.length / 2);
const columns = [groups.slice(0, splitIndex), groups.slice(splitIndex)];
```

Review actual 5-group and future 7-group balance visually before treating this formula as final; 1366x768 compactness is the gate, not formula purity.

## A5. Existing EN SEO patch

Apply exactly the `23` presentation changes to:

- Gamepad Tester;
- Stick Drift;
- Mouse Polling Rate;
- Mouse DPI supporting wording;
- Keyboard Rollover;
- Keyboard Tester supporting wording.

Dead Pixel and Touch remain mostly unchanged.

Do not create aliases or change algorithms/runtime messages merely for keyword coverage.

## A6. Foundation review focus

Self-review #1:

- no V2 routes registered;
- every current EN URL still resolves to the same tool component;
- no diagnostic controller/service changed;
- no relation set exceeds 3;
- localized related links remain locale-preserving;
- no English content was lost during wrapper conversion;
- homepage shows only 5 implemented groups.

Visual/UX review:

- EN + at least one long-string locale homepage at 1366x768, 1024x768, ~390px;
- representative Controller/Mouse/Keyboard/Display/Touch pages EN vs localized parity;
- RelatedTools 0/1/2/3 handling where reachable;
- keyboard/focus order unchanged.

Self-review #2:

- final diff remains Foundation-only;
- no placeholder V2 route/content;
- no stale duplicate related algorithm;
- no unexpected SEO route changes.

Only then run build/typecheck/tests/CI.

---

# 3. PR B — Printer Test Page

Atomic additions:

- `printer-test-page` ToolId/definition;
- printer icon/group becomes visible;
- all six locale content entries;
- Printer component/controller and print pattern;
- Full/Color/Grayscale profile state;
- A4/Letter state;
- print CSS and site-chrome suppression;
- Print hero/boundary representation becomes visible;
- sitemap/canonical/hreflang via existing pipeline;
- current-state docs/tool count update from 18 -> 19 where appropriate.

Implementation preference:

- use semantic HTML/SVG foreground shapes for essential printed diagnostics;
- avoid Canvas if it complicates print fidelity;
- no printer service;
- no PDF generation.

Tests:

- pure profile composition/state;
- deterministic reference content selection;
- no attempt to unit-test physical print quality.

Manual gate:

- Chrome + Firefox print preview;
- A4 + Letter portrait;
- essential colors/lines without background-graphics requirement;
- no site header/footer in print;
- cancellation returns usable page.

---

# 4. PR C — Monitor Test + Display Pattern Engine

First create the narrow shared pattern primitive required by three real routes.

Engine should own only pattern definitions/order, active index, navigation, fullscreen integration, hide/show overlay, and cleanup.

Monitor exact sequence comes from `23` and includes encoded 5%/50% gray references.

Do not duplicate Dead Pixel/Backlight/Refresh/Frame Skipping logic inside Monitor Test.

Add all six locales atomically with ToolId registration.

Manual gate:

- normal stage + fullscreen + rejected fullscreen fallback;
- Space/Arrow/click/tap navigation;
- Esc/fullscreen observer behavior;
- hide/show controls;
- high-DPI/mobile orientation;
- no scrolling inside active stage.

---

# 5. PR D — Screen Uniformity

Reuse Display Pattern Engine; do not fork fullscreen/navigation code.

Presets use the exact encoded gray rule:

```text
5 / 10 / 25 / 50 / 75 / 100%
```

No score, luminance claim, pass/fail or physical defect verdict.

A free slider is optional and should be skipped unless the preset UI has a concrete usability gap.

All six locales + route/SEO/relations atomically.

---

# 6. PR E — OLED Burn-In

Reuse Display Pattern Engine.

Exact short pattern sequence from `23`.

Hard safety review:

- no flashing;
- no repair mode;
- no high-brightness timer/loop;
- no burn-in percentage;
- copy distinguishes burn-in vs temporary retention vs uniformity/tint.

All six locales atomically.

---

# 7. PR F — Screen Resolution Checker

Add a small pure/browser-info helper rather than a service abstraction.

Exact estimate:

```ts
Math.round(screen.width * devicePixelRatio)
Math.round(screen.height * devicePixelRatio)
```

Render immediately; update on resize/orientation.

Pure tests should cover:

- estimate rounding;
- CSS vs estimated device-pixel values;
- optional orientation handling;
- resize/update formatting where pure extraction is possible.

Never label estimated dimensions native/physical panel resolution.

All six locales atomically.

---

# 8. PR G — Webcam Test

Add the only new V2 acquisition service: `CameraService`.

Service owns getUserMedia/video-device acquisition, device enumeration, switching, track settings, errors and cleanup. UI owns selection/presentation.

Hard requirements:

- permission only after Start;
- `audio: false` always;
- no capture/recording/upload/backend;
- Stop/navigation/destroy stop active tracks;
- switching cleans up old stream;
- normalized denied/no-device/in-use/unavailable/switch-failure/ended states.

Update privacy content in all six locales in this same PR, not earlier.

Camera group + hero boundary appears only now.

Manual gate includes allow/deny/previously-denied/no-camera/switch/stop/navigation and DevTools network confirmation of no media upload.

---

# 9. Cross-wave SEO/localization gate

For every newly registered ToolId verify in built output:

```text
6 semantic pages: EN + pt-BR + de + fr + es + ru
self canonical for each
reciprocal 6-locale hreflang + x-default where current pipeline emits it
correct html lang
same semantic language-switch target
same-locale internal links
sitemap presence
no rejected synonym URLs
no English placeholder leak
```

Tool count should progress only with real merged jobs:

```text
18 -> 19 -> 20 -> 21 -> 22 -> 23 -> 24
```

---

# 10. Scope stop conditions

Stop/review instead of improvising if implementation appears to require:

- placeholder ToolId/routes;
- a second locale availability system;
- generic HardwareManager/service locator;
- another framework/runtime dependency;
- printer hardware APIs;
- camera audio;
- upload/storage/backend;
- display calibration/physical measurement claims;
- more than 3 RelatedTools;
- synonym routes;
- new WATCH items;
- broad redesign of existing tools.

---

# 11. Final release gate

After all six routes:

- catalog count = 24;
- current-state IA/docs updated to actual 7-channel catalog;
- no stale “18 current tools” statement remains in normative/current-state docs;
- full static SEO matrix verified;
- representative locale visual parity verified;
- all new runtime modules mount cleanly;
- lifecycle/cleanup verified;
- manual Printer/Display/Webcam limitations recorded honestly;
- production deployment smoke passes;
- sitemap resubmission/monitoring follows normal Search Console/Bing/Yandex process.

Then stop broad expansion work and observe first-party search evidence before approving another product wave.