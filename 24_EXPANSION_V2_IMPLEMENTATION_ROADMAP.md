# HardwareInspect Expansion V2 — Implementation Roadmap

**Status:** execution roadmap, non-normative  
**Authority:** `23_HARDWARE_EXPANSION_V2_SPEC.md` owns product/technical decisions. This file sequences work against the current repository shape.

If this roadmap conflicts with `AGENTS.md`, `19`, `18`, `23`, `20`, or `22`, the normative documents win.

---

# 0. Current code seams

V2 should address only the concrete seams that block clean expansion:

1. `src/pages/*.astro` — 18 EN tool routes still duplicate page presentation/content/related links.
2. `src/components/pages/ToolPage.astro` — localized routes already use shared content + exhaustive ToolId/component mapping.
3. `src/i18n/content/{locale}.ts` — typed content exists for every current ToolId/locale.
4. `src/config/tool-definitions.ts` — owns stable ids/hrefs but imports `ToolChannel`/`ToolIconKind` from `tools.ts`; related logic is implicit all-siblings + Touch fallback.
5. `src/config/tools.ts` — duplicates EN names/descriptions/group data and a second related-tools algorithm.
6. `src/pages/index.astro` — localized catalog labels already exist, but columns use fixed slices and hero inputs use positional indices.
7. `src/components/navigation/RelatedTools.astro` — already renders nothing when its final set is empty.
8. `src/components/icons/ToolIcon.astro` — duplicates the icon-kind union locally.

Foundation should remove these specific duplication/ownership problems without becoming a general architecture rewrite.

---

# 1. Branch / merge model

Use small production-valid waves:

```text
PR A  docs + Foundation
PR B  Printer
PR C  Monitor + shared Display Pattern Engine
PR D  Screen Uniformity
PR E  OLED Burn-In
PR F  Screen Resolution
PR G  Webcam
```

Every PR independently follows:

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

Never merge a route with incomplete locale content or placeholder behavior.

---

# 2. PR A — Documentation + Foundation

## A0. Documentation integration

Before product code:

- add normalized `23_HARDWARE_EXPANSION_V2_SPEC.md`;
- integrate V2 authority into `AGENTS.md`, `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`, `05_SEO_CONTENT.md`;
- keep current-state catalog documents at 18 until routes actually ship;
- independently review the merged contracts.

## A1. Converge EN tool pages onto ToolPage

For each current root tool route, reduce the page to a thin wrapper:

```astro
<ToolPage locale="en" toolId="..." />
```

Before removing the old page body, compare H1/title/meta/sections/related intent and any page-specific wrapper that materially affects UX. Apply the approved V2 EN SEO wording in `src/i18n/content/en.ts` before the shared content becomes authoritative.

Do not alter tool controllers/components in this step.

## A2. Establish stable type/registry ownership

Current dependency direction is awkward: `tool-definitions.ts` imports `ToolChannel` and `ToolIconKind` from presentation-oriented `tools.ts`, while `ToolIcon.astro` duplicates the icon union.

Use one small stable type owner, preferably:

```text
src/config/tool-types.ts
  ToolChannel
  ToolIconKind
```

Then:

```text
tool-definitions.ts -> imports stable types
 tools.ts            -> imports stable types
 ToolIcon.astro       -> imports ToolIconKind
 i18n content types   -> imports ToolChannel from stable type module
```

Do not create a generic domain-model layer beyond these two stable unions.

Target stable ownership after cleanup:

```text
tool-types.ts
  channel/icon type vocabulary

tool-definitions.ts
  ToolId / href / icon / channel / explicit relation IDs

i18n content
  localized names / descriptions / SEO / sections

tools.ts
  current group ordering/catalog projection only; no second relation algorithm
```

## A3. Collapse relation duplication

Use one typed `Record<ToolId, readonly ToolId[]>` relation graph in the stable config layer (or an equivalently narrow typed structure).

Requirements:

- every set <= 3;
- no implicit all-sibling expansion;
- no singleton Touch fallback;
- `getRelatedToolDefinitions()` resolves only the explicit graph;
- delete the duplicate `getRelatedTools()` algorithm in `tools.ts` when callers are migrated/absent;
- `RelatedTools.astro` keeps rendering nothing for an empty set.

Do not create graph abstractions/frameworks.

## A4. Prepare channel/icon capability, not routes

Add `camera` and `printer` to `ToolChannel` and add future icon kinds needed for those taxonomy groups.

Do **not** add V2 ToolIds.

Update exhaustive `Record<ToolChannel,...>` content/config requirements without exposing empty groups. Camera/Printer visual treatment stays neutral per `23`.

## A5. Make homepage data-driven

Remove:

```text
content.inputs[0..4]
fixed groups.slice(0,2) / groups.slice(2)
fixed five-column rail assumptions
```

Target:

- implemented tool groups alone drive category rail/catalog;
- hero input rows are keyed by channel identity, not positional array indices;
- column split is derived from actual implemented groups;
- current five-group page must remain compact and coherent;
- full seven-group state must support approximately 4/3 distribution;
- Camera/Printer do not render until real tools exist;
- later Printer/Webcam waves should mostly add data rather than homepage branches.

A simple starting point is:

```ts
const splitIndex = Math.ceil(groups.length / 2);
```

but this is **not** a contractual formula. Review current 5-group and expected 7-group balance; choose the smallest deterministic rule that preserves 1366×768 UX. Do not preserve the old 2/3 split merely for diff similarity if 3/2 is visibly better, and do not accept 3/2 merely because the formula is elegant.

## A6. Existing EN SEO patch

Apply only the approved `23` presentation changes:

- Gamepad Tester;
- Stick Drift;
- Mouse Polling Rate;
- Mouse DPI supporting wording;
- Keyboard Rollover;
- Keyboard Tester supporting wording.

Dead Pixel and Touch remain mostly unchanged. No aliases, new routes, measurement changes, or runtime behavior changes.

## A7. Foundation review focus

Self-review #1:

- no V2 ToolId/route registered;
- every EN route still resolves to the identical tool component;
- no controller/acquisition service changed;
- stable type imports have no cycle/inverted ownership;
- one relation algorithm only, max 3;
- localized related links preserve locale;
- no EN content lost during wrapper conversion;
- homepage exposes only 5 implemented groups.

Visual/UX review:

- EN + long-string locale homepages at 1366×768, 1024×768, ~390px;
- representative page from every current family, EN vs localized parity;
- RelatedTools 0/1/2/3 rendering where reachable;
- keyboard/focus order unchanged;
- homepage visual hierarchy not degraded by data-driven refactor.

Self-review #2:

- final diff remains Foundation-only;
- no placeholder V2 route/content;
- no duplicate relation/type source remains;
- no unexpected route/SEO changes.

Only then run build/typecheck/tests/CI.

---

# 3. PR B — Printer Test Page

Atomically add:

- `printer-test-page` ToolId/definition;
- printer group/icon becomes visible;
- all six locale content entries;
- Printer component/controller + print pattern;
- Full/Color/Grayscale profile state;
- A4/Letter state;
- print CSS and site-chrome suppression;
- Print browser-boundary/hero representation;
- sitemap/canonical/hreflang through existing pipeline;
- current-state docs/tool count 18 -> 19 where appropriate.

Prefer semantic HTML/SVG foreground shapes for essential print diagnostics. Avoid Canvas if it complicates print fidelity. No printer service and no PDF generator.

Tests: pure profile/reference composition only. Do not fake physical print QA.

Manual: Chrome/Firefox print preview, A4/Letter portrait, foreground colors/lines without background-graphics dependency, no site chrome, cancellation leaves UI usable.

---

# 4. PR C — Monitor + Display Pattern Engine

Create only the narrow shared primitive required by Monitor/Uniformity/OLED: deterministic pattern definitions/order, active index, manual navigation, fullscreen integration, overlay hide/show and cleanup.

Use exact Monitor sequence from `23`, including encoded 5% and 50% gray references. Do not duplicate Dead Pixel/Backlight/Refresh/Frame Skipping logic.

Register ToolId only with all six locale entries/SEO/relations/QA.

Manual: normal stage, fullscreen/rejection fallback, Space/Arrows/click/tap, Esc/fullscreen state, overlay hide/show, high-DPI/mobile orientation, no active-stage scrolling.

---

# 5. PR D — Screen Uniformity

Reuse Display Pattern Engine. Exact encoded presets: 5/10/25/50/75/100%. No score, luminance claim, pass/fail or physical defect verdict.

Skip the optional free slider unless presets reveal a concrete UX gap.

All six locales + route/SEO/relations atomically.

---

# 6. PR E — OLED Burn-In

Reuse Display Pattern Engine and exact short sequence from `23`.

Hard safety review: no flashing, repair mode, high-brightness loop/timer, burn-in percentage; copy distinguishes burn-in, temporary retention and uniformity/tint.

All six locales atomically.

---

# 7. PR F — Screen Resolution Checker

Add a small browser-info/pure helper, not a service abstraction.

Exact estimate:

```ts
Math.round(screen.width * devicePixelRatio)
Math.round(screen.height * devicePixelRatio)
```

Render immediately; update on resize/orientation.

Pure tests cover rounding, CSS vs estimated device pixels, optional orientation and formatting/extraction where practical. Never label estimate native/physical panel resolution.

All six locales atomically.

---

# 8. PR G — Webcam

Add the only new V2 acquisition service: `CameraService`.

Service owns getUserMedia/video-device acquisition, post-permission enumeration, switching, track settings, normalized errors and cleanup. UI owns selection/presentation.

Hard requirements: permission only after Start; always `audio:false`; no capture/recording/upload/backend; Stop/navigation/destroy stop active tracks; switching cleans old stream; normalized denied/no-device/in-use/unavailable/switch-failure/ended states.

Update privacy in all six locales in this PR, not earlier. Camera group/hero appears only now.

Manual: allow/deny/previously-denied/no-camera/switch/stop/navigation and DevTools network confirmation of no media upload.

---

# 9. Cross-wave SEO/localization gate

For every newly registered ToolId verify built output:

```text
6 pages: EN + pt-BR + de + fr + es + ru
self canonical each
reciprocal 6-locale hreflang + x-default where current pipeline emits it
correct html lang
same semantic language-switch target
same-locale internal links
sitemap presence
no rejected synonym URLs
no English placeholder leak
```

Tool count moves only with real merged jobs:

```text
18 -> 19 -> 20 -> 21 -> 22 -> 23 -> 24
```

---

# 10. Stop conditions

Stop/review instead of improvising if work appears to require:

- placeholder ToolId/routes;
- second locale-availability system;
- generic HardwareManager/service locator;
- another framework/runtime dependency;
- printer hardware APIs;
- camera audio;
- upload/storage/backend;
- display calibration/physical-measurement claims;
- >3 RelatedTools;
- synonym routes;
- new WATCH items;
- broad redesign of existing tools.

---

# 11. Final release gate

After all six routes:

- catalog count = 24;
- current-state IA/docs reflect actual 7-channel catalog;
- stale “18 current tools” claims are removed from normative/current-state docs;
- full static SEO matrix verified;
- representative locale visual parity verified;
- all new runtime modules mount cleanly;
- lifecycle/cleanup verified;
- Printer/Display/Webcam manual limitations recorded honestly;
- production smoke passes;
- sitemap/webmaster monitoring follows normal operational process.

Then stop broad expansion and observe first-party search evidence before another product wave.