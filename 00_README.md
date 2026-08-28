# Hardware Testing — Agent Handoff v6.3

## Purpose

Build a lightweight browser-only hardware diagnostics website made of small, focused tools.

This is not a dashboard, benchmark suite, hardware portal, or generic SaaS product.

Each page must solve one concrete job immediately in the browser.

Current product clusters:

- Gamepad / Controller testing
- Mouse diagnostics
- Display diagnostics
- Keyboard diagnostics
- Touch diagnostics in approved Expansion 1

## Global product/business goal

This is intended to become a low-maintenance organic-search utility asset, not a SaaS product.

Primary acquisition is search. Initial content/keyword targeting is English with a US search-market focus, while the tools themselves should remain globally usable.

The long-term monetization hypothesis is display advertising after meaningful organic traffic exists.

Therefore the project optimizes for:

```text
useful search landing pages
fast task completion
very low operating cost
very low maintenance
Search Console feedback
safe expansion into adjacent validated tools
```

It does not optimize for accounts, subscriptions, artificial dwell time, feature depth, or a large application architecture.

## Agent entry point

Coding agents should begin with `AGENTS.md`.

`README.md` is the short human-facing project entry point.

## Highest-priority requirement: obvious, one-screen UX

The most important product requirement is not feature count. It is task clarity.

A first-time visitor arriving from search should understand what to do within a few seconds and be able to perform the main test without reading documentation.

On desktop-relevant tools, the primary interaction must fit into one viewport.

Target acceptance viewport:

```text
1366 × 768 minimum desktop target
1440 × 900 preferred target
```

At those sizes, after the compact site header, the user should be able to see:

```text
H1
one short instruction
the complete primary interaction
the primary result area
```

without scrolling where the device class makes that requirement appropriate.

Long explanations, limitations, FAQs, SEO copy, related tools, and technical details belong below the primary tool.

The primary tool may be visually rich when the visual directly represents the measurement. Prefer one meaningful live visualization over several metric cards.

Touch Screen Test is explicitly mobile/tablet oriented and follows the route-specific mobile-first acceptance rules in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` rather than forcing a desktop-sized diagnostic surface into one viewport.

## Default page shape

```text
Compact header

H1
one-sentence instruction

┌──────────────── PRIMARY TOOL ────────────────┐
│ one obvious task                             │
│ one primary action if an action is needed    │
│ immediate feedback                           │
│ key result in the same region                │
└──────────────────────────────────────────────┘

Below the fold:
- what the result means
- limitations
- how it works
- FAQ / problem-first content
- related tools
```

## Simplicity rule

If information does not help the user perform the current test or interpret the primary result, it should not be visible in the main tool by default.

Do not turn diagnostic pages into dashboards.

## Core constraints

- Static frontend first
- TypeScript
- Native browser APIs
- No backend unless explicitly approved by a future evidence-backed scope change
- No database
- No user accounts
- No authentication
- No paid external API dependency
- No AI features
- No device fingerprinting
- Raw measurements remain local
- No false claims of hardware precision
- No unnecessary libraries
- No visual or feature complexity that delays the primary task

## Recommended stack

- Astro
- TypeScript
- small framework-free interactive modules
- native browser APIs
- small typed browser capability service/adapter boundaries
- SVG where visual device feedback is useful
- Canvas only when repeated drawing clearly benefits from it
- static hosting

React is not required.

Approved full-v1 toolchain is fixed in `18_DECISIONS_AND_BOUNDARIES.md` and `11_IMPLEMENTATION_PLAN.md`.

## Full v1 routes — complete in code

```text
/
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test
/mouse-dpi-test
/fps-test
/refresh-rate-test
/keyboard-tester
/about
/privacy
```

## Post-v1 Hardware Expansion 1 — approved after independent review

Exact implementation contract:

```text
20_POST_V1_HARDWARE_EXPANSION_SPEC.md
```

Approved sequential additions:

```text
/mouse-tester
/mouse-button-test
/mouse-scroll-test
/double-click-test
/mouse-polling-rate-test
/touch-screen-test
/keyboard-rollover-test
/keyboard-ghosting-test
/dead-pixel-test
/backlight-bleed-test
/frame-skipping-test
```

These routes were promoted based on completed search/SERP research and/or material cluster fit. Do not reclassify them as unvalidated backlog during implementation.

The initial E1.0 docs approval was followed by **E1.0.1 independent review corrections** before product code. Those corrections made polling source selection, Touch coverage/pass semantics, hands-off lifecycle, Frame Skipping capture epochs, and normative cross-document ownership deterministic.

Current next step:

```text
E1.1 Mouse foundation + Mouse Tester
```

Expansion 1 is additive: do not redesign completed full-v1 tools merely for aesthetic uniformity.

## Document map

- `README.md` — short human-facing project entry point
- `AGENTS.md` — mandatory coding-agent bootstrap
- `01_PRODUCT.md` — product and UX priorities
- `02_INFORMATION_ARCHITECTURE.md` — routes and page relationships
- `03_TOOL_SPECS.md` — exact full-v1/MVP tool behavior
- `04_UX_UI.md` — strict interaction/layout rules
- `05_SEO_CONTENT.md` — SEO/content rules
- `06_ARCHITECTURE.md` — base technical architecture
- `07_BROWSER_APIS.md` — API limitations and approved capability ownership
- `08_ANALYTICS.md` — analytics/privacy measurement plan
- `09_TESTING_QA.md` — base QA rules plus Expansion 1 cross-reference
- `10_PERFORMANCE_ACCESSIBILITY.md` — performance/accessibility
- `11_IMPLEMENTATION_PLAN.md` — historical full-v1 development sequence
- `12_LAUNCH_PLAN.md` — launch checklist for whichever approved routes are released
- `13_AGENT_RULES.md` — mandatory agent constraints
- `14_DEFINITION_OF_DONE.md` — base/project acceptance criteria
- `15_BACKLOG.md` — still-deferred scope plus promoted-history note
- `16_UX_ACCEPTANCE.md` — explicit global UX acceptance tests and mobile-first exception rules
- `17_FUNCTIONAL_VISUAL_SYSTEM.md` — functional beauty and visual language
- `18_DECISIONS_AND_BOUNDARIES.md` — exact global/full-v1 technical/product boundaries and measurement algorithms
- `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` — business/SEO goals, approved scope, launch sequence, and expansion priorities
- `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` — exact approved Expansion 1 behavior, algorithms, QA, and implementation order
- `RESEARCH_EVIDENCE_2026-08.md` — non-normative research snapshot behind initial full-v1 selection

## Browser API acquisition layer

Do not access browser APIs ad hoc from many UI modules.

Full-v1 capability boundaries:

```text
GamepadService
FrameSampler
KeyboardInputService
MouseMovementService
```

Expansion 1 additionally approves:

```text
MouseInputService
TouchInputService
```

and one shared progressive-enhancement helper:

```text
Fullscreen helper
```

These wrappers exist only to centralize feature detection, native listeners/polling, normalization, subscriptions, lifecycle, and cleanup.

Tool-specific state and interpretation remain in controllers/pure helpers. Do not turn this into repositories, dependency injection, a generic event bus, a global `HardwareManager`, or an abstract device framework.

## Source-of-truth rule

Normative implementation requirements are the numbered product documents `00_...` through `20_...` plus `project-manifest.json`, with the priority below.

For scope/release decisions use `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`.

For global/full-v1 exact implementation behavior use `18_DECISIONS_AND_BOUNDARIES.md`.

For approved post-v1 Hardware Expansion 1 exact behavior use `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

If `18`, `19`, and `20` appear to conflict on a shared boundary, stop and resolve the documentation conflict rather than guessing.

The following files are explicitly non-normative review/research history and must not be treated as implementation requirements:

- `AUDIT_V4.md`
- `GLOBAL_GOAL_AUDIT_V5.md`
- `RESEARCH_EVIDENCE_2026-08.md`
