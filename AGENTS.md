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

Use `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` for business goals, scope, and release order.

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

Expected scripts after scaffolding:

```text
pnpm dev
pnpm build
pnpm typecheck
pnpm test
```

## Current task order

Do not build the entire catalog in parallel.

```text
Phase 0 foundation
→ GamepadService
→ /gamepad-tester
→ STOP
→ human visual review at 1366×768 and 1440×900
```

Only after the Gamepad Tester visual checkpoint is approved should the design language be propagated to the remaining tools.

## Non-normative documents

Do not use these as product requirements:

- `AUDIT_V4.md`
- `GLOBAL_GOAL_AUDIT_V5.md`
- `RESEARCH_EVIDENCE_2026-08.md`

They are review/research context only.
