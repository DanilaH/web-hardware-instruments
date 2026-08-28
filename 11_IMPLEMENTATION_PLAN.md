# Implementation History and Maintenance Plan

This file records the completed implementation sequence and the maintenance workflow that remains relevant after the roadmap.

It is **not** the current product backlog and does not authorize new scope.

## Completed implementation history

### Full v1

The original seven-tool catalog was implemented and code-side audited:

```text
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test
/mouse-dpi-test
/fps-test
/refresh-rate-test
/keyboard-tester
```

That phase established the durable acquisition boundaries:

```text
GamepadService
FrameSampler
KeyboardInputService
MouseMovementService
```

and the product principles of tool-first UX, honest browser-observed measurement, bounded state, and explicit lifecycle cleanup.

### Hardware Expansion 1

Expansion 1 then ran sequentially:

```text
E1.0   source-of-truth approval
E1.0.1 independent review corrections
E1.1   Mouse foundation + Mouse Tester
E1.2   focused Mouse tools
E1.3   Touch Screen Test
E1.4   Keyboard expansion
E1.5   display visual-inspection tools
E1.6   Frame Skipping
E1.7   final Expansion 1 audit
```

All stages are complete.

The sequential order was an implementation-safety mechanism. It prevented a wide parallel scaffold from spreading unreviewed measurement/UX patterns across the catalog. It is now historical process context, not a permanent ban on reviewed cross-catalog maintenance.

Expansion 1 added two approved acquisition boundaries plus one shared progressive-enhancement helper:

```text
MouseInputService
TouchInputService
Fullscreen helper (not an acquisition service)
```

## Lessons that remain binding

The following lessons survived both implementation phases and should guide maintenance:

1. **Measurement semantics come before UI polish.** Do not infer physical hardware facts the browser cannot observe.
2. **One native acquisition owner per capability.** Do not create parallel rAF/input/fullscreen acquisition paths inside tool controllers.
3. **Lifecycle is part of correctness.** Blur, hidden visibility, bfcache, disconnects, locks, capture, timers, and fullscreen must have explicit behavior.
4. **Visual review happens before automated validation.** CI must not substitute for product/code review.
5. **Headless is not hardware QA.** Mocked input validates state/geometry only.
6. **Avoid premature abstractions.** Share a primitive only when multiple real tools need the same responsibility.
7. **Cross-catalog polish is allowed when justified.** Preserve each route's user job and exact measurement contract; do not interpret the old “do not redesign full v1 during E1” guard as a permanent freeze.

## Current maintenance workflow

For each coherent change block:

```text
implementation
→ self-review #1
→ review fixes
→ visual / UX review
→ visual / UX fixes
→ self-review #2 on final diff
→ review fixes
→ build / typecheck / tests / CI
→ validation fixes if needed
→ rerun until green
→ squash merge
```

If validation requires a semantic/UX change, re-review the impacted part. A compile/test-only correction does not require restarting unrelated review work.

## What happens next

There is no automatic “next implementation stage” after E1.7.

Current next work is either:

```text
reviewed maintenance / correctness / UX / IA polish
```

or the external release-ready gate:

```text
real domain
→ real-device/browser/camera validation
→ indexing + deployment
→ Search Console + sitemap
→ production smoke
```

New product scope requires the evidence gate in `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`.
