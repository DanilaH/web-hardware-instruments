# Global Goals and Release Strategy

This document defines the durable product strategy, scope rule, business model, localization direction, and current release boundary for Hardware Inspect.

Exact implementation ownership remains:

```text
18_DECISIONS_AND_BOUNDARIES.md
  global + full-v1 exact algorithms / lifecycle / browser behavior

23_HARDWARE_EXPANSION_V2_SPEC.md
  exact Hardware Expansion V2 scope / route behavior / capability boundaries /
  V2 SEO patches / sequencing / route-specific QA

20_POST_V1_HARDWARE_EXPANSION_SPEC.md
  exact Hardware Expansion 1 route behavior / algorithms / route-specific QA

22_LOCALIZATION_SPEC.md
  locale set / i18n architecture / localized routing / SEO / runtime strings / hreflang QA
```

The E1.0 → E1.7 sequence and the V2 atomic-wave sequence recorded in older documents are completed development history once Webcam merges, not an instruction to continue expanding scope.

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

Implemented localization currently covers:

```text
pt-BR
de
fr
es
ru
```

Phase-2 language watchlist:

```text
pl
it
tr
```

The tools remain globally usable. Localization changes presentation/search targeting, not diagnostic semantics.

Do not create geo-specific product behavior or country-specific synonym-page trees merely because search wording differs. Spanish remains one general `/es/` locale unless first-party evidence later justifies regional splits.

Hardware Expansion V2 passed the project's expansion gate through completed research and a reviewed exact contract. Its six approved jobs are implemented code-side once the Webcam wave merges:

```text
/printer-test-page              Printer wave
/monitor-test                   Monitor wave
/screen-uniformity-test         Screen Uniformity wave
/oled-burn-in-test              OLED Burn-In wave
/screen-resolution-checker      Screen Resolution Checker wave
/webcam-test                    Webcam wave
```

Exact behavior remains governed by `23_HARDWARE_EXPANSION_V2_SPEC.md`. The wave order in `24_EXPANSION_V2_IMPLEMENTATION_ROADMAP.md` becomes implementation history after completion.

# 3. Core product promise

A user arriving directly on a tool URL should be able to:

1. understand the job within a few seconds;
2. immediately know what to do;
3. perform the diagnostic without login or installation;
4. find the live state/result in the same tool region;
5. understand what the browser actually observed, estimated, rendered, or enabled for visual inspection;
6. understand the measurement limitation;
7. optionally continue to a small number of genuinely related diagnostics.

Localization must preserve this same promise in each language. Do not ship a translated shell around English runtime messages or English limitation copy.

Do not optimize for artificial dwell time. Useful task completion is the retention mechanism.

# 4. Cost and maintenance boundary

The product should remain close to a static asset operationally.

Expected ongoing infrastructure:

```text
static hosting
Search Console / webmaster tools
optional lightweight analytics
future display ads
```

Localization and hardware expansion must preserve static generation and single-source diagnostic logic.

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

Webcam uses permissioned local browser media only. Printer output is a generated local reference sent through browser printing. Neither creates a server-side media/document pipeline.

# 5. Product and visual boundary

The site is simple but should not look like a generic text utility.

Use functional beauty:

```text
measurement visualization
data-driven state/motion
strong numeric hierarchy
instrument-like technical geometry
controlled diagnostic patterns
```

Every visual must improve task execution, state recognition, or diagnostic understanding.

Localization may require copy/layout adjustments. Camera and Printer are implemented taxonomy channels, but neither is permission to redesign the visual system or create a seven-color rainbow taxonomy.

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

Expansion V2 absorbs nearby synonym/sub-intent phrases into its six canonical routes rather than creating a route zoo. `23_HARDWARE_EXPANSION_V2_SPEC.md` owns those boundaries.

# 7. Current implemented catalog

Full-v1, Hardware Expansion 1, localization, and Hardware Expansion V2 are code-side implementation scope once the Webcam wave merges.

Current implemented production jobs:

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
/monitor-test
/screen-uniformity-test
/oled-burn-in-test
/screen-resolution-checker

Touch
/touch-screen-test

Camera
/webcam-test

Printer
/printer-test-page
```

Localization provides approved language alternates for these same **24 jobs**.

There are no remaining pre-approved V2 placeholder routes. Future production expansion returns to the evidence gate below.

# 8. Expansion rule

A new tool outside the implemented catalog is built only when at least one strong reason exists:

```text
research validates independent demand/opportunity
Search Console exposes repeated adjacent intent
the tool materially strengthens a successful existing cluster
```

Being technically possible is not enough.

The following remain WATCH, not current commitments:

```text
controller vibration test
GPU browser test / stress test
monitor ghosting test
```

Adding a new **language version of an existing approved tool** is not a new diagnostic-scope expansion; it is governed by `22_LOCALIZATION_SPEC.md` and a separate locale decision.

Future Audio/CPS/latency/other utility ideas remain out of scope until they independently satisfy this gate and receive a reviewed exact contract before implementation.

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
browser-reported
controlled reference
```

Do not silently upgrade browser observations into hardware certification, pass/fail verdicts, warranty claims, inferred device health, exact physical panel resolution, exact printer color/nozzle state, or exact camera quality.

Screen Resolution Checker reports browser-exposed CSS screen/viewport values plus an explicitly estimated `Math.round(css × DPR)` device-pixel size. It must never relabel that estimate as native or physical panel resolution.

Webcam Test reports a permissioned browser media stream and track/browser-reported values. It does not score image quality, record/upload video, or claim sensor-level specifications beyond what the active track reports.

Translation must preserve the same epistemic strength. A localized phrase that sounds more certain than the English source is wrong even if linguistically natural.

Exact algorithms and wording boundaries are owned by `18`, `20`, and `23`; locale terminology and presentation architecture are owned by `22`.

# 10. Code-complete vs release-ready

These labels remain deliberately separate:

```text
code-complete
= implementation + source-of-truth compliance + code review + visual/headless review + automated validation

release-ready
= code-complete + the real-device/browser/camera/print-preview/display checks required for the routes being released
```

Mock/headless input can validate state and geometry. It is never evidence of real hardware behavior, real printer output, actual panel defects, or a physical camera environment.

Localized work additionally requires routing, localized runtime strings, canonical/hreflang/sitemap, and language-leakage QA before a route/locale is ready to index.

# 11. Current public-deployment boundary

The production origin is configured and live:

```text
origin = https://hardwareinspect.com
indexingEnabled = true
```

This supersedes historical planning text that referred to `hardware-testing.invalid` and deferred domain purchase.

Current release work should verify, rather than assume, the external state of:

1. HTTPS production deployment;
2. applicable real-device/browser/camera/print-preview smoke;
3. robots and sitemap behavior;
4. Search Console / webmaster property state where relevant;
5. sitemap submission and URL inspection;
6. production smoke after changes.

For localized rollout, additionally verify:

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

For localization and V2, evaluate page/query/country evidence separately where possible. Do not infer success from implementation completeness alone.

A technically working site does not prove the business hypothesis. Early low traffic is also not proof of failure before a reasonable indexing/ranking window.

After V2, pause broad expansion work and use first-party GSC/query evidence to decide whether another diagnostic deserves production work.

# 13. Monetization boundary

Display ads are a later layer, not an implementation dependency.

When enabled:

- no ad before the primary tool;
- no ad inside the diagnostic surface;
- no overlay over live state/result;
- no layout shift that breaks primary task completion;
- first preferred placement is after the tool/result.
