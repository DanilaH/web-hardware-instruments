# Hardware Testing Browser Utilities

A lightweight, browser-only hardware diagnostics website built as a low-maintenance SEO utility asset.

Phase 0 foundation is implemented. The current vertical slice implements `GamepadService` + `/gamepad-tester` and is the mandatory visual checkpoint before any other diagnostic page is built.

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

`00_README.md` remains the full v6.1 handoff index.

## Current implementation sequence

```text
Phase 0 foundation — complete
GamepadService — implemented
/gamepad-tester — implemented, awaiting human visual/hardware review
→ STOP
→ review at 1366×768 and 1440×900
→ only after approval continue to FrameSampler + FPS/Refresh
```

Do not propagate the current spacing, palette, controller geometry, or other visual decisions to later tools before the human checkpoint passes.

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
pnpm 11
Astro
Astro check
TypeScript 6.x while Astro check requires its programmatic API
Vitest
Playwright only when a critical browser-flow test requires it
```

Commands:

```text
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm test
```

The production origin is intentionally still the reserved `https://hardware-testing.invalid` value in `src/config/site.ts`.

Site-wide indexing is also disabled there with `indexingEnabled: false`. Before the first production release, set the real production origin and enable indexing in the same reviewed change. While indexing is disabled, pages receive `noindex`, the sitemap integration is disabled, and `robots.txt` disallows crawling.

## Validation boundary for Gamepad Tester

Automated tests can validate normalization, lifecycle, semantic mapping, build, and type safety. They do **not** replace real controller QA.

Before approving the Gamepad Tester checkpoint, manually verify where hardware is available:

- a standard Xbox-style controller;
- a PlayStation-style controller if available;
- a generic/non-standard controller if available;
- multiple controllers;
- reconnect/disconnect behavior;
- buttons, triggers, D-pad, and both sticks.

## Non-normative history

These files are review history only and must not be treated as implementation requirements:

- `AUDIT_V4.md`
- `GLOBAL_GOAL_AUDIT_V5.md`

`RESEARCH_EVIDENCE_2026-08.md` records the SEO/business evidence behind the initial tool selection. It is context, not an implementation specification.
