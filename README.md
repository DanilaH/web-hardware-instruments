# Hardware Testing Browser Utilities

A lightweight, browser-only hardware diagnostics website built as a low-maintenance SEO utility asset.

Phase 0 and the first four production tools are implemented. Public deployment is intentionally deferred until a real domain is purchased. Development continues through the remaining approved full-v1 tools while the placeholder origin and site-wide `noindex` protection remain in place.

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
MouseMovementService + /mouse-dpi-test — complete
code-side first-launch preparation — complete

current development:
/controller-stick-drift-test
→ /controller-deadzone-test
→ /keyboard-tester
→ full-v1 audit

before actual public deployment:
→ buy/set real production domain
→ replace placeholder origin
→ required real-device/browser smoke
→ enable indexing
→ deploy
→ Google Search Console setup
→ submit generated sitemap
```

The deferred deployment gate is not waived. It is moved to the actual deployment boundary so full-v1 implementation can continue without inventing a production domain early.

## Public release routes

Already implemented:

```text
/
/gamepad-tester
/fps-test
/refresh-rate-test
/mouse-dpi-test
/about
/privacy
```

Remaining approved full-v1 additions:

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

The production origin intentionally remains the reserved `https://hardware-testing.invalid` value in `src/config/site.ts` until the real domain is purchased immediately before deployment.

Site-wide indexing remains disabled with `indexingEnabled: false`. While indexing is disabled, pages receive `noindex`, the sitemap integration is disabled, and `robots.txt` disallows crawling. The real origin and `indexingEnabled: true` must be introduced together in one reviewed pre-deployment change.

## Validation boundary for Gamepad Tester

Automated tests validate normalization, lifecycle, semantic mapping, build, and type safety. They do **not** replace real controller QA.

Before public deployment, manually verify where hardware is available:

- a standard Xbox-style controller;
- a PlayStation-style controller if available;
- a generic/non-standard controller if available;
- multiple controllers;
- reconnect/disconnect behavior;
- buttons, triggers, D-pad, and both sticks.

## Validation boundary for display tests

Automated tests validate `FrameSampler` lifecycle/reset behavior and the exact FPS/Refresh Rate formulas, rolling windows, median rules, and common-mode threshold. A headless Chrome smoke also confirmed live measurement transitions and target-layout integrity at approximately 60 Hz on 1366×768, 1440×900, and 390×844.

That does **not** replace manual display/browser QA. Before public deployment, verify where possible:

- at least one 120/144 Hz display path in addition to 60 Hz;
- moving the page between monitors with different refresh rates;
- background/foreground reset and fresh warmup behavior;
- latest Chrome, Edge, and Firefox desktop;
- Safari graceful behavior where available;
- power-saving / variable-refresh conditions when practical.

Do not claim high-refresh, multi-monitor, or cross-browser validation until those checks are actually performed.

## Validation boundary for Mouse DPI Test

Automated tests validate capture-mode fallback, movement acquisition lifecycle, cancellation semantics, distance conversion, and the DPI formula. They do **not** prove physical mouse-distance accuracy or cross-browser Pointer Lock behavior.

Before public deployment, manually verify where possible:

- raw Pointer Lock with `unadjustedMovement: true` on a supported desktop browser;
- regular Pointer Lock fallback;
- unlocked movement fallback;
- Start activation never finishes the same measurement;
- the next eligible click finishes an active measurement;
- Escape, focus loss, visibility loss, and Pointer Lock loss cancel cleanly;
- cm/in conversion preserves the represented physical distance;
- at least one known-DPI mouse/ruler smoke test.

Do not claim direct hardware DPI access. The result remains `Estimated DPI` in every mode.

## Deferred deployment gate

Before any public indexed deployment, all of these remain mandatory:

- a real production origin replaces `https://hardware-testing.invalid`;
- required real-device/browser smoke is completed honestly;
- indexing is enabled only for the real production origin;
- the production property is set up in Google Search Console;
- the generated sitemap is submitted after deployment.

Do not use the reserved `.invalid` origin for a public indexed deployment.

## Non-normative history

These files are review history only and must not be treated as implementation requirements:

- `AUDIT_V4.md`
- `GLOBAL_GOAL_AUDIT_V5.md`

`RESEARCH_EVIDENCE_2026-08.md` records the SEO/business evidence behind the initial tool selection. It is context, not an implementation specification.
