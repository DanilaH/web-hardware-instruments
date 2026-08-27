# Implementation Plan

## Principle

Build the smallest polished search-validating product first.

Do not scaffold seven half-finished tools in parallel.

Every phase must preserve the one-screen UX requirement and the low-maintenance static architecture.

## Phase 0 — Foundation

Deliver only what all pages genuinely need:

- Node.js 24 LTS;
- pnpm;
- Astro;
- strict TypeScript;
- static build;
- base layout;
- compact header/footer;
- CSS custom-property design tokens;
- plain CSS / Astro-scoped styles;
- one reusable ToolShell;
- SEO primitives;
- privacy/about;
- sitemap/robots/404;
- `astro check` exposed as `pnpm typecheck`;
- Vitest exposed as `pnpm test`.

Expected baseline scripts:

```text
pnpm dev
pnpm build
pnpm typecheck
pnpm test
```

Playwright is approved for later critical browser-flow/lifecycle scenarios, but do not add it during scaffolding unless the first implemented test genuinely requires browser automation.

Configure the canonical/site origin through one project configuration point rather than duplicating it across pages.

No Tailwind, component/UI library, chart library, frontend framework, backend, or database.

## Phase 1 — First vertical slice: Gamepad Tester

Build a small typed `GamepadService`, then:

```text
/gamepad-tester
```

This establishes:

- one-screen tool layout;
- device-state UX;
- generic controller visualization;
- cleanup/lifecycle;
- accessibility baseline;
- visual language from `17_FUNCTIONAL_VISUAL_SYSTEM.md`.

Do not propagate the visual system until Gamepad Tester passes:

```text
16_UX_ACCEPTANCE.md
+
human visual review at 1366×768 and 1440×900
```

## Phase 2 — Display core

Build the shared `FrameSampler`, then:

```text
/fps-test
/refresh-rate-test
```

Use the lightweight functional traces defined in the visual-system spec.

Do not add dashboard/chart-library behavior.

## Phase 3 — Mouse DPI

Build `MouseMovementService`, then:

```text
/mouse-dpi-test
```

Keep the flow limited to:

```text
distance
unit
start
movement instruction
relative capture feedback
estimated result
```

## Phase 4 — Public-deployment preparation

Prepare the homepage as a compact directory of working tools and complete the code-side launch review.

The initial implemented release set is:

```text
/
/gamepad-tester
/fps-test
/refresh-rate-test
/mouse-dpi-test
/about
/privacy
```

Code-side launch preparation includes:

- concise below-fold content where useful;
- SEO metadata/canonicals;
- contextual internal links;
- full UX review where automation/hardware permits;
- production build;
- preserving the single-origin/indexing switch.

Public deployment is intentionally deferred until a real domain is purchased. Until then:

- keep the reserved placeholder origin;
- keep indexing disabled;
- do not claim Search Console setup or sitemap submission;
- continue approved full-v1 development.

Immediately before actual public deployment:

- set the real production origin;
- complete required real-device/browser smoke honestly;
- enable indexing in the same reviewed change;
- deploy;
- set up Google Search Console;
- submit the generated sitemap.

Do not publish placeholder links for unfinished tools.

## Phase 5 — Controller diagnostics

Reuse `GamepadService`.

Build:

```text
/controller-stick-drift-test
/controller-deadzone-test
```

Keep them narrow. No advanced dashboard.

Each page must independently pass implementation review, automated validation, and target-layout review before it is considered production-ready in code.

## Phase 6 — Keyboard

Build `KeyboardInputService`, then:

```text
/keyboard-tester
```

Use a compact DOM/CSS keyboard. No debug event table.

## Phase 7 — Full v1 completion

Full v1 now contains all seven approved tools.

Run:

- target viewport UX review;
- browser tests;
- real-device smoke where hardware is available;
- accessibility review;
- performance review;
- SEO crawl;
- internal-link review.

After the code audit, close the deferred deployment gate before any public indexed release.

## Post-launch behavior

Do not immediately implement Phase 2 backlog tools.

Use:

```text
research evidence
+
Search Console impressions/queries
+
actual tool usefulness
```

to choose the next page.

## Algorithm source of truth

Do not invent measurement thresholds or formulas.

Exact MVP algorithms, lifecycle rules, mapping behavior, rendering technology, and fallbacks are defined in `18_DECISIONS_AND_BOUNDARIES.md`.

Release order and business/SEO priorities are defined in `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`.
