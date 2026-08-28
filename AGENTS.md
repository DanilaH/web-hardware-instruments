# Agent Instructions

These instructions are mandatory for coding agents working in this repository.

## 1. Source-of-truth order

Before changing product code, read the documents that own the affected decision.

Start with:

1. `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` — durable product strategy, current scope, expansion rule, deployment/release boundary;
2. `18_DECISIONS_AND_BOUNDARIES.md` — global and full-v1 exact algorithms, lifecycle semantics, browser behavior, and technical boundaries;
3. `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` — exact behavior, algorithms, UX, and route-specific QA for the implemented Expansion 1 routes;
4. `13_AGENT_RULES.md` — mandatory engineering/review rules;
5. `16_UX_ACCEPTANCE.md` — interaction and viewport acceptance;
6. `17_FUNCTIONAL_VISUAL_SYSTEM.md` — durable visual-system rules;
7. `14_DEFINITION_OF_DONE.md` — code-complete and release-ready gates.

Supporting references when relevant:

- `03_TOOL_SPECS.md` — original full-v1 route contracts;
- `06_ARCHITECTURE.md` — current architecture shape and dependency direction;
- `07_BROWSER_APIS.md` — browser capability/measurement notes;
- `05_SEO_CONTENT.md` — durable SEO/content rules;
- `02_INFORMATION_ARCHITECTURE.md` — current catalog/navigation model;
- `12_LAUNCH_PLAN.md` — pre-release execution checklist;
- `11_IMPLEMENTATION_PLAN.md` — completed implementation history plus maintenance workflow.

If `18`, `19`, and `20` appear to conflict on shared architecture, privacy, lifecycle, measurement honesty, browser behavior, or scope, stop and report the conflict. Do not guess or invent a compromise.

The old E1.0 → E1.7 order is completed development history. It is **not** a current instruction to keep implementing Expansion 1 stages.

## 2. Mandatory product and architecture boundaries

- Astro static output.
- Strict TypeScript with `noUncheckedIndexedAccess`.
- Plain CSS / CSS custom properties / Astro-scoped styles.
- Native browser APIs through the approved thin capability services/helpers.
- No React, Vue, Svelte, Tailwind, component library, chart library, global state library, backend, database, auth, AI, WebHID, Docker, or speculative architecture without an explicit approved need.
- Do not invent measurement semantics, thresholds, filters, sample durations, accuracy claims, or hardware-health verdicts.
- Do not create placeholder or coming-soon indexable pages.
- One page = one real user job/search intent.
- Primary interaction must satisfy the applicable one-screen/device-class UX acceptance rules.
- Raw hardware/input streams remain local and must not be sent to analytics.

Approved acquisition boundaries:

```text
GamepadService
FrameSampler
KeyboardInputService
MouseMovementService
MouseInputService
TouchInputService
```

The shared Fullscreen utility is a progressive-enhancement helper, not a hardware acquisition service.

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
```

Report honestly what was not validated on real hardware.

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

The current implemented catalog contains 18 code-side-audited tools.

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

Full v1 and Hardware Expansion 1 are implementation-complete and code-side audited. The E1.0 → E1.7 sequence is retained in historical/supporting documents only to explain how the catalog was built and reviewed.

There is no approved E1.8.

Reviewed maintenance may touch any current route when it preserves that route's user job, exact measurement contract, privacy boundary, and architecture ownership. Correctness, accessibility, IA, SEO, maintainability, and UX polish are legitimate cross-catalog maintenance work.

New product scope outside the current catalog still requires fresh evidence under `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` and a reviewed exact contract before implementation.

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

Use `18` and `20` for the exact formulas/state machines.

## 7. Styling and visual boundaries

The product uses instrument minimalism:

```text
mostly monochrome
+ one restrained live signal accent
+ strong measurement numerals
+ simple technical geometry
+ data/state-driven motion only
```

No decorative gradient washes, glass, neon, gaming chrome, nested dashboard cards, or ornamental charts.

A CSS `linear-gradient()` is allowed when it is only the implementation primitive for a functional technical grid/reference ruling. Judge the rendered purpose, not the CSS function name. See `17_FUNCTIONAL_VISUAL_SYSTEM.md`.

Responsive layouts should preserve task/result proximity rather than mechanically stacking every desktop tile into a long column.

## 8. Lifecycle and cleanup

Every relevant rAF loop, timer, listener, subscription, pointer lock/capture, fullscreen observer/state, and bfcache transition needs an explicit cleanup/restart path.

Browser capability services own acquisition lifecycle. Tool controllers own interpretation and presentation state.

Do not move held sets, counters, heuristic interpretation, or visual state into acquisition services merely for reuse.

## 9. Deployment boundary

Public deployment is intentionally deferred until a real production domain is purchased immediately before release.

Until that release change:

```text
origin = https://hardware-testing.invalid
indexingEnabled = false
```

Do not invent a temporary production origin or enable indexing early.

Do not claim production deployment, Search Console setup, sitemap submission, real-device QA, camera QA, or cross-browser QA that has not actually happened.

`code-complete` and `release-ready` remain separate labels.

Immediately before public deployment, follow `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` and `12_LAUNCH_PLAN.md` for the real-origin, hardware/browser/camera smoke, indexing, deployment, Search Console, sitemap, and production-smoke gates.

## 10. Non-normative historical/research documents

Do not use these as implementation requirements:

- `AUDIT_V4.md`;
- `GLOBAL_GOAL_AUDIT_V5.md`;
- `RESEARCH_EVIDENCE_2026-08.md`.

They are review/research context only.
