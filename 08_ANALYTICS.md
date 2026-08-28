# Analytics Specification

## MVP policy

Google Search Console is required for SEO learning.

Custom product analytics is optional at initial launch and must not block release.

If custom analytics is enabled, prefer a cookieless / no-local-storage setup that does not force a consent-style interruption solely for product analytics. Legal/compliance requirements still override product preferences.

## Privacy boundary

Never send raw:

```text
KeyboardEvent key sequences
gamepad axes/buttons streams
mouse movement streams
mouse button / wheel event streams
mouse polling sample timestamps
touch contact / pointer streams
frame timestamp arrays
controller/device identifiers
```

The public trust statement is specifically:

```text
Raw test data is not uploaded.
```

Do not claim that the site makes zero network requests if analytics is enabled.

## Allowed coarse events

Only if a product analytics provider is enabled:

```text
tool_view
gamepad_detected
explicit_test_started
explicit_test_completed
measurement_ready
related_tool_clicked
unsupported_capability
tool_error
```

Do not emit events every frame or every input event.

For auto-measuring FPS/Refresh pages, `measurement_ready` fires at most once per page load after the first usable result.

For Expansion 1, the same rule applies: record coarse lifecycle/success events only. Do not emit button presses, wheel directions, pointer timestamps, touch starts/coordinates, key combinations, covered-cell maps, or frame-skipping timing sequences as analytics.

## Allowed coarse properties

Examples:

```text
tool
supported
measurement_mode: raw_pointer | pointer_lock | fallback
result_bucket
browser_family if supplied by the analytics platform
```

Any `result_bucket` must be deliberately coarse and must not reconstruct a raw input stream or expose a device identifier.

Do not send exact raw input series.

## Search Console monitoring

Per URL:

- impressions
- clicks
- CTR
- average position
- top queries
- country
- device

## Product analytics success signals

If product analytics is later enabled, use tool-appropriate success signals rather than forcing one metric across every page:

```text
Gamepad             → controller detected
Stick Drift         → explicit test completed
Deadzone            → explicit test completed
Mouse DPI           → explicit test completed
FPS                 → measurement ready
Refresh Rate        → measurement ready
Keyboard            → at least one key detected
Mouse Tester        → at least one supported mouse input observed
Mouse Button        → at least one button input observed
Mouse Scroll        → at least one wheel event observed
Double Click        → explicit test/session interaction completed
Mouse Polling       → explicit test completed
Touch Screen        → explicit mode interaction completed
Keyboard Rollover   → at least one multi-key observation
Keyboard Ghosting   → explicit guided test completed
Dead Pixel          → visual test started
Backlight Bleed     → visual test started
Frame Skipping      → browser pattern reached readiness
```

These are coarse product events only. They are not substitutes for hardware validation and should not contain raw measurements unless a separately reviewed privacy-safe aggregate is explicitly approved.

Do not optimize for artificial dwell time or extra pageviews.
