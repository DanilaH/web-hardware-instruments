# Hardware Tests — Documentation Map

This repository contains a static Astro catalog of browser-based hardware diagnostics.

## Current state

The full-v1 catalog, Hardware Expansion 1, localization, and the Hardware Expansion V2 Foundation are **code-side complete and audited**. Expansion V2 is shipping in atomic production-valid waves; Printer Test Page is the first V2 job added after Foundation.

The production origin is configured as:

```text
https://hardwareinspect.com
indexingEnabled = true
```

Do not revert the product to the historical `hardware-testing.invalid` placeholder. Whether every external release step (real-device QA, deployment smoke, Search Console verification, sitemap submission) has been completed must be reported from current evidence rather than inferred from old planning text.

Implemented locales remain `en`, `pt-BR`, `de`, `fr`, `es`, and `ru`. Every registered V2 ToolId must ship atomically across the same six locales under `23_HARDWARE_EXPANSION_V2_SPEC.md` and the routing/i18n architecture of `22_LOCALIZATION_SPEC.md`.

Implemented diagnostic routes after the Printer wave:

```text
Controller
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test

Mouse
/mouse-tester
/mouse-button-test
/mouse-scroll-test
/double-click-test
/mouse-polling-rate-test
/mouse-dpi-test

Keyboard
/keyboard-tester
/keyboard-rollover-test
/keyboard-ghosting-test

Display
/fps-test
/refresh-rate-test
/frame-skipping-test
/dead-pixel-test
/backlight-bleed-test

Touch
/touch-screen-test

Printer
/printer-test-page
```

Supporting routes:

```text
/
/about
/privacy
```

Localization does not create additional diagnostic jobs. English remains at root URLs; localized versions use locale prefixes while preserving the same semantic route slugs.

## Source-of-truth ownership

Use the narrowest document that owns the decision:

```text
19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md
  durable product strategy, scope rule, business model, current deployment/release boundary

18_DECISIONS_AND_BOUNDARIES.md
  durable global + full-v1 exact algorithms, lifecycle, browser behavior

23_HARDWARE_EXPANSION_V2_SPEC.md
  exact Expansion V2 scope, route behavior, new capability boundaries, SEO/copy,
  sequencing and route-specific QA

20_POST_V1_HARDWARE_EXPANSION_SPEC.md
  exact Expansion 1 route behavior, algorithms, wording, route-specific QA

22_LOCALIZATION_SPEC.md
  approved locales, i18n architecture, localized routing/SEO/runtime strings,
  canonical/hreflang behavior and localization QA

16_UX_ACCEPTANCE.md
  cross-tool task-completion and viewport acceptance

17_FUNCTIONAL_VISUAL_SYSTEM.md
  durable visual language and functional-visual rules

13_AGENT_RULES.md
  implementation/review workflow and engineering guardrails

14_DEFINITION_OF_DONE.md
  code-complete / release-ready completion criteria

12_LAUNCH_PLAN.md
  current production, localization-release and verification sequence
```

If two documents appear to conflict on an exact behavior, do not average them. Prefer the document that explicitly owns that route/boundary; if ownership is still ambiguous, resolve the documentation before changing product code.

`23_HARDWARE_EXPANSION_V2_SPEC.md` owns V2 jobs such as Printer Test Page. `22_LOCALIZATION_SPEC.md` still owns locale routing/canonical/hreflang architecture and does not override diagnostic or capability semantics.

## Supporting documents

These documents provide focused reference but do not override the ownership map above:

```text
01_PRODUCT.md                     product framing and user jobs
02_INFORMATION_ARCHITECTURE.md    current catalog structure and linking principles
03_TOOL_SPECS.md                  original full-v1 tool specifications
04_UX_UI.md                       supporting UX/UI framing aligned to the current visual system
05_SEO_CONTENT.md                 durable SEO rules + current intent/localization ownership map
06_ARCHITECTURE.md                architecture detail
07_BROWSER_APIS.md                browser API detail
08_ANALYTICS.md                   analytics boundary
09_TESTING_QA.md                  testing and manual QA detail
10_PERFORMANCE_ACCESSIBILITY.md   performance/accessibility baseline
11_IMPLEMENTATION_PLAN.md         completed implementation history
15_BACKLOG.md                     evidence-gated future opportunities
24_EXPANSION_V2_IMPLEMENTATION_ROADMAP.md
                                  non-normative atomic execution plan for approved V2 scope
```

`03_TOOL_SPECS.md` was written around full v1 and remains useful for those original route contracts. `04_UX_UI.md` preserves durable task-first UX framing but defers exact current visual grammar to `17_FUNCTIONAL_VISUAL_SYSTEM.md`.

## Historical process language

The repository deliberately keeps some development history because it explains why important boundaries exist.

Historical statements about:

- the E1.0 → E1.7 sequential implementation order;
- “do not redesign full v1 during Expansion 1”;
- `hardware-testing.invalid`;
- deferred purchase of a production domain;
- indexing being disabled before launch;

must not be treated as current state when they conflict with the current production configuration and later source-of-truth documents.

Permanent boundaries still apply: measurement honesty, native acquisition ownership, static/low-maintenance architecture, one real job per search landing, evidence-gated future scope, and the exact route algorithms/capability contracts in `18`/`20`/`23`.

## Review and validation workflow

For product changes use:

```text
implementation
→ self-review #1
→ review fixes
→ visual / UX review
→ visual / UX fixes
→ self-review #2 on the final diff
→ review fixes
→ build / typecheck / tests / CI
→ validation fixes if needed
→ rerun until green
→ squash merge
```

Do not use CI as an input to an unfinished code or visual review.

For localization, additionally validate at least:

```text
locale routing
html lang
self canonical
reciprocal hreflang
sitemap presence
localized navigation / related links
localized runtime strings
no English leakage in primary task UI
measurement wording preserved
```

## Validation honesty

Headless/browser-mocked checks are useful for code behavior, state transitions, geometry and locale rendering. They are not proof of real hardware behavior.

Real hardware/browser/camera/printer-output cases required by a route remain separate evidence and must not be fabricated merely because automated checks pass.

## Non-normative review/research context

These files are evidence/history only:

```text
AUDIT_V4.md
GLOBAL_GOAL_AUDIT_V5.md
RESEARCH_EVIDENCE_2026-08.md
```

Do not promote observations from them into product behavior without a reviewed source-of-truth change.
