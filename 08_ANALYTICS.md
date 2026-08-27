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

## Allowed coarse properties

Examples:

```text
tool
supported
measurement_mode: raw_pointer | pointer_lock | fallback
result_bucket
browser_family if supplied by the analytics platform
```

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
Gamepad        → controller detected
Stick Drift    → explicit test completed
Deadzone       → explicit test completed
Mouse DPI      → explicit test completed
FPS            → measurement ready
Refresh Rate   → measurement ready
Keyboard       → at least one key detected
```

Do not optimize for artificial dwell time or extra pageviews.
