# Hardware Tests

A static Astro site with 18 lightweight browser-based hardware diagnostics.

Production domain: `https://hardwareinspect.com`.

The product is designed as a low-maintenance, search-landed utility asset: one focused diagnostic per route, no account or install, raw hardware/input data kept local, and no backend/database runtime.

## Current status

The full 18-tool catalog is implemented and code-side audited.

```text
Controller
├── /gamepad-tester
├── /controller-stick-drift-test
└── /controller-deadzone-test

Mouse
├── /mouse-tester
├── /mouse-button-test
├── /mouse-scroll-test
├── /double-click-test
├── /mouse-polling-rate-test
└── /mouse-dpi-test

Keyboard
├── /keyboard-tester
├── /keyboard-rollover-test
└── /keyboard-ghosting-test

Display
├── /fps-test
├── /refresh-rate-test
├── /frame-skipping-test
├── /dead-pixel-test
└── /backlight-bleed-test

Touch
└── /touch-screen-test
```

Supporting public routes:

```text
/
/about
/privacy
```

A post-expansion independent repository audit reconciled the source-of-truth documents, homepage information architecture, selected mobile result/density issues, stale user-facing MVP wording, and focused-Mouse source readability. A later visual-system refresh established the current authored identity across the homepage, shared shell, and all five hardware families.

### Production configuration

Current production configuration is:

```text
origin = https://hardwareinspect.com
indexingEnabled = true
```

Historical references to `hardware-testing.invalid`, deferred domain purchase, and globally disabled indexing describe the pre-launch state and must not be treated as current configuration.

External deployment/Search Console/real-device QA state should still be reported from actual current evidence rather than inferred from the code flag.

### Localization

Localization of the existing 18-tool catalog is approved for the first rollout:

```text
pt-BR
de
fr
es
ru
```

English remains at the current root URLs. Localized pages use locale prefixes while preserving the existing semantic route slugs.

Localization is a presentation/SEO/runtime-message layer over the same diagnostic implementations. Do not copy controllers/services/renderers per language.

Exact localization contract: `22_LOCALIZATION_SPEC.md`.

## Source of truth

Coding agents start with `AGENTS.md`.

Decision ownership:

```text
19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md
  durable product strategy, current scope, localization direction,
  expansion rule, release/deployment boundary

18_DECISIONS_AND_BOUNDARIES.md
  global + original full-v1 exact algorithms, lifecycle,
  browser behavior, technical boundaries

20_POST_V1_HARDWARE_EXPANSION_SPEC.md
  exact behavior, algorithms, UX, and route-specific QA
  for implemented Expansion 1 routes

22_LOCALIZATION_SPEC.md
  approved locales, i18n architecture, localized route/SEO/runtime messages,
  canonical/hreflang behavior, terminology and localization QA

13_AGENT_RULES.md
  mandatory engineering/review rules

16_UX_ACCEPTANCE.md
  interaction and viewport acceptance

17_FUNCTIONAL_VISUAL_SYSTEM.md
  durable visual-system rules

14_DEFINITION_OF_DONE.md
  code-complete, locale-ready and release-ready gates
```

`00_README.md` is the document map/handoff. `11_IMPLEMENTATION_PLAN.md` preserves completed E1.0 → E1.7 development history plus the current maintenance workflow.

The old Expansion 1 sequence is historical context, not an instruction to keep inventing E1 stages. There is no approved E1.8.

## Development

Requirements:

```text
Node.js 24
pnpm 11
```

Install and run:

```bash
pnpm install
pnpm dev
```

Quality checks:

```bash
pnpm build
pnpm typecheck
pnpm test
```
