# Hardware Testing — Agent Handoff v6.1

## Purpose

Build a lightweight browser-only hardware diagnostics website made of small, focused tools.

This is not a dashboard, benchmark suite, hardware portal, or generic SaaS product.

Each page must solve one concrete job immediately in the browser.

Initial cluster:

- Gamepad / Controller testing
- Stick drift
- Controller deadzone
- Mouse DPI estimation
- FPS / frame-rate testing
- Refresh-rate estimation
- Keyboard testing

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
early Search Console feedback
safe expansion into adjacent validated tools
```

It does not optimize for accounts, subscriptions, artificial dwell time, feature depth, or a large application architecture.

## Agent entry point

Coding agents should begin with `AGENTS.md`.

`README.md` is the short human-facing project entry point.

## Highest-priority requirement: obvious, one-screen UX

The most important product requirement is not feature count. It is task clarity.

A first-time visitor arriving from search should understand what to do within a few seconds and be able to perform the main test without reading documentation.

On desktop, the primary interaction must fit into one viewport.

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

without scrolling.

Long explanations, limitations, FAQs, SEO copy, related tools, and technical details belong below the primary tool.

The primary tool may be visually rich when the visual directly represents the measurement. Prefer one meaningful live visualization over several metric cards.

Do not optimize for artificial dwell time. Optimize for successful task completion. A clear useful tool naturally creates meaningful engagement.

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

Examples of data that may belong below the fold or in a compact optional “Details” disclosure:

```text
raw axis arrays
raw timing statistics
variance
technical event codes
measurement methodology
```

Do not turn diagnostic pages into dashboards.

## Core constraints

- Static frontend first
- TypeScript
- Native browser APIs
- No backend for MVP
- No database
- No user accounts
- No authentication
- No payment flow
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
- a tiny typed browser capability service/adapter layer
- SVG where visual device feedback is useful
- Canvas only when repeated drawing clearly benefits from it
- static hosting

React is not required.

Approved scaffolding toolchain is fixed in `18_DECISIONS_AND_BOUNDARIES.md` and `11_IMPLEMENTATION_PLAN.md`.

## Full v1 routes

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

These are separate pages because they solve distinct jobs. Do not create additional pages for synonyms.

## Phase 2 only

```text
/dead-pixel-test
/mouse-button-test
/mouse-scroll-test
/double-click-test
/keyboard-rollover-test
/frame-skipping-test
/touch-screen-test
```

Do not implement Phase 2 during MVP unless explicitly requested.

## Document map

- `README.md` — short human-facing project entry point
- `AGENTS.md` — mandatory coding-agent bootstrap
- `01_PRODUCT.md` — product and UX priorities
- `02_INFORMATION_ARCHITECTURE.md` — routes and page relationships
- `03_TOOL_SPECS.md` — exact MVP behavior
- `04_UX_UI.md` — strict interaction/layout rules
- `05_SEO_CONTENT.md` — SEO/content rules
- `06_ARCHITECTURE.md` — technical architecture
- `07_BROWSER_APIS.md` — API limitations
- `08_ANALYTICS.md` — measurement plan
- `09_TESTING_QA.md` — QA
- `10_PERFORMANCE_ACCESSIBILITY.md` — performance/accessibility
- `11_IMPLEMENTATION_PLAN.md` — development sequence
- `12_LAUNCH_PLAN.md` — launch checklist
- `13_AGENT_RULES.md` — mandatory agent constraints
- `14_DEFINITION_OF_DONE.md` — acceptance criteria
- `15_BACKLOG.md` — deferred scope
- `16_UX_ACCEPTANCE.md` — explicit UX acceptance tests
- `17_FUNCTIONAL_VISUAL_SYSTEM.md` — functional beauty and visual language
- `18_DECISIONS_AND_BOUNDARIES.md` — exact technical/product boundaries and measurement algorithms
- `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` — business/SEO goals, launch sequence, and scope priorities
- `RESEARCH_EVIDENCE_2026-08.md` — non-normative research snapshot behind initial tool selection

## Browser API acquisition layer

Do not access browser APIs ad hoc from many UI modules.

Each browser capability should have one very small typed service/adapter that owns acquisition and lifecycle.

```text
GamepadService
    → navigator.getGamepads()

FrameSampler
    → requestAnimationFrame() callback timestamp
    → visibility/reset lifecycle

KeyboardInputService
    → keydown / keyup

MouseMovementService
    → pointer/mouse movement events
```

These wrappers exist only to centralize:

- feature detection;
- native listeners/polling;
- normalization into typed samples;
- subscriptions/callbacks;
- focus/visibility handling where relevant;
- start/stop lifecycle;
- cleanup.

Keep them thin.

Do not turn this into repositories, dependency injection, a generic event bus, a global `HardwareManager`, or an abstract device framework.

## Source-of-truth rule

Normative implementation requirements are the numbered product documents `00_...` through `19_...` plus `project-manifest.json`, with the conflict-resolution priority below.

Use `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` for business/scope/release priorities and `18_DECISIONS_AND_BOUNDARIES.md` for exact implementation behavior. If those two appear to conflict, stop and report the conflict rather than guessing.

The following files are explicitly non-normative review/research history and must not be treated as product requirements:

- `AUDIT_V4.md`
- `GLOBAL_GOAL_AUDIT_V5.md`
- `RESEARCH_EVIDENCE_2026-08.md`
