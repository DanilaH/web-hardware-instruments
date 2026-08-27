# Deferred Backlog

This file exists to stop deferred ideas from leaking into MVP scope.

## High-value Phase 2 candidates

### Hardware

```text
/dead-pixel-test
/frame-skipping-test
/mouse-button-test
/mouse-scroll-test
/double-click-test
/keyboard-rollover-test
/keyboard-ghosting-test
/touch-screen-test
```

## Audio candidates

Do not include in initial hardware MVP.

Potential later cluster:

```text
/tone-generator
/left-right-speaker-test
/hearing-frequency-test
/microphone-test
```

The Audio cluster should be treated as its own validated expansion, not silently mixed into MVP.

## Possible richer diagnostics

Potential but not approved:

- persistent test history
- shareable result URLs
- downloadable reports
- device comparison
- WebHID deeper measurement
- calibration profiles
- benchmark scoring
- screenshots/export images
- deadzone preview slider
- detailed FPS stability classification
- long frame-history exploration

## Internationalization

Not MVP.

Only add locales after:

- English site is stable;
- page architecture is proven;
- localization has actual search justification.

Avoid machine-generating dozens of locale pages without review.

## Monetization

Do not add ads until:

- site has meaningful traffic;
- page layout is stable;
- ad provider is selected;
- ads do not interfere with the tool.

Implement provider-agnostic ad slots only when monetization work actually begins.

## Accounts

No current reason for accounts.

Do not add login merely to save test history.

## Backend

No current MVP need.

A backend should require a concrete future use case, not architectural preference.


## Visual/system backlog

Not MVP:

- dark mode;
- multiple brand accent themes;
- advanced graph controls;
- chart-library migration.

## Analytics provider

Provider selection is intentionally deferred. Search Console is enough to launch.


## Search expansion discipline

A backlog item is not permission to implement it.

Promote a tool from backlog only when:

- external research validates the opportunity; or
- Search Console repeatedly surfaces the adjacent job; or
- it is necessary to make an already-successful tool meaningfully better.

Do not build tools merely to make the catalog look complete.
