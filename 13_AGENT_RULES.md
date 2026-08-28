# Agent Rules

These rules are mandatory.

## 1. UX beats feature count

If an implementation choice makes the primary task harder to understand, do not use it merely because it exposes more data.

The first question is:

```text
Can a new visitor immediately understand what to do?
```

## 2. One-screen primary tool

At 1366×768 desktop, the complete primary interaction and key result/status must fit in one viewport for desktop-relevant tools.

If it does not fit:

- remove nonessential metrics;
- reduce vertical spacing;
- move details below the fold;
- simplify the visualization.

Do not solve this by making text unreadably small.

Touch/mobile-first tools follow their explicit device-class acceptance rules in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

## 3. One job / one dominant action

Do not add multiple equal-weight CTAs.

Do not combine neighboring tests into one dashboard.

## 4. Functional beauty is allowed and encouraged

Use visually rich interaction when it directly represents live measurement or physical behavior.

Approved examples include:

- controller SVG states;
- stick trails;
- deadzone ring;
- mouse relative-movement guide;
- mouse input/button/wheel visual feedback;
- touch coverage/live contacts;
- fullscreen color/black inspection stages;
- FPS/refresh/frame-skipping traces or patterns;
- keyboard key highlighting.

Prefer one meaningful visualization over multiple metrics.

Do not add decorative graphs, history, export, sharing, advanced modes, settings panels, calibration suites, or benchmark scores unless explicitly required.

## 5. No architecture churn

Do not add:

- backend;
- database;
- auth;
- global state library;
- component framework;
- Docker;
- ORM;

without a concrete approved need.

## 6. Prefer native browser APIs

Use native APIs before libraries for:

- Gamepad;
- keyboard;
- pointer/mouse;
- touch;
- timing;
- fullscreen;
- DOM;
- SVG;
- basic math.

## 7. Strict TypeScript

No casual `any`.

Keep calculations pure where practical.

## 8. Cleanup

Every rAF/timer/listener/lock/fullscreen observer must have cleanup.

## 9. Measurement honesty

Do not turn estimates, browser-observed input, visual inspection, or heuristics into exact hardware claims.

## 10. SEO must not damage UX

SEO copy belongs below the primary tool.

Do not move explanatory content above the tool to chase word count.

Do not create synonym pages.

## 11. Accessibility

- visible focus;
- semantic controls;
- icon labels;
- non-color-only state;
- textual result equivalents.

## 12. Privacy

Never send raw:

- key sequences;
- pointer streams;
- touch contact streams;
- gamepad axes;
- frame timestamp arrays;
- device identifiers;

to analytics.

## 13. Performance

Do not ship large runtimes for small interactions.

Tool code should load only where needed.

High-frequency pointer/timing paths must use bounded state and avoid per-sample DOM writes.

## 14. No fake polish

Polish means:

- alignment;
- spacing;
- typography;
- state clarity;
- responsive behavior;
- useful feedback;
- purposeful live visualization;
- data-driven motion.

It does not mean:

- gradients;
- unnecessary animation;
- nested cards;
- decorative charts;
- gaming neon.

## 15. Review before automated validation

Use this order for every implementation block:

```text
implementation
→ self-review #1
→ fixes
→ visual / UX review
→ fixes
→ self-review #2 on final diff
→ fixes
→ build / typecheck / tests / CI
→ validation fixes if needed
→ rerun validation until green
→ merge
```

Do not wait for, poll, or use test/CI results while review work is still in progress. Review the implementation against product behavior, architecture, lifecycle, measurement honesty, accessibility, responsive UX, cleanup, and diff hygiene first.

Only after both reviews are closed should automated validation run as the final code-complete gate.

If validation finds a compile/test failure, fix it and rerun validation. Restart a review pass only when that validation fix materially changes product behavior, architecture, lifecycle, measurement semantics, or UX.

Before merge, verify:

```text
build
typecheck
tests
target viewport UX
keyboard accessibility
cleanup
```

Report honestly what was not validated on real hardware.

`code-complete` and `release-ready` are separate labels when an approved tool requires real touch hardware, a specific mouse/keyboard, or camera evidence.

## 16. Centralize browser capability acquisition

Do not duplicate native browser acquisition across tools.

Full-v1 capability services remain:

```text
GamepadService
FrameSampler
KeyboardInputService
MouseMovementService
```

Post-v1 Hardware Expansion 1 additionally approves:

```text
MouseInputService
TouchInputService
```

The shared Fullscreen utility is a progressive-enhancement helper, not a hardware acquisition service.

Use each boundary only for the capability/job assigned in source-of-truth:

- `MouseMovementService` remains specialized for Mouse DPI / Pointer Lock capture;
- `MouseInputService` owns ordinary mouse buttons/wheel/movement and the explicit polling profile for Expansion 1;
- `TouchInputService` owns finger-touch Pointer Event acquisition for Touch Screen Test.

Required properties:

```text
small
typed
native-API-first
reusable
explicit lifecycle
easy cleanup
```

Forbidden overengineering:

```text
repository layer for browser APIs
global event bus
dependency injection container
service locator
generic HardwareManager
abstract device platform
```

The goal is reuse and lifecycle correctness, not architectural ceremony.

## 17. Do not invent measurement semantics

Do not invent:

- `Good/Bad` drift thresholds;
- `Stable/Unstable` FPS labels;
- alternate deadzone formulas;
- different sample durations;
- fake DPI progress;
- different common-refresh matching tolerances;
- mouse hardware polling/latency claims;
- touch health scores;
- automatic frame-skipping verdicts;
- NKRO/ghosting certification from browser observation.

Use `18_DECISIONS_AND_BOUNDARIES.md` for full-v1/global exact behavior and `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` for Expansion 1 exact behavior.

If a measurement requirement cannot be implemented as specified, report the conflict instead of silently changing the product.

## 18. Styling/runtime boundaries

Use plain CSS/CSS variables and Astro-scoped styles.

Do not add:

```text
Tailwind
React/Vue/Svelte
UI/component libraries
chart libraries
global state libraries
CSS-in-JS runtime
```

Functional visual rendering remains native and purpose-specific:

```text
SVG       → controller / radial geometry / mouse visuals / touch overlays where useful
Canvas    → FPS / refresh traces / frame-skipping pattern
DOM/CSS   → controls / text / keyboard / simple state surfaces
```

## 19. Optimize for low maintenance

Do not introduce:

- scheduled backend jobs;
- external data feeds;
- device databases;
- server-side session state;
- account/support workflows;
- dependencies that require recurring manual data maintenance.

A feature that adds ongoing operational work requires explicit approval.

## 20. Expansion discipline

The Expansion 1 catalog in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` is approved based on completed research and cluster-fit review. Implement it sequentially; do not reclassify it as unvalidated backlog during coding.

This approval does not extend to unrelated Audio/CPS/dashboard features or future tools outside Expansion 1.

The production-domain/indexing gate remains deferred until deployment. Expansion 1 implementation may proceed under the placeholder origin with indexing disabled.

For future scope outside Expansion 1, require research, Search Console evidence, or material value to an already-successful cluster before implementation.
