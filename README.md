# Hardware Testing Browser Utilities

A lightweight, browser-only hardware diagnostics website built as a low-maintenance SEO utility asset.

The project is currently in the pre-implementation documentation stage. The approved stack is Astro + strict TypeScript + native browser APIs, with static output and no backend.

## Start here

For product strategy, implementation boundaries, and agent rules, read:

1. `AGENTS.md` — mandatory agent bootstrap and reading order
2. `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` — business, scope, release order
3. `18_DECISIONS_AND_BOUNDARIES.md` — exact implementation behavior and algorithms
4. `13_AGENT_RULES.md` — mandatory coding constraints
5. `16_UX_ACCEPTANCE.md` — UX release gates
6. `03_TOOL_SPECS.md` — tool behavior
7. `06_ARCHITECTURE.md` — project structure and dependency direction
8. `11_IMPLEMENTATION_PLAN.md` — development sequence

`00_README.md` remains the full v6 handoff index.

## Current implementation sequence

```text
Phase 0 — project foundation
→ GamepadService
→ /gamepad-tester
→ human visual review at 1366×768 and 1440×900
→ only then propagate the visual system
```

Do not implement all tools in parallel.

## First production release

```text
/
/gamepad-tester
/fps-test
/refresh-rate-test
/mouse-dpi-test
/about
/privacy
```

Later full-v1 additions:

```text
/controller-stick-drift-test
/controller-deadzone-test
/keyboard-tester
```

## Toolchain

```text
Node.js 24 LTS
pnpm
Astro
Astro check
Vitest
Playwright only when a critical browser-flow test requires it
```

Expected commands after scaffolding:

```text
pnpm dev
pnpm build
pnpm typecheck
pnpm test
```

## Non-normative history

These files are review history only and must not be treated as implementation requirements:

- `AUDIT_V4.md`
- `GLOBAL_GOAL_AUDIT_V5.md`

`RESEARCH_EVIDENCE_2026-08.md` records the SEO/business evidence behind the initial tool selection. It is context, not an implementation specification.
