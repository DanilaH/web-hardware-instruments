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

## Phase 4 — First production launch

Build the homepage as a compact directory of the working tools.

First production release contains:

```text
/
/gamepad-tester
/fps-test
/refresh-rate-test
/mouse-dpi-test
/about
/privacy
```

Before launch:

- concise below-fold content where useful;
- SEO metadata/canonicals;
- full UX review;
- real-device smoke for tools in the current release;
- production build;
- Search Console setup;
- sitemap submission.

Do not publish placeholder links for the remaining full-v1 tools.

The purpose of this release is to begin crawl/indexing/Search Console feedback as early as possible.

## Phase 5 — Controller diagnostics

Reuse `GamepadService`.

Build:

```text
/controller-stick-drift-test
/controller-deadzone-test
```

Keep them narrow. No advanced dashboard.

After each page is production-ready:

- add it to homepage/internal linking;
- add it to sitemap;
- deploy it;
- let Search Console begin collecting data.

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
- real-device smoke;
- accessibility review;
- performance review;
- SEO crawl;
- internal-link review.

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
