# UI Consistency Contract

Status: normative for the current cross-tool UI consistency pass.

This document refines `17_FUNCTIONAL_VISUAL_SYSTEM.md` for interaction geometry, action hierarchy, result stability, and cross-tool consistency. It does not replace per-tool measurement behavior in `18_DECISIONS_AND_BOUNDARIES.md` or `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

If this document conflicts with an older screenshot, handoff, implementation detail, or older visual guidance on the same consistency question, this document wins.

## Goal

The goal is not to make all 18 tools use one layout.

The goal is:

> The same UI concept should behave and look predictably across Hardware Tests, while differences between tools must be justified by the diagnostic job rather than by implementation history.

A user moving between related tools should already understand:

- where current status is shown;
- which action is primary;
- how setup controls align;
- what Reset means and how prominent it is;
- where results appear;
- whether a state change will move the workspace.

Consistency is required for equivalent interaction semantics, not for unrelated diagnostic workflows.

## Core rules

- Standardize equivalent primitives and equivalent archetypes, not entire tools.
- Normal setup controls and standard actions use a 44px-equivalent block size unless the diagnostic interaction genuinely requires otherwise.
- Neighboring controls intended to form one row must align within 1px in height and vertical position in the tested browser environment.
- Primary / secondary / quiet action hierarchy is semantic and independent of hardware-family color.
- Family styling may change accent/identity, not invent control geometry.
- Equivalent Reset actions inside the same archetype use the same quiet-action treatment and intentional target geometry.
- Prefer changing result content over moving the workspace. Reserve a stable result location where practical.
- Do not shrink primary finger-operated controls on mobile merely to fit more controls in one row. Prefer wrapping.

## Minimal primitives

Do not build a generic component framework for this pass.

Start with the smallest shared CSS contract needed to prevent drift:

```text
--tool-control-height
.tool-control
.tool-action
.tool-action--primary
.tool-action--secondary
.tool-action--quiet
```

Additional shared primitives should be added only after repeated implementation proves they reduce duplication without hiding tool-specific behavior.

Do not create a large `ToolLayout` / `ToolControls` abstraction merely to force visual similarity.

## Tool archetypes

### Passive live observation

Typical anatomy:

```text
status
instruction
interactive / diagnostic surface
stable result or observation area
note / caveat
```

Examples: Gamepad Tester, Mouse Tester, Mouse Button Test, Keyboard Tester, FPS Test, Refresh Rate Test.

Do not add artificial Start buttons to passive tools.

### User-start measurement

Typical anatomy:

```text
status
instruction
setup + primary action
measurement surface and/or stable result
caveat
```

Examples: Controller Stick Drift Test, Controller Deadzone Test, Mouse Polling Rate Test, Mouse DPI Test, Keyboard Ghosting Test.

Do not change working measurement flows only to force one universal layout.

### Guided inspection / physical workflow

These may use substantially different anatomy because the diagnostic job is different.

Examples: Dead Pixel Test, Backlight Bleed Test, Frame Skipping Test, Touch Screen Test.

Frame Skipping remains a camera-assisted guided procedure and must not be forced into a generic measure/result card pattern.

## Current priorities

### P1 — shared geometry

- Establish standard control/action geometry.
- Normalize native input/select/button box sizing.
- Keep family identity separate from interaction geometry.

### P1 — Mouse family

Mouse currently has the largest visible implementation drift.

#### Mouse Tester + Mouse Button Test

- Same quiet Reset treatment.
- Compatible result-header geometry.
- Same target size, typography, hover/focus behavior, and spacing for equivalent actions.
- Preserve different information density where the focused Mouse Button job needs it.

#### Mouse Scroll Test + Double Click Test

- Make reset placement and hierarchy predictable between the two.
- Do not leave equivalent Reset actions as unrelated page-specific text controls.
- Keep diagnostic surfaces specific to their jobs.

#### Mouse Polling Rate Test

- Keep the current workflow and measurement semantics.
- Normalize standard action geometry.
- Remove family-level geometry overrides that exist only because there was no shared control contract.

#### Mouse DPI Test

- Keep workflow and movement surface.
- Normalize input/select/button geometry and alignment.
- Do not alter the DPI algorithm.

### P1 — Keyboard Ghosting

Required fixes:

1. Combination select and Start test button resolve to the same height and row alignment.
2. Remove the mobile completion reorder that moves the result above the keyboard after the test.
3. Keep a stable result slot with idle/running/complete content states where practical.
4. Preserve measurement semantics and browser/OS caveats.

Keyboard Tester remains passive. Keyboard Rollover should only receive action-hierarchy cleanup where justified.

### P1 — Touch Screen Test

- Preserve the current coherent multi-action layout.
- Do not reduce the main finger-operated action targets below the standard touch target on mobile just to save space.
- Prefer wrapping.
- Keep Check missed areas primary and maintain clear hierarchy for Reset, Full screen, and the hands-off flow.
- Preserve coverage and hands-off measurement semantics exactly.

### P2 — Controller

Controller tools are not redesign targets by default.

Normalize proven geometry/alignment defects only.

Controller Deadzone may be a useful reference for a compact user-start flow, but it is not a mandatory template for Stick Drift. Do not move Stick Drift actions merely for theoretical symmetry; re-evaluate only after higher-priority fixes and a new catalog review.

### Display

Display is not an active redesign target for this pass.

Dead Pixel and Backlight Bleed already form a coherent inspection pair. FPS, Refresh Rate, and Frame Skipping have intentionally different anatomy. Only fix concrete defects found during final QA.

## Explicit non-goals

This pass must not:

- redesign the approved visual identity;
- add a UI framework or large generic component system;
- add React/Vue/Svelte/Tailwind;
- change URLs or SEO intent boundaries;
- alter measurement algorithms or browser services;
- strengthen hardware claims;
- add Start actions to passive tools;
- force every Reset into one absolute location across all archetypes;
- make FPS, Refresh Rate, Frame Skipping, Dead Pixel, and Touch share one generic layout;
- add screenshot-regression infrastructure by default;
- introduce Playwright into mandatory CI before there is evidence it is needed.

## Implementation sequence

### Phase 1 — minimal consistency foundation

Introduce the smallest shared geometry/action contract needed to remove drift:

- standard control height;
- normalized setup-control box sizing;
- primary / secondary / quiet action semantics;
- shared geometry inherited by family layers;
- no large layout changes.

### Phase 2 — Mouse family normalization

Normalize Mouse Tester, Mouse Button Test, Mouse Scroll Test, Double Click Test, Mouse Polling Rate Test, and Mouse DPI Test.

Focus on Reset behavior, result/action anatomy, control geometry, and predictable hierarchy. Do not change intent or measurement behavior.

### Phase 3 — Keyboard + Touch stabilization

Keyboard:

- fix Ghosting control alignment;
- remove Ghosting result reorder/layout jump;
- normalize action hierarchy where justified;
- leave Keyboard Tester passive.

Touch:

- keep mobile action targets finger-appropriate;
- retain the coherent action-row behavior.

Controller receives only proven alignment fixes unless a post-normalization review shows a genuine UX defect.

### Phase 4 — cold catalog QA

Build production output and review all 18 tool routes.

Required viewport coverage:

```text
1366×768 desktop
390px mobile
representative 320px narrow mobile
```

Check:

- neighboring control heights and vertical alignment;
- action hierarchy;
- Reset consistency within archetypes;
- result stability before/after state changes;
- page-level horizontal overflow;
- first-screen usability;
- mobile touch targets;
- justified vs accidental differences.

Do not change already-coherent tools merely because they are included in QA.

### Phase 5 — decide whether automation is justified

Do not assume a browser-layout CI gate is required.

After normalization, assess regression risk. If the shared CSS contract and low-change pre-launch state are sufficient, stop. If later development repeatedly reintroduces geometry drift, add a small browser consistency smoke for explicit invariants only. Do not add full screenshot regression infrastructure for this requirement alone.

## Definition of Done

### Interaction geometry

- Equivalent normal controls use shared standard geometry.
- Neighboring setup/action controls in one row align within 1px in the tested browser environment.
- No accidental page-specific primary-action sizing remains where the standard control is appropriate.
- Mobile finger-oriented primary actions remain at least 44px-equivalent where appropriate.

### Hierarchy

- Primary, secondary, and quiet actions are distinguishable by semantic importance.
- Family color changes identity/accent, not action meaning.
- Equivalent Reset actions inside the same archetype share visual treatment and target geometry.

### Layout stability

- Normal result updates change content rather than unnecessarily reordering the workspace.
- Keyboard Ghosting no longer performs the current large mobile result/keyboard reorder after completion.
- Dynamic result regions reserve stable placement where practical.

### Cross-tool consistency

Opening related tools in sequence should feel like one product, especially:

```text
Mouse Tester
→ Mouse Button Test
→ Mouse Scroll Test
→ Double Click Test
→ Mouse Polling Rate Test
→ Mouse DPI Test
```

Different diagnostic jobs may retain different anatomy when the difference is functionally justified.

### Regression safety

- all 18 tool routes reviewed on 1366×768;
- all 18 tool routes reviewed on 390px;
- representative narrow-mobile review around 320px;
- no new page-level horizontal overflow;
- first-screen usability is not degraded merely to achieve symmetry;
- measurement behavior and wording boundaries remain unchanged unless separately approved;
- Build, Typecheck, and Tests are green.

## Decision test for future changes

When adding or changing a tool control, ask:

```text
Is this interaction genuinely different,
or is this page inventing a new pattern for an existing concept?
```

If the concept already exists elsewhere, reuse its semantics and geometry.

If the diagnostic job truly differs, document the reason for the divergence rather than forcing false consistency.
