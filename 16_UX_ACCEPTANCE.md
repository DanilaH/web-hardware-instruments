# UX Acceptance Tests

This document is a release gate.

## Test 1 — Three-second comprehension

Open a tool page with no prior context.

Within roughly three seconds, a user should be able to answer:

```text
What is this?
What do I do?
Where will I see the result?
```

If the UI needs explanatory reading to answer these, simplify it.

## Test 2 — One viewport

At:

```text
1366×768
```

without vertical scrolling, show:

- compact header;
- H1;
- one short instruction;
- full primary interaction;
- key status/result region.

Below-the-fold content is excluded from this requirement.

## Test 3 — One dominant action

Blur/squint test:

Only one control should visually read as the next important action.

If two or more buttons compete, reduce hierarchy.

## Test 4 — No result hunting

Perform the test.

The result must appear:

- inside the same tool area;
- near the interaction;
- without requiring the user to scroll down to find it.

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

## Test 7 — Result comprehension

The primary result should be understandable without technical documentation.

Examples:

```text
Estimated refresh rate: 144 Hz
Observed center offset: 3.8%
Estimated DPI: 1600
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

## Test 11 — Mobile integrity

On ~390px width:

- no overflow;
- primary action remains clear;
- controls have usable sizes;
- visualization degrades gracefully;
- desktop-only limitations are stated plainly.

## Test 12 — Honest measurement

Every primary result label must reflect whether data is observed, estimated, or heuristic.

If the browser cannot know something exactly, the UI must not imply exactness.


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

## Test 16 — No unexplained interpretation labels

If the primary UI contains a qualitative interpretation (`Good`, `Bad`, `Stable`, `High`, etc.), it must have a documented, justified algorithm in the source of truth.

MVP currently has no drift severity label and no FPS stability label.
