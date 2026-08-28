# Deferred Backlog

This file exists to stop deferred ideas from leaking into approved scope.

## Promoted from backlog

The following hardware utilities are no longer unvalidated backlog items. They are approved as **Post-v1 Hardware Expansion 1** and are governed by `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`:

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

Their presence here historically does not mean they should be re-scoped or revalidated during implementation. Follow the approved sequential Expansion 1 roadmap.

## Audio candidates

Audio is not part of Hardware Expansion 1.

Potential later cluster:

```text
/tone-generator
/left-right-speaker-test
/hearing-frequency-test
/microphone-test
```

Treat Audio as a separate expansion direction. Do not silently mix it into Hardware Expansion 1.

## Possible richer diagnostics

Potential but not approved:

- persistent test history;
- shareable result URLs;
- downloadable reports;
- device comparison;
- WebHID deeper measurement;
- calibration profiles;
- benchmark scoring;
- screenshots/export images;
- deadzone preview slider;
- detailed FPS stability classification;
- long frame-history exploration;
- mouse/keyboard hardware latency claims;
- touch latency or pressure scores;
- monitor calibration suite;
- OLED burn-in scoring;
- pixel-fixer/flashing repair modes.

## Internationalization

Not currently approved.

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

No current product need.

A backend should require a concrete future use case, not architectural preference.

## Visual/system backlog

Not currently approved:

- dark mode;
- multiple brand accent themes;
- advanced graph controls;
- chart-library migration.

## Analytics provider

Provider selection is intentionally deferred. Search Console is enough to launch.

## Search expansion discipline

Expansion 1 has already passed the research/cluster-fit promotion gate.

For **future scope outside Expansion 1**, a backlog item is not permission to implement it. Promote a future tool only when:

- external research validates the opportunity; or
- Search Console repeatedly surfaces the adjacent job; or
- it materially strengthens an already-successful tool/cluster.

Do not build tools merely to make the catalog look complete.
