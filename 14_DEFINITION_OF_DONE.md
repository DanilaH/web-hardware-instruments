# Project Definition of Done

This document defines the durable completion gates for the current product and future maintenance work. It is not an implementation roadmap.

## 1. Highest-priority gate: UX

A primary tool page is not done unless all applicable requirements pass:

- at `1366×768`, desktop-relevant tools keep the main interaction and key result/status within one viewport;
- a first-time visitor can identify the next action without reading below-the-fold copy;
- there is at most one visually dominant action at a time;
- the primary result appears in the same tool region and does not require hunting after completion;
- no dashboard-like metric overload;
- no unnecessary graph/table/history/settings in the main tool;
- functional visuals materially improve task execution or interpretation;
- no visualization exists only to make the page look busier;
- unsupported/waiting states explain the next action concisely;
- spacing, typography, responsive order, and density remain polished rather than cramped;
- mobile layouts prioritize the task/result rather than mechanically stacking every desktop block.

Touch Screen Test follows its explicit mobile/tablet-oriented acceptance rules in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

Localized pages must preserve the same UX gate despite longer/shorter translated strings. Translation is not permission to move the primary task below the fold or introduce English fallback copy into the main interaction.

Failure here blocks completion even when code and tests are technically correct.

## 2. Current product catalog

The implemented code-side-audited catalog contains 18 tools:

### Controller

```text
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test
```

### Keyboard

```text
/keyboard-tester
/keyboard-rollover-test
/keyboard-ghosting-test
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

Supporting public routes include `/`, `/about`, `/privacy`, and `/404` behavior.

Every listed tool is a real implementation, not a placeholder.

`18_DECISIONS_AND_BOUNDARIES.md` owns exact durable full-v1 measurement/browser decisions. `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` remains the exact contract for Expansion 1 behavior. `22_LOCALIZATION_SPEC.md` owns approved locale routing/content/i18n/SEO behavior. The old sequential implementation order is historical process context, not an ongoing completion requirement.

## 3. Code-complete gate

A change is code-complete only when its affected routes/components satisfy all applicable items:

- implementation matches the owning source-of-truth contract;
- exact pure calculations/heuristics are tested where applicable;
- browser acquisition ownership is preserved;
- lifecycle/cleanup is correct;
- unsupported/cancelled/waiting states are readable;
- target visual/headless review passes;
- measurement wording remains honest;
- raw input remains local;
- no unrelated product scope leaks into the change;
- final self-review is performed on the final diff;
- build, typecheck, tests, and required CI are green after review.

For localization work, code-complete additionally requires:

- existing English behavior/URLs remain stable;
- locale routing is centralized/typed;
- localized presentation does not fork diagnostic algorithms/services/renderers;
- all primary user-visible runtime strings are localized;
- `<html lang>` is correct;
- localized navigation/related links stay in the same locale;
- no measurement claim becomes stronger through translation.

Mock/headless browser input may validate state, rendering, geometry and locale output. It is never proof of real hardware behavior.

## 4. Release-ready gate

A hardware-dependent route is release-ready only after its applicable real-device/browser/camera checks are completed honestly.

Examples include:

- real controller smoke for controller routes;
- real mouse/button/wheel/polling/DPI smoke for mouse routes;
- real touch-device coverage/multi-touch/fullscreen smoke;
- real keyboard simultaneous-key/guided-combination smoke;
- real display/fullscreen inspection flow;
- real camera evidence workflow for Frame Skipping.

A route may be code-complete while external hardware is unavailable. Do not claim validation that did not occur.

A localized variant does not require re-proving the underlying hardware algorithm if the exact same implementation is reused, but its translated instructions/status/error/limitation flow must still be manually reviewed for correctness and task usability.

## 5. Public deployment gate

The production origin is already configured:

```text
https://hardwareinspect.com
indexingEnabled = true
```

This supersedes historical pre-launch references to `hardware-testing.invalid`.

For production changes, verify rather than assume:

- `https://hardwareinspect.com` resolves correctly over HTTPS;
- released routes return 200;
- canonical URLs use the production origin;
- robots and sitemap output are correct;
- required real-device/browser/camera QA is complete for affected behavior where relevant;
- Google Search Console access/property state is known;
- sitemap submission/status is known;
- final production smoke is performed after deployment.

For localized release, additionally verify:

- only approved locale prefixes from `22_LOCALIZATION_SPEC.md` are generated;
- localized pages return 200;
- every localized page is self-canonical;
- reciprocal hreflang exists for every actually shipped semantic alternate;
- `<html lang>` is correct;
- localized pages are included in the sitemap;
- language switching preserves semantic route identity;
- no forced IP/geography redirect is introduced;
- primary UI/runtime content does not leak English unexpectedly.

Do not treat mock/headless checks as proof of real hardware coverage.

## 6. Tool-specific durable boundaries

### Gamepad Tester

Primary view contains detection state, generic controller visualization, button/stick/trigger state where exposed, and honest non-standard mapping fallback. Technical metadata does not dominate the main view.

### Controller Stick Drift

Primary flow remains:

```text
release sticks
→ start
→ short measurement
→ simple per-stick observed center offset
```

No automatic hardware-health verdict or statistics dashboard.

### Controller Deadzone

Primary view contains live stick context, p95 observed center noise, and the documented heuristic starting deadzone. No configuration simulator is required.

### Mouse DPI

Primary view contains distance/unit input, one start flow, relative movement-capture feedback, and Estimated DPI. The visualization must not claim physical-distance progress the browser cannot know.

### FPS

Primary view contains observed browser FPS, median frame time, and a short bounded trace. No categorical hardware/performance verdict.

### Refresh Rate

Primary view contains estimated Hz and optional closest common mode only within the documented tolerance. It remains a browser-visible cadence estimate, not EDID/hardware readout.

### Keyboard Tester

Primary view contains the compact keyboard, pressed state, and concise last-key/code/count feedback. No raw event log.

### Expansion 1 routes

Exact Mouse, Touch, Rollover, Ghosting, Dead Pixel, Backlight Bleed, and Frame Skipping semantics remain owned by `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`. Do not duplicate their detailed algorithms here.

## 7. Technical

- Astro static output;
- strict TypeScript with `noUncheckedIndexedAccess`;
- plain CSS and native DOM/SVG/Canvas;
- shared typed `GamepadService`;
- shared typed `FrameSampler`;
- `KeyboardInputService` owns keyboard acquisition;
- `MouseMovementService` owns Mouse DPI movement/Pointer Lock acquisition;
- `MouseInputService` owns ordinary Mouse/Mouse Polling acquisition;
- `TouchInputService` owns finger-touch acquisition;
- shared Fullscreen utility is progressive enhancement, not hardware acquisition;
- tool controllers own interpretation/presentation state rather than acquisition services;
- no duplicate native acquisition loops/listeners without an explicit new capability boundary;
- pure helpers/renderers do not import browser acquisition services;
- cleanup covers rAF, listeners, timers, locks/capture, fullscreen observers, and bfcache-relevant lifecycle;
- no unnecessary framework/backend/database/runtime dependency;
- locale strings are injected/selected explicitly rather than read from a mutable global locale singleton.

## 8. SEO / information architecture

- unique title/meta/H1 per search landing;
- one real job/intent per route;
- primary tool remains above the fold where its device-class gate applies;
- explanatory static HTML supports rather than delays the tool;
- canonical origin is `https://hardwareinspect.com`;
- sitemap/robots reflect the current production configuration;
- no synonym/thin routes;
- only implemented routes are linked as live tools;
- homepage and related-tool navigation remain scannable as the catalog grows;
- localized alternates use self canonicals + reciprocal hreflang;
- English root routes remain stable;
- translated slugs are not introduced in localization v1.

## 9. Performance

- fast initial interaction;
- no large unnecessary runtime;
- no primary-tool layout shift;
- no decorative payload bloat;
- bounded histories/trails/sample buffers;
- avoid avoidable DOM churn in measurement hot paths;
- no per-sample DOM writes in high-frequency polling/timing paths;
- localization must not introduce a heavy runtime i18n framework when static typed data is sufficient.

## 10. Accessibility

- keyboard navigation;
- visible focus;
- real form/control labels;
- no color-only state;
- textual/numeric equivalents for functional visualizations where needed;
- status/result announcements are useful rather than noisy;
- `touch-action: none` only on the active touch diagnostic surface;
- no global keyboard `preventDefault()` to force reserved shortcuts;
- responsive reordering must preserve a sensible reading/focus order;
- translated labels/ARIA/live-region copy remain understandable and correctly associated.

## 11. Privacy

- raw hardware/input streams remain local;
- privacy copy matches reality;
- raw gamepad/device identifiers are not displayed, stored, or sent;
- raw mouse/touch/pointer/key/frame streams are not sent to analytics;
- locale preference may be stored only if implemented transparently and without changing the raw-input privacy boundary.

## 12. QA workflow

For a coherent maintenance block:

```text
implementation
→ self-review #1
→ review fixes
→ visual / UX review
→ visual / UX fixes
→ self-review #2 on final diff
→ review fixes
→ build / typecheck / tests / CI
→ validation fixes and rerun until green
→ squash merge
```

If a validation fix changes semantics or UX, re-review the impacted part. Compile/test-only corrections do not require restarting unrelated review work.

For localization, sample every device family in every locale rather than validating only one translated page.

## 13. Exact-boundary compliance

- global/full-v1 dependency and measurement behavior matches `18_DECISIONS_AND_BOUNDARIES.md`;
- Expansion 1 exact behavior matches `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`;
- localization behavior matches `22_LOCALIZATION_SPEC.md`;
- scope/release decisions match `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`;
- no arbitrary result thresholds are invented outside source-of-truth;
- standard/non-standard gamepad behavior matches the approved boundary;
- display timing routes respect `FrameSampler` ownership/reset semantics;
- DPI never claims physical progress it cannot observe;
- visual zooms are labelled so they do not overstate magnitude;
- Touch coverage never manufactures measured cells via interpolation/clamping;
- Mouse Polling never claims true USB/hardware sample rate;
- Rollover/Ghosting never overclaim hardware certification;
- Dead Pixel/Backlight remain visual inspection rather than automatic diagnosis;
- Frame Skipping never claims browser-only automatic detection;
- translated wording never increases certainty beyond the owning English measurement contract.
