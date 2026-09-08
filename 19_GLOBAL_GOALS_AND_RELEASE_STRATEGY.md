# Global Goals and Release Strategy

This document defines the durable product strategy, scope rule, business model, localization direction, and current release boundary for Hardware Inspect.

Exact implementation ownership remains:

```text
18_DECISIONS_AND_BOUNDARIES.md
  global + full-v1 exact algorithms / lifecycle / browser behavior

20_POST_V1_HARDWARE_EXPANSION_SPEC.md
  exact Hardware Expansion 1 route behavior / algorithms / route-specific QA

22_LOCALIZATION_SPEC.md
  locale set / i18n architecture / localized routing / SEO / runtime strings / hreflang QA
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

The original research market was English / US, and the English product remains the baseline.

Localization of the existing catalog is now approved for:

```text
pt-BR
de
fr
es
ru
```

Phase-2 watchlist:

```text
pl
it
tr
```

The tools remain globally usable. Localization changes presentation/search targeting, not diagnostic semantics.

Do not create geo-specific product behavior or country-specific synonym-page trees merely because search wording differs. Spanish ships as one general `/es/` locale unless first-party evidence later justifies regional splits.

# 3. Core product promise

A user arriving directly on a tool URL should be able to:

1. understand the job within a few seconds;
2. immediately know what to do;
3. perform the diagnostic without login or installation;
4. find the live state/result in the same tool region;
5. understand what the browser actually observed or estimated;
6. understand the measurement limitation;
7. optionally continue to one or two genuinely related diagnostics.

Localization must preserve this same promise in each language. Do not ship a translated shell around English runtime messages or English limitation copy.

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

Localization must preserve static generation and single-source diagnostic logic. Avoid five copies of controllers/services/renderers merely to support five languages.

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

Localization may require copy/layout adjustments, but it is not permission to redesign the visual system.

# 6. SEO boundary

Each indexable page maps to one real user job/search intent.

Do not create:

- synonym pages with substantially identical tools;
- thin generated pages;
- keyword-stuffed copies;
- placeholder/coming-soon indexable pages;
- oversized SEO articles that push the diagnostic down the page.

Tool first. Supporting search content comes after the primary interaction/result.

Localized versions of the **same** semantic tool are allowed and expected under approved locale prefixes. They are language alternates, not independent new product intents.

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

Localization adds language variants of these same 18 jobs. It does not expand the diagnostic catalog.

The original full-v1 and Expansion 1 implementation order remains useful history, but it no longer constrains justified maintenance across the completed catalog.

A reviewed correctness, accessibility, IA, SEO, localization, or UX improvement may touch an older route when it preserves that route's measurement semantics and user job.

# 8. Expansion rule

A new tool outside the current catalog is normally built only when at least one strong reason exists:

```text
research validates independent demand/opportunity
Search Console exposes repeated adjacent intent
the tool materially strengthens a successful existing cluster
```

Being technically possible is not enough.

Adding a new **language version of an existing approved tool** is not a new diagnostic-scope expansion; it is governed by `22_LOCALIZATION_SPEC.md` and the approved locale decision.

Future Audio/CPS/latency/other utility ideas remain out of scope until they satisfy the tool-expansion gate and receive a reviewed contract.

Do not use localization work as a back door for new product scope.

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

Translation must preserve the same epistemic strength. A localized phrase that sounds more certain than the English source is wrong even if linguistically natural.

Exact algorithms and wording boundaries are owned by `18` and `20`; locale terminology and presentation are owned by `22`.

# 10. Code-complete vs release-ready

These labels remain deliberately separate:

```text
code-complete
= implementation + source-of-truth compliance + code review + visual/headless review + automated validation

release-ready
= code-complete + the real-device/browser/camera checks required for the routes being released
```

Mock/headless input can validate state and geometry. It is never evidence of real hardware behavior.

Localization work additionally requires locale routing, localized runtime strings, canonical/hreflang/sitemap, and language-leakage QA before that locale is considered ready to index.

# 11. Current public-deployment boundary

The production origin is already configured:

```text
origin = https://hardwareinspect.com
indexingEnabled = true
```

This supersedes historical planning text that referred to `hardware-testing.invalid` and deferred domain purchase.

Do **not** revert the configured production origin or disable indexing merely because an older document still describes the pre-launch state.

Current release work should verify, rather than assume, the external state of:

1. HTTPS production deployment;
2. required real-device/browser/camera smoke;
3. robots and sitemap behavior;
4. Google Search Console property/access;
5. sitemap submission and URL inspection;
6. production smoke after changes.

For localization rollout, additionally verify:

1. English root URLs remain unchanged;
2. locale prefixes follow `22_LOCALIZATION_SPEC.md`;
3. each localized page has self canonical;
4. reciprocal hreflang is complete for actually shipped alternates;
5. `<html lang>` is correct;
6. localized URLs are included in the sitemap;
7. navigation/language switching stays on the same semantic tool;
8. no forced IP/geography redirects are introduced.

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

For localization, evaluate country/language/page query evidence separately where possible. Do not infer success from translation completeness alone.

A technically working site does not prove the business hypothesis. Early low traffic is also not proof of failure before a reasonable indexing/ranking window.

# 13. Monetization boundary

Display ads are a later layer, not an implementation dependency.

When enabled:

- no ad before the primary tool;
- no ad inside the diagnostic surface;
- no overlay over live state/result;
- no layout shift that breaks primary task completion;
- first preferred placement is after the tool/result.
