# Deferred Backlog

This file exists to stop deferred ideas from leaking into approved scope.

It is not a roadmap. Nothing listed here is permission to implement it without the evidence/review gate in `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`.

## Completed promotion: Hardware Expansion 1

The following routes were promoted from backlog through research/cluster-fit review, implemented, and code-side audited:

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

Their exact implemented behavior remains governed by `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

They are listed here only to preserve scope history. The old sequential E1 roadmap is complete and is not a current instruction.

## Audio candidates

Audio is not part of the current hardware catalog.

Potential later cluster:

```text
/tone-generator
/left-right-speaker-test
/hearing-frequency-test
/microphone-test
```

Treat Audio as a separate expansion direction. Do not silently add it as a continuation of Expansion 1.

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
- deadzone preview/configuration simulator;
- detailed FPS stability classification;
- long frame-history exploration;
- mouse/keyboard hardware latency claims;
- touch latency or pressure scores;
- monitor calibration suite;
- OLED burn-in scoring;
- pixel-fixer/flashing repair modes.

These ideas must still justify user value, search evidence, measurement honesty, maintenance cost, and architecture complexity.

## Internationalization

Not currently approved.

Only add locales after:

- English site is stable in production;
- page architecture is proven;
- localization has actual search justification.

Avoid machine-generating large locale sets without review.

## Monetization

Do not add ads merely because the catalog is code-complete.

Monetization work should start when:

- the site has meaningful traffic/evidence;
- page layout is stable;
- an ad provider/integration is selected;
- placements do not interfere with task completion.

Do not render provider-agnostic empty ad slots before a real monetization integration exists.

## Accounts

No current product reason for accounts.

Do not add login merely to save test history.

## Backend

No current product need.

A backend requires a concrete future job that cannot be solved cleanly by the static/local model. Architectural preference is not enough.

## Visual/system backlog

Not currently approved:

- dark mode;
- multiple brand accent themes;
- advanced graph controls;
- chart-library migration.

Small cross-catalog UX/IA/accessibility polish is **not** blocked by this section when it preserves route jobs and measurement contracts.

## Analytics provider

Provider selection is intentionally deferred. Search Console is sufficient for the first public evidence loop.

## Search expansion discipline

For any future scope, a backlog item is not permission to implement it. Promote a future tool only when at least one strong condition exists:

- external research validates the opportunity; or
- Search Console repeatedly surfaces the adjacent job; or
- it materially strengthens an already-successful tool/cluster.

Then still check:

```text
user value
measurement honesty
SEO intent separation
maintenance cost
architecture complexity
functional UX
```

Do not build tools merely to make the catalog look complete.
