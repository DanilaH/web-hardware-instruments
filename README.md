# Hardware Testing Browser Utilities

A lightweight, browser-only hardware diagnostics website built as a low-maintenance SEO utility asset.

Phase 0, Gamepad Tester, and the display-core slice are implemented. The current implementation slice is `MouseMovementService` + `/mouse-dpi-test`. Real-device/browser smoke remains a pre-launch validation boundary where explicitly documented below.

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
GamepadService + /gamepad-tester — complete
human visual checkpoint — approved
FrameSampler + /fps-test + /refresh-rate-test — complete

current slice:
MouseMovementService
→ /mouse-dpi-test
→ review

next only after this slice is accepted:
first production launch
```

Do not start Drift, Deadzone, or Keyboard work before the first production release gate is handled.

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

Automated tests validate normalization, lifecycle, semantic mapping, build, and type safety. They do **not** replace real controller QA.

Before production launch, manually verify where hardware is available:

- a standard Xbox-style controller;
- a PlayStation-style controller if available;
- a generic/non-standard controller if available;
- multiple controllers;
- reconnect/disconnect behavior;
- buttons, triggers, D-pad, and both sticks.

## Validation boundary for display tests

Automated tests validate `FrameSampler` lifecycle/reset behavior and the exact FPS/Refresh Rate formulas, rolling windows, median rules, and common-mode threshold. A headless Chrome smoke also confirmed live measurement transitions and target-layout integrity at approximately 60 Hz on 1366×768, 1440×900, and 390×844.

That does **not** replace manual display/browser QA. Before production launch, verify where possible:

- at least one 120/144 Hz display path in addition to 60 Hz;
- moving the page between monitors with different refresh rates;
- background/foreground reset and fresh warmup behavior;
- latest Chrome, Edge, and Firefox desktop;
- Safari graceful behavior where available;
- power-saving / variable-refresh conditions when practical.

Do not claim high-refresh, multi-monitor, or cross-browser validation until those checks are actually performed.

## Validation boundary for Mouse DPI Test

Automated tests validate capture-mode fallback, movement acquisition lifecycle, cancellation semantics, distance conversion, and the DPI formula. They do **not** prove physical mouse-distance accuracy or cross-browser Pointer Lock behavior.

Before production launch, manually verify where possible:

- raw Pointer Lock with `unadjustedMovement: true` on a supported desktop browser;
- regular Pointer Lock fallback;
- unlocked movement fallback;
- Start activation never finishes the same measurement;
- the next eligible click finishes an active measurement;
- Escape, focus loss, visibility loss, and Pointer Lock loss cancel cleanly;
- cm/in conversion preserves the represented physical distance;
- at least one known-DPI mouse/ruler smoke test.

Do not claim direct hardware DPI access. The result remains `Estimated DPI` in every mode.

## Non-normative history

These files are review history only and must not be treated as implementation requirements:

- `AUDIT_V4.md`
- `GLOBAL_GOAL_AUDIT_V5.md`

`RESEARCH_EVIDENCE_2026-08.md` records the SEO/business evidence behind the initial tool selection. It is context, not an implementation specification.
