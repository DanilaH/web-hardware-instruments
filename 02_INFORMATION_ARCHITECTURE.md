# Information Architecture

This document describes the **current** catalog structure and internal-linking model.

Exact route behavior remains owned by `18_DECISIONS_AND_BOUNDARIES.md`, `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`, and for implemented Expansion V2 jobs by `23_HARDWARE_EXPANSION_V2_SPEC.md`.

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
/monitor-test
/screen-uniformity-test
/oled-burn-in-test
```

Jobs:

- browser-page frame delivery;
- browser-visible display cadence estimate;
- camera-assisted frame-skipping evidence;
- fullscreen solid-color pixel inspection;
- fullscreen black-screen backlight inspection;
- guided manual monitor inspection with solid fields, gradients, near-black/near-white references, and a sharpness grid;
- manual gray-field inspection for uneven brightness, tint, banding, clouding, mura-like variation and dirty-screen-effect-like patches;
- manual solid/gray-field inspection for persistent image shapes while keeping burn-in, temporary retention and other uniformity artifacts distinct.

Monitor Test is the broad Display-entry diagnostic. Screen Uniformity Test is the focused gray-field companion. OLED Burn-In Test is the focused persistent-image inspection companion. All three reuse the shared deterministic Display Pattern Engine and progressive fullscreen enhancement; none provides automatic pass/fail, measured luminance uniformity, burn-in percentage, contrast, response time, color delta, repair behavior or panel-health certification.

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

### Printer

```text
/printer-test-page
```

One substantial route owns:

- local A4/Letter printable reference generation;
- Full / Color / Grayscale print profiles;
- text, fine-line, alignment, grayscale, and color visual references;
- browser print handoff through `window.print()`.

Printer is a singleton channel. It does not expose printer telemetry, cartridge/nozzle state, WebUSB/WebHID behavior, or unrelated RelatedTools.

## Homepage

The catalog is large enough that a single flat list is no longer the preferred IA.

Use the currently implemented device/output clusters as compact homepage sections:

```text
Controller
Mouse
Keyboard
Display
Touch
Printer
```

The grouping exists for scanability, not to create category landing pages by default.

Homepage rules:

- keep the intro compact;
- show every implemented diagnostic once;
- use short job descriptions;
- use simple functional glyphs only;
- prefer a compact multi-column list on desktop and one column on narrow mobile;
- do not add autoplay previews, dashboard metrics, filters, search, or category tabs unless future catalog scale creates a real need.

Printer appears as a neutral output/reference channel. The homepage browser-boundary model may describe locally rendered test patterns, but must not imply printer telemetry or hardware acquisition.

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

Monitor Test
↔ Dead Pixel
↔ Screen Uniformity
↔ OLED Burn-In

Screen Uniformity
↔ OLED Burn-In
↔ Monitor Test
↔ Backlight Bleed

OLED Burn-In
↔ Screen Uniformity
↔ Monitor Test
↔ Dead Pixel

Dead Pixel
↔ Monitor Test
↔ Screen Uniformity
↔ Backlight Bleed

Backlight Bleed
↔ Dead Pixel
↔ Monitor Test

Frame Skipping
↔ Refresh Rate
↔ FPS

Printer Test Page
→ no RelatedTools while Printer remains a singleton channel
```

This is a relevance guide, not a demand to create a complete graph. Do not add cross-links just to increase link count, and do not link to approved-but-unimplemented V2 routes.

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
