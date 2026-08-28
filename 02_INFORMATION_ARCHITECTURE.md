# Information Architecture

This document describes the **current** catalog structure and internal-linking model.

Exact route behavior remains owned by `18_DECISIONS_AND_BOUNDARIES.md` and `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

## IA principles

1. One route = one real diagnostic job/search intent.
2. A user may land directly on any tool from search; every route must work independently.
3. Related tools appear after the primary task/result, never before it.
4. Do not create synonym pages for substantially identical tools.
5. Homepage grouping should help users scan the catalog without turning it into a dashboard.
6. Only implemented routes may appear in navigation/catalog surfaces.

## Current catalog

### Controller

```text
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test
```

Jobs:

- broad controller input check;
- analog-stick center-offset observation;
- center-noise measurement + heuristic starting deadzone.

### Mouse

```text
/mouse-tester
/mouse-button-test
/mouse-scroll-test
/double-click-test
/mouse-polling-rate-test
/mouse-dpi-test
```

Jobs:

- broad browser-detected mouse input;
- focused button registration;
- wheel direction/reverse-event observation;
- unintended rapid repeat observation;
- browser-observed pointer sample rate;
- estimated DPI from user-supplied physical travel.

### Keyboard

```text
/keyboard-tester
/keyboard-rollover-test
/keyboard-ghosting-test
```

Jobs:

- simple key registration;
- maximum simultaneous browser-detected held set;
- guided expected-combination observation.

### Display

```text
/fps-test
/refresh-rate-test
/frame-skipping-test
/dead-pixel-test
/backlight-bleed-test
```

Jobs:

- browser-page frame delivery;
- browser-visible display cadence estimate;
- camera-assisted frame-skipping evidence;
- fullscreen solid-color pixel inspection;
- fullscreen black-screen backlight inspection.

### Touch

```text
/touch-screen-test
```

One substantial route owns:

- live finger contact observation;
- multi-touch observation;
- coverage mapping;
- missed-area confirmation;
- hands-off unexpected-touch observation.

Do not split thin synonym Touch routes without fresh query evidence.

## Homepage

The catalog is now large enough that a single flat list is no longer the preferred IA.

Use the five device clusters above as compact homepage sections:

```text
Controller
Mouse
Keyboard
Display
Touch
```

The grouping exists for scanability, not to create category landing pages by default.

Homepage rules:

- keep the intro compact;
- show every implemented diagnostic once;
- use short job descriptions;
- use simple functional glyphs only;
- prefer a compact multi-column list on desktop and one column on narrow mobile;
- do not add autoplay previews, dashboard metrics, filters, search, or category tabs unless future catalog scale creates a real need.

## Related-tool model

Keep related navigation narrow: normally 2, at most 3 when the connection is genuinely useful.

Preferred clusters:

```text
Gamepad Tester
↔ Stick Drift
↔ Deadzone

Mouse Tester
↔ Mouse Button
↔ Mouse Scroll
↔ Double Click / Polling where contextually useful

Mouse DPI
↔ Mouse Tester
↔ Polling Rate

Keyboard Tester
↔ Rollover
↔ Ghosting

Touch Screen
↔ Dead Pixel
↔ Backlight Bleed

FPS
↔ Refresh Rate
↔ Frame Skipping

Dead Pixel
↔ Backlight Bleed
↔ Refresh Rate

Backlight Bleed
↔ Dead Pixel

Frame Skipping
↔ Refresh Rate
↔ FPS
```

This is a relevance guide, not a demand to create a complete graph. Do not add cross-links just to increase link count.

## Supporting routes

```text
/
/about
/privacy
```

Primary header navigation remains intentionally small:

```text
Tools
About
```

Privacy may live in the footer/supporting navigation; it does not need equal visual weight in the primary header.

## Future IA changes

Do not create category landing pages, site search, filters, or a mega-navigation pre-emptively.

Revisit IA only when:

- the catalog grows enough that the homepage grouping no longer scans well;
- Search Console reveals meaningful category-level intent;
- a cluster becomes large enough to justify its own navigation surface.
