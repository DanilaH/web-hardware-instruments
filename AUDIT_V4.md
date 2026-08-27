# Audit of v4 — Non-normative

This is a review report, not an implementation specification. v5 numbered docs are the source of truth.

## Real contradictions / gaps found

### Critical

1. Mouse DPI visual was circular.
   v4 asked the marker to show physical progress toward 10 cm even though physical travel is the unknown input the browser cannot infer before DPI is calculated.

2. Dependency direction contradicted itself.
   One architecture diagram implied `pure core logic → browser adapters`, while the capability-service section implied tool logic consumes the service. Pure math must not depend on browser acquisition.

3. Result semantics were underspecified.
   Drift severity (`Small/Noticeable/High`), FPS `Stable`, deadzone heuristic, sample durations, refresh-rate outlier handling, and common-mode matching had no exact definitions. An agent would have to invent product semantics.

### High

4. Standard vs non-standard gamepad mapping behavior was missing.
   A generic physical controller SVG cannot safely represent arbitrary non-standard axis/button mappings.

5. Multiple gamepads were not specified.

6. Mouse acquisition mode was too vague.
   Pointer Lock/raw input was described as optional without an exact fallback order or finish/cancel UX.

7. FPS meaning needed a stronger boundary.
   rAF measures this browser page's frame delivery, not a game's FPS.

8. FPS and Refresh pages had a cannibalization/duplication risk without explicit content/job boundaries.

9. Custom analytics was effectively required by launch DoD even though provider/privacy/consent behavior was intentionally unresolved.

### Medium

10. Rendering technology was ambiguous (`SVG or Canvas` for traces; SVG keyboard elsewhere).

11. Styling stack was not fixed, leaving room for Tailwind/UI-library creep.

12. Browser support tiers were not explicit.

13. Tests still referenced DPI `trial averaging` after trial-history UX had been removed.

14. Accessibility wording treated controller SVG parts like interactive controls instead of allowing a text equivalent.

15. v4 README still called itself `v2`, and the manifest listed stale historical review docs.

## v5 resolution

v5 fixes all items above and adds one explicit conflict-resolution document:

`18_DECISIONS_AND_BOUNDARIES.md`

Old V2/V3/V4 review notes are removed from the clean agent bundle to prevent superseded instructions from leaking into implementation.
