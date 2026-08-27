# Agent Instructions

These instructions are mandatory for coding agents working in this repository.

## Before implementation

Read these documents before changing product code:

1. `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`
2. `18_DECISIONS_AND_BOUNDARIES.md`
3. `13_AGENT_RULES.md`
4. `16_UX_ACCEPTANCE.md`
5. `03_TOOL_SPECS.md`
6. `06_ARCHITECTURE.md`
7. `11_IMPLEMENTATION_PLAN.md`
8. `14_DEFINITION_OF_DONE.md`

Use `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` for business goals, scope, release order, and the current deferred-deployment boundary.

Use `18_DECISIONS_AND_BOUNDARIES.md` for exact implementation behavior, algorithms, lifecycle semantics, fallbacks, and technical boundaries.

If `18` and `19` appear to conflict, stop and report the conflict. Do not guess or invent a compromise.

## Mandatory boundaries

- Astro static output.
- Strict TypeScript.
- Plain CSS / CSS custom properties / Astro-scoped styles.
- Native browser APIs through the four approved thin capability services.
- No React, Vue, Svelte, Tailwind, component library, chart library, global state library, backend, database, auth, AI, WebHID, Docker, or speculative architecture.
- Do not invent measurement semantics, thresholds, filters, sample durations, or accuracy claims.
- Do not create placeholder or coming-soon indexable pages.
- One page = one user job.
- Primary interaction must satisfy the one-screen UX acceptance rules.

## Toolchain

Use:

```text
Node.js 24 LTS
pnpm
Astro check for type checking
Vitest for unit tests
```

Playwright is approved only when a critical browser-flow/lifecycle test materially benefits from browser automation. Do not add it merely because it is common in frontend projects.

Expected scripts:

```text
pnpm dev
pnpm build
pnpm typecheck
pnpm test
```

## Current project state

All seven approved full-v1 tools are implemented:

```text
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test
/mouse-dpi-test
/fps-test
/refresh-rate-test
/keyboard-tester
```

The code-side full-v1 audit/polish gate is the final development boundary before public deployment preparation.

Do **not** restart the old staged implementation sequence or create additional tools merely because they are technically possible.

Until the real production domain is purchased immediately before deployment:

- keep `https://hardware-testing.invalid` as the reserved placeholder origin;
- keep `indexingEnabled = false`;
- do not claim production deployment, Search Console setup, sitemap submission, real-device QA, or cross-browser QA that has not actually happened;
- limit further product-code changes to review fixes, correctness issues, or explicitly approved scope.

Immediately before public deployment, follow `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` and `12_LAUNCH_PLAN.md` for the real-origin, hardware/browser smoke, indexing, deployment, GSC, and sitemap gate.

After launch, do not expand the catalog until research/Search Console evidence justifies a specific next tool.

## Non-normative documents

Do not use these as product requirements:

- `AUDIT_V4.md`
- `GLOBAL_GOAL_AUDIT_V5.md`
- `RESEARCH_EVIDENCE_2026-08.md`

They are review/research context only.
