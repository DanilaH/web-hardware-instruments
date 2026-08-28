# Global Goals and Release Strategy

This document defines the durable product strategy, scope rule, business model, and release boundary for Hardware Tests.

Exact implementation ownership remains:

```text
18_DECISIONS_AND_BOUNDARIES.md
  global + full-v1 exact algorithms / lifecycle / browser behavior

20_POST_V1_HARDWARE_EXPANSION_SPEC.md
  exact Hardware Expansion 1 route behavior / algorithms / route-specific QA
```

The E1.0 → E1.7 sequence recorded in older documents is completed development history, not the current implementation roadmap.

# 1. Business thesis

Build a low-maintenance browser utility asset whose primary acquisition channel is organic search.

```text
organic search
→ user completes a useful diagnostic
→ optional natural navigation to a related diagnostic
→ display-ad monetization later, after traffic exists
```

This is not a SaaS product.

Do not design around:

```text
accounts
subscriptions
paid tiers
lead generation
sales funnels
user-generated content
community features
```

# 2. Market and acquisition

Initial content/search-market target:

```text
English content
US keyword market
```

The tools themselves should remain globally usable.

Do not create geo pages or US-only product behavior merely because initial search research is US-focused.

# 3. Core product promise

A user arriving directly on a tool URL should be able to:

1. understand the job within a few seconds;
2. immediately know what to do;
3. perform the diagnostic without login or installation;
4. find the live state/result in the same tool region;
5. understand what the browser actually observed or estimated;
6. understand the measurement limitation;
7. optionally continue to one or two genuinely related diagnostics.

Do not optimize for artificial dwell time. Useful task completion is the retention mechanism.

# 4. Cost and maintenance boundary

The product should remain close to a static asset operationally.

Expected ongoing infrastructure:

```text
static hosting
Search Console
optional lightweight analytics
future display ads
```

Avoid features that create recurring operational burden without strong evidence of value:

```text
backend services
databases
scheduled jobs
external data feeds
account support
paid runtime APIs
manual hardware catalogs
```

# 5. Product and visual boundary

The site is simple but should not look like a generic text utility.

Use functional beauty:

```text
measurement visualization
data-driven state/motion
strong numeric hierarchy
instrument-like technical geometry
```

Every visual must improve task execution, state recognition, or diagnostic understanding.

Do not add decoration merely to make the site feel larger or more premium.

# 6. SEO boundary

Each indexable page maps to one real user job/search intent.

Do not create:

- synonym pages with substantially identical tools;
- thin generated pages;
- keyword-stuffed copies;
- placeholder/coming-soon indexable pages;
- oversized SEO articles that push the diagnostic down the page.

Tool first. Supporting search content comes after the primary interaction/result.

# 7. Current catalog

Full-v1 and Hardware Expansion 1 are code-side complete and audited.

```text
Controller
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test

Mouse
/mouse-tester
/mouse-button-test
/mouse-scroll-test
/double-click-test
/mouse-polling-rate-test
/mouse-dpi-test

Keyboard
/keyboard-tester
/keyboard-rollover-test
/keyboard-ghosting-test

Display
/fps-test
/refresh-rate-test
/frame-skipping-test
/dead-pixel-test
/backlight-bleed-test

Touch
/touch-screen-test
```

The original full-v1 and Expansion 1 implementation order remains useful history, but it no longer constrains justified maintenance across the completed catalog.

A reviewed correctness, accessibility, IA, SEO, or UX improvement may touch an older route when it preserves that route's measurement semantics and user job.

# 8. Expansion rule

A new tool outside the current catalog is normally built only when at least one strong reason exists:

```text
research validates independent demand/opportunity
Search Console exposes repeated adjacent intent
the tool materially strengthens a successful existing cluster
```

Being technically possible is not enough.

Future Audio/CPS/latency/other utility ideas remain out of scope until they satisfy this gate and receive a reviewed contract.

Do not use maintenance work as a back door for new product scope.

# 9. Measurement-honesty boundary

Browser diagnostics must describe what they can actually observe.

Use language such as:

```text
browser-detected
observed
estimated
heuristic
visual inspection
camera-assisted evidence
```

Do not silently upgrade browser observations into hardware certification, pass/fail verdicts, warranty claims, or inferred device health.

Exact algorithms and wording boundaries are owned by `18` and `20`.

# 10. Code-complete vs release-ready

These labels remain deliberately separate:

```text
code-complete
= implementation + source-of-truth compliance + code review + visual/headless review + automated validation

release-ready
= code-complete + the real-device/browser/camera checks required for the routes being released
```

Mock/headless input can validate state and geometry. It is never evidence of real hardware behavior.

# 11. Current public-deployment boundary

Public deployment is intentionally deferred until a real production domain is purchased immediately before launch.

Until then:

```text
origin = https://hardware-testing.invalid
indexingEnabled = false
```

Do not invent a temporary production origin and do not enable indexing early.

Before first indexed public release:

1. purchase/set the real production domain;
2. run the required real-device/browser/camera smoke for the included routes;
3. verify the real canonical origin and HTTPS behavior;
4. enable indexing;
5. deploy;
6. connect Google Search Console;
7. submit the generated sitemap;
8. run final production smoke.

The first public release may contain the entire current catalog if every included route satisfies its release-ready gate.

# 12. Evidence of business success

Evidence progresses roughly as:

```text
crawl/indexing
→ impressions
→ useful query coverage
→ ranking improvement
→ organic clicks
→ traffic scale
→ display-ad economics
```

A technically working site does not prove the business hypothesis. Early low traffic is also not proof of failure before a reasonable indexing/ranking window.

# 13. Monetization boundary

Display ads are a later layer, not an implementation dependency.

When enabled:

- no ad before the primary tool;
- no ad inside the diagnostic surface;
- no overlay over live state/result;
- no layout shift that breaks primary task completion;
- first preferred placement is after the tool/result.
