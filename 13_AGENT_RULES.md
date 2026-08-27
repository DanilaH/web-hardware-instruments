# Agent Rules

These rules are mandatory.

## 1. UX beats feature count

If an implementation choice makes the primary task harder to understand, do not use it merely because it exposes more data.

The first question is:

```text
Can a new visitor immediately understand what to do?
```

## 2. One-screen primary tool

At 1366×768 desktop, the complete primary interaction and key result/status must fit in one viewport after the compact header.

If it does not fit:

- remove nonessential metrics;
- reduce vertical spacing;
- move details below the fold;
- simplify the visualization.

Do not solve this by making text unreadably small.

## 3. One job / one dominant action

Do not add multiple equal-weight CTAs.

Do not combine neighboring tests into one dashboard.

## 4. Functional beauty is allowed and encouraged

Use visually rich interaction when it directly represents live measurement or physical behavior.

Approved examples:

- controller SVG states;
- stick trails;
- deadzone ring;
- mouse relative-movement guide;
- FPS trace;
- refresh cadence trace;
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
- timing;
- DOM;
- SVG;
- basic math.

## 7. Strict TypeScript

No casual `any`.

Keep calculations pure where practical.

## 8. Cleanup

Every rAF/timer/listener/lock must have cleanup.

## 9. Measurement honesty

Do not turn estimates into exact hardware claims.

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
- gamepad axes;
- frame timestamp arrays;
- device identifiers;

to analytics.

## 13. Performance

Do not ship large runtimes for small interactions.

Tool code should load only where needed.

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

## 15. Before finishing a task

Verify:

```text
build
typecheck
tests
target viewport UX
keyboard accessibility
cleanup
```

Report honestly what was not validated on real hardware.

## 16. Centralize browser capability acquisition

Do not duplicate native browser acquisition across tools.

Use the thin typed service/adapter assigned to the capability:

```text
GamepadService
FrameSampler
KeyboardInputService
MouseMovementService
```

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
- different common-refresh matching tolerances.

Use `18_DECISIONS_AND_BOUNDARIES.md`.

If a measurement requirement cannot be implemented as specified, report the conflict instead of silently changing the product.

## 18. Styling/runtime boundaries

MVP uses plain CSS/CSS variables and Astro-scoped styles.

Do not add:

```text
Tailwind
React/Vue/Svelte
UI/component libraries
chart libraries
global state libraries
CSS-in-JS runtime
```

Functional visual rendering is:

```text
SVG       → controller / radial geometry / mouse guide
Canvas    → FPS / refresh traces
DOM/CSS   → controls / text / keyboard
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

## 20. Respect the deferred deployment boundary

All seven approved full-v1 tools are implemented. Do not reopen the old staged-release sequence or add more tools before the current full-v1 code audit and public-deployment gate are closed.

Until immediately before public deployment:

- keep the reserved placeholder origin;
- keep indexing disabled;
- do not invent a temporary production domain;
- do not claim Search Console/sitemap submission before deployment;
- do not claim real hardware or browser coverage that has not actually been tested.

When a real domain is available, follow `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` and `12_LAUNCH_PLAN.md` for the reviewed origin/indexing change, real-device/browser smoke, deployment, GSC, and sitemap submission.

After launch, choose any additional tool only from fresh research/Search Console evidence. Never create placeholder/coming-soon SEO pages.
