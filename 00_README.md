# Hardware Tests — Documentation Map

This repository contains a static Astro catalog of browser-based hardware diagnostics.

## Current state

The full-v1 catalog and Hardware Expansion 1 are **code-side complete and audited**.

Implemented diagnostic routes:

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
```

Supporting routes:

```text
/
/about
/privacy
```

Code-complete is intentionally separate from release-ready. The remaining release gate is external: real production domain, required real-device/browser/camera checks, indexing enablement, HTTPS deployment, Search Console, sitemap submission, and final production smoke.

Until then keep:

```text
https://hardware-testing.invalid
indexingEnabled = false
```

## Source-of-truth ownership

Use the narrowest document that owns the decision:

```text
19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md
  durable product strategy, scope rule, business model, release boundary

18_DECISIONS_AND_BOUNDARIES.md
  durable global + full-v1 exact algorithms, lifecycle, browser behavior

20_POST_V1_HARDWARE_EXPANSION_SPEC.md
  exact Expansion 1 route behavior, algorithms, wording, route-specific QA

16_UX_ACCEPTANCE.md
  cross-tool task-completion and viewport acceptance

17_FUNCTIONAL_VISUAL_SYSTEM.md
  durable visual language and functional-visual rules

13_AGENT_RULES.md
  implementation/review workflow and engineering guardrails

14_DEFINITION_OF_DONE.md
  current code-complete / release-ready completion criteria

12_LAUNCH_PLAN.md
  current pre-production and launch sequence
```

If two documents appear to conflict on an exact behavior, do not average them. Prefer the document that explicitly owns that route/boundary; if ownership is still ambiguous, resolve the documentation before changing product code.

## Supporting documents

These documents provide focused reference but do not override the ownership map above:

```text
01_PRODUCT.md                     product framing and user jobs
02_INFORMATION_ARCHITECTURE.md    current catalog structure and linking principles
03_TOOL_SPECS.md                  original full-v1 tool specifications
04_UX_UI.md                       original full-v1 UX/UI framing
05_SEO_CONTENT.md                 durable SEO rules + current intent ownership map
06_ARCHITECTURE.md                architecture detail
07_BROWSER_APIS.md                browser API detail
08_ANALYTICS.md                   analytics boundary
09_TESTING_QA.md                  testing and manual QA detail
10_PERFORMANCE_ACCESSIBILITY.md   performance/accessibility baseline
11_IMPLEMENTATION_PLAN.md         completed implementation history
15_BACKLOG.md                     evidence-gated future opportunities
```

`03_TOOL_SPECS.md` and `04_UX_UI.md` were written around full v1. Their exact full-v1 requirements remain useful, but statements such as “every tool” must not silently override later route-specific exceptions defined in `20`, `16`, or `17`.

## Historical process language

The repository deliberately keeps some development history because it explains why important boundaries exist.

The following are **historical implementation constraints**, not permanent bans on justified maintenance after the completed roadmap:

- the E1.0 → E1.7 sequential implementation order;
- “do not redesign full v1 during Expansion 1”;
- rollout language that describes Expansion 1 as not yet implemented.

They protected the project from parallel scope drift while Expansion 1 was being built. They do **not** prevent a reviewed cross-catalog correctness, accessibility, IA, SEO, or UX polish change now that E1 is complete.

Permanent boundaries still apply: measurement honesty, native acquisition ownership, static/low-maintenance architecture, one real job per search landing, evidence-gated future scope, and the exact route algorithms in `18`/`20`.

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

## Validation honesty

Headless/browser-mocked checks are useful for code behavior, state transitions, and geometry. They are not proof of real hardware behavior.

Real hardware/browser/camera cases required by a route remain release-ready gates until actually performed.

## Non-normative review/research context

These files are evidence/history only:

```text
AUDIT_V4.md
GLOBAL_GOAL_AUDIT_V5.md
RESEARCH_EVIDENCE_2026-08.md
```

Do not promote observations from them into product behavior without a reviewed source-of-truth change.
