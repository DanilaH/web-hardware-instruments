# UX Acceptance Tests

This document is a release gate.

Expansion 1 follows these global UX tests plus any route-specific acceptance rules in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`. A route-specific device-class rule may refine the desktop one-screen requirement without weakening task clarity, result clarity, or responsive integrity.

## Test 1 — Three-second comprehension

Open a tool page with no prior context.

Within roughly three seconds, a user should be able to answer:

```text
What is this?
What do I do?
Where will I see the result?
```

If the UI needs explanatory reading to answer these, simplify it.

## Test 2 — One viewport for desktop-relevant tools

At:

```text
1366×768
```

without vertical scrolling, a desktop-relevant tool should show:

- compact header;
- H1;
- one short instruction;
- full primary interaction;
- key status/result region.

Below-the-fold content is excluded from this requirement.

Touch Screen Test is explicitly mobile/tablet oriented. It does not need to force its complete active diagnostic surface into the desktop one-screen shape; it must instead pass the mobile-first acceptance and real-device rules in `20` while remaining fully usable on supported desktop touch hardware.

## Test 3 — One dominant action

Blur/squint test:

Only one control should visually read as the next important action.

If two or more buttons compete, reduce hierarchy.

## Test 4 — No result hunting

Perform the test.

The key result/status must appear:

- inside the same tool area;
- near the interaction;
- without requiring the user to leave the diagnostic surface or hunt through explanatory content.

For long/mobile-first active surfaces, contextual status/metrics should remain visible or predictably placed according to the route-specific design; do not force a desktop-only no-scroll rule that makes the actual touch area unusably small.

## Test 5 — Minimal information

For each visible metric ask:

```text
Does the user need this to perform the test or understand the primary result?
```

If not, remove it from the primary surface.

## Test 6 — Empty/waiting state

A waiting state must say exactly what the user needs to do next.

Good:

```text
Connect a controller and press any button.
```

Bad:

```text
No compatible input source found.
```

For interrupted observation sessions, say why the run cannot be trusted and what to do next. Example for Touch hands-off mode:

```text
Check interrupted — keep this page visible and start again.
```

## Test 7 — Result comprehension

The primary result should be understandable without technical documentation.

Examples:

```text
Estimated refresh rate: 144 Hz
Observed center offset: 3.8%
Estimated DPI: 1600
Observed pointer sample rate: 972 Hz
```

Technical methodology belongs below.

## Test 8 — Visual polish

Check:

- alignment;
- consistent spacing;
- control sizes;
- clear hierarchy;
- stable result area;
- restrained use of borders/radius;
- no default-browser-looking controls where styling improves clarity;
- no unnecessary decorative UI.

Minimal does not mean unfinished.

## Test 9 — First interaction speed

The user should not encounter before the tool:

- modal;
- onboarding;
- consent-like product tutorial;
- marketing section;
- feature grid;
- large hero art.

## Test 10 — Related tools

Related tools appear after the main task/result, not as distractions before it.

They should represent a natural next diagnostic job.

Only implemented routes may appear as live related-tool links.

## Test 11 — Mobile integrity

On ~390px width:

- no page-level horizontal overflow;
- primary action remains clear;
- controls have usable sizes;
- visualization degrades gracefully;
- desktop-only limitations are stated plainly.

For Touch Screen Test specifically:

- active test area must remain practically usable for finger sweeps;
- `touch-action:none` applies only to the active surface;
- normal page scroll/zoom remains available outside it;
- status/coverage/multi-touch feedback must not consume so much space that the diagnostic surface becomes token-sized;
- fullscreen remains progressive enhancement, not a requirement for basic usability.

## Test 12 — Honest measurement

Every primary result label must reflect whether data is observed, estimated, heuristic, or visual inspection.

If the browser cannot know something exactly, the UI must not imply exactness.

Expansion 1 examples:

- `Observed pointer sample rate`, never guaranteed hardware polling rate;
- `Coverage of test area`, never touchscreen health percentage;
- `Maximum detected together`, never NKRO certification;
- camera-assisted Frame Skipping evidence, never browser-only automatic verdict.

## Test 13 — Functional beauty

Inspect every animated or graphical element.

It must clearly answer at least one of:

```text
Where is the input now?
How did it move recently?
Is the signal stable?
How close am I to the target?
What changed when I interacted?
```

If it answers none of these, remove it.

Prefer:

```text
one strong live visualization + one strong result
```

over:

```text
many cards + many numbers + decorative chart
```

## Test 14 — Instrument aesthetic

The page should feel intentionally designed rather than default-minimal.

Check that:

- measurement numbers have strong hierarchy;
- the active/live signal is visually distinct;
- inactive structure remains mostly neutral/monochrome;
- grids/reference marks are subtle;
- there are no decorative gradients, gaming neon, or generic dashboard chrome.

## Test 15 — No fake measurement progress

Mouse DPI UI must not display a marker labeled as current physical centimeters/inches based only on browser movement deltas.

The browser does not know physical mouse travel before DPI is inferred.

The same principle applies to Expansion 1: visual interpolation/clamping may improve rendering continuity only when it does not manufacture measured coverage, samples, or hardware truth.

## Test 16 — No unexplained interpretation labels

If the primary UI contains a qualitative interpretation (`Good`, `Bad`, `Stable`, `High`, etc.), it must have a documented, justified algorithm in the relevant source of truth.

Full v1 has no drift severity label and no FPS stability label.

Expansion 1 likewise forbids automatic hardware-health verdicts unless explicitly defined. In particular, do not turn Touch missed cells, rapid-repeat events, polling measurements, visual display inspection, or Frame Skipping readiness into stronger pass/fail claims than `20` permits.
