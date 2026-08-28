# Agent Instructions

These instructions are mandatory for coding agents working in this repository.

## Before implementation

Read these documents before changing product code:

1. `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`
2. `18_DECISIONS_AND_BOUNDARIES.md`
3. `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` when working on Expansion 1
4. `13_AGENT_RULES.md`
5. `16_UX_ACCEPTANCE.md`
6. `03_TOOL_SPECS.md`
7. `06_ARCHITECTURE.md`
8. `11_IMPLEMENTATION_PLAN.md`
9. `14_DEFINITION_OF_DONE.md`

Use `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` for business goals, approved scope, release order, and the deferred-deployment boundary.

Use `18_DECISIONS_AND_BOUNDARIES.md` for global/full-v1 exact implementation behavior, algorithms, lifecycle semantics, fallbacks, and technical boundaries.

Use `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` for exact behavior, algorithms, UX, QA, and implementation order of the approved post-v1 Expansion 1 routes.

If `18`, `19`, and `20` appear to conflict on shared architecture, privacy, lifecycle, measurement honesty, browser behavior, or scope, stop and report the conflict. Do not guess or invent a compromise.

## Mandatory boundaries

- Astro static output.
- Strict TypeScript.
- Plain CSS / CSS custom properties / Astro-scoped styles.
- Native browser APIs through the approved thin capability services/helpers.
- Full-v1 acquisition remains `GamepadService`, `FrameSampler`, `KeyboardInputService`, and `MouseMovementService`.
- Expansion 1 additionally approves `MouseInputService` and `TouchInputService`; the shared Fullscreen utility is a helper, not a hardware acquisition service.
- No React, Vue, Svelte, Tailwind, component library, chart library, global state library, backend, database, auth, AI, WebHID, Docker, or speculative architecture.
- Do not invent measurement semantics, thresholds, filters, sample durations, or accuracy claims.
- Do not create placeholder or coming-soon indexable pages.
- One page = one user job.
- Primary interaction must satisfy the one-screen UX acceptance rules where the device class makes that appropriate.

## Review and validation order

For each implementation block, use this exact sequence:

```text
implementation
→ self-review #1
→ review fixes
→ visual / UX review
→ visual / UX fixes
→ self-review #2 on the final diff
→ review fixes
→ only then run build / typecheck / tests / CI
→ fix any validation failures
→ rerun validation until green
→ merge
```

Do **not** wait for, poll, or use CI/test results while either self-review or the visual/UX review is still in progress. Reviews must be completed from the code/diff/product contract first. Automated validation is the final gate after review findings are closed, not an input to the review process.

If the final validation run finds an error, fix it, rerun the affected review only when the fix changes behavior/architecture/UX materially, then rerun validation. Pure compile/test-only corrections do not require restarting the whole review cycle.

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

All seven approved full-v1 tools and the full-v1 code-side audit are complete:

```text
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test
/mouse-dpi-test
/fps-test
/refresh-rate-test
/keyboard-tester
```

Post-v1 Hardware Expansion 1 is approved for sequential implementation under `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

Approved Expansion 1 routes:

```text
/mouse-tester
/mouse-button-test
/mouse-scroll-test
/double-click-test
/mouse-polling-rate-test
/touch-screen-test
/keyboard-rollover-test
/keyboard-ghosting-test
/dead-pixel-test
/backlight-bleed-test
/frame-skipping-test
```

Completed Expansion 1 stages:

```text
E1.0   source-of-truth approval
E1.0.1 independent review corrections
E1.1   Mouse foundation + Mouse Tester
E1.2   focused Mouse tools
E1.3   Touch Screen Test
```

Implemented Expansion 1 routes so far:

```text
/mouse-tester
/mouse-button-test
/mouse-scroll-test
/double-click-test
/mouse-polling-rate-test
/touch-screen-test
```

E1.0.1 closed the post-approval ambiguities around polling source mixing, Touch observed/coalesced coverage, out-of-surface measurement, confirmation-pass semantics, hands-off visibility/focus invalidation, Frame Skipping capture epochs, and stale normative docs.

E1.1 added the reviewed `MouseInputService`, shared generic semantic mouse visual, and `/mouse-tester`. The service keeps normal Mouse diagnostics separate from the existing Mouse DPI `MouseMovementService`; tool state remains in controllers.

E1.2 added focused Mouse Button, Scroll, Double Click, and Polling Rate routes. The polling profile is sampling-only, selects exactly one browser source per attempt, keeps bounded two-second data, and does not attach unrelated button/wheel suppression.

E1.3 added `TouchInputService`, the progressive Fullscreen helper, `/touch-screen-test`, separate first/confirmation coverage, surface-only multi-touch metrics, and the independently armed hands-off observation. Coverage uses only real in-surface browser-observed/coalesced touch samples; global touch lifecycle is used only where the hands-off guard requires it.

**Next implementation step:**

```text
E1.4 Keyboard expansion
```

Then follow the remaining exact order in `20`:

```text
E1.4 Keyboard expansion
→ E1.5 display visual-inspection tools
→ E1.6 Frame Skipping
→ E1.7 final Expansion 1 audit
```

Do not scaffold the whole catalog at once. Each route/pattern must pass its own review/visual/quality gate before the next pattern is propagated.

Expansion 1 is additive. Existing full-v1 behavior stays stable except for reviewed related-tool/internal-link updates and genuine correctness fixes. Do not refactor full v1 merely to make new code aesthetically uniform.

## Deployment boundary

Until the real production domain is purchased immediately before deployment:

- keep `https://hardware-testing.invalid` as the reserved placeholder origin;
- keep `indexingEnabled = false`;
- do not claim production deployment, Search Console setup, sitemap submission, real-device QA, or cross-browser QA that has not actually happened;
- code-complete and release-ready remain separate labels when real hardware is unavailable.

Immediately before public deployment, follow `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md` and `12_LAUNCH_PLAN.md` for the real-origin, hardware/browser/camera smoke, indexing, deployment, GSC, and sitemap gate.

Expansion work does not authorize unrelated Audio/CPS/dashboard scope.

## Non-normative documents

Do not use these as implementation requirements:

- `AUDIT_V4.md`
- `GLOBAL_GOAL_AUDIT_V5.md`
- `RESEARCH_EVIDENCE_2026-08.md`

They are review/research context only. Search/SERP research used to approve Expansion 1 informs scope, while `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` owns the implementation contract.
