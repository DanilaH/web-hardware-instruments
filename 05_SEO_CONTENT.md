# SEO and Content Rules

This document defines durable SEO/content rules for the current and approved catalog.

Exact Full-v1 title boundaries are maintained here except where an explicitly approved later SEO patch supersedes presentation wording. Exact Expansion 1 title/H1/intent boundaries are owned by `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`. Exact Expansion V2 route intent/metadata plus its approved existing-page SEO patch are owned by `23_HARDWARE_EXPANSION_V2_SPEC.md`. Localization routing, terminology, hreflang/canonical behavior, and runtime-message i18n are owned by `22_LOCALIZATION_SPEC.md`.

## Core rule

One indexable tool route should map to one real diagnostic job/search intent.

Do not create:

- synonym pages with substantially identical tools;
- thin generated variants;
- keyword-stuffed copies;
- placeholder/coming-soon indexable routes;
- articles whose primary purpose is to occupy search space while pushing the tool below the fold.

Localized alternates of the same semantic tool are allowed under approved locale prefixes. They are language versions of one approved job, not permission to create locale-specific synonym routes.

Expansion V2 follows the same rule: related search phrases such as `screen test`, `display test`, `color printer test page`, `dirty screen effect test`, and `what is my screen resolution` are absorbed by the canonical V2 jobs defined in `23`, not emitted as separate landing pages.

## Search-landing independence

Assume a user may enter directly on any diagnostic route, including a localized route.

Every tool page should independently provide:

1. exact H1/job framing;
2. compact instruction/status;
3. primary diagnostic interaction;
4. honest result/measurement wording;
5. concise limitation/context;
6. useful explanatory content below the tool;
7. a small related-tool section after the task/result when semantically useful.

A localized page must provide these in the selected locale, including runtime status/action/error strings. Do not require homepage context and do not ship a translated shell around an English diagnostic UI.

## Tool-first content order

Preferred page order:

```text
H1 + compact intro
primary diagnostic
result / limitation in the same tool region
supporting explanation / how-to
related tools
```

SEO content supports task completion. It must not displace it.

Do not add filler merely to make a utility page longer. The interactive diagnostic, its honest result, and concise task-specific explanation are the primary page value.

## Metadata

Each route should have:

- unique, descriptive `<title>`;
- unique H1;
- useful meta description;
- self-referencing canonical URL using `https://hardwareinspect.com`;
- one stable intent boundary.

Localized routes additionally require:

- correct `<html lang>`;
- reciprocal hreflang for every actually shipped semantic alternate;
- localized title/H1/meta/visible copy;
- inclusion in the production sitemap.

Titles should be concise and readable rather than lists of keyword variants. A repeated brand suffix is not required when the page-specific title already identifies the job clearly.

Do not create multiple pages simply to target small wording variations such as `test`, `tester`, `checker`, `online`, or plural/singular forms when the underlying user job is the same.

## Current Full-v1 title boundaries and V2 presentation override

Historical/current Full-v1 titles include:

```text
Gamepad Tester — Test Controller Buttons & Sticks
Controller Stick Drift Test — Check Analog Stick Drift
Controller Deadzone Test — Check Stick Center Noise
Mouse DPI Test — Estimate Your Mouse DPI
FPS Test — Check Browser Frame Rate
Refresh Rate Test — Estimate Monitor Hz
Keyboard Tester — Test Keyboard Keys Online
```

Exact English H1 values are normally the plain tool names.

`Refresh Rate Test — Estimate Monitor Hz` intentionally keeps the measurement-honesty verb `Estimate` while using common monitor/Hz vocabulary. Do not strengthen it into exact hardware certification in English or translation.

For the routes explicitly listed in the Expansion V2 existing-page SEO patch, `23_HARDWARE_EXPANSION_V2_SPEC.md` supersedes older title/H1 presentation wording while preserving the underlying diagnostic behavior. In particular, the approved V2 patch may change the Stick Drift H1/title vocabulary without changing its algorithm.

Do not interpret a copy/title patch as permission to alter measurement semantics or route slugs.

## Expansion 1 intent ownership

For these routes, use the `SEO page intent boundaries` section in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` as the exact English intent contract except where `23` explicitly supplies a later presentation-only SEO patch:

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

## Expansion V2 intent ownership

`23_HARDWARE_EXPANSION_V2_SPEC.md` owns the exact approved intent/metadata contract for:

```text
/printer-test-page
/monitor-test
/screen-uniformity-test
/oled-burn-in-test
/screen-resolution-checker
/webcam-test
```

Do not create synonym aliases/landing pages for the phrase families absorbed by those routes.

## Localization ownership

Implemented locales:

```text
pt-BR
de
fr
es
ru
```

English remains at root URLs. Localized routes use prefixes defined by `22_LOCALIZATION_SPEC.md` and retain the same English semantic slug beneath the prefix.

Examples:

```text
/gamepad-tester
/pt-br/gamepad-tester
/de/gamepad-tester
/fr/gamepad-tester
/es/gamepad-tester
/ru/gamepad-tester
```

The same route architecture applies to each V2 ToolId only when that ToolId is atomically registered with complete content for all six locales as required by `23`.

Do not translate slugs. Do not create regional Spanish duplicates by default. One `/es/` locale owns general Spanish until Search Console or fresh market evidence justifies a true regional split.

Technical loanwords such as DPI, FPS, NKRO, polling rate, ghosting, drift, deadzone, frame skipping or burn-in may remain untranslated when that is the natural technical vocabulary. Literal translation is not the objective; correct user vocabulary and measurement semantics are.

## Canonical and hreflang

Every localized URL must be self-canonical. Do not canonicalize translated pages to English.

For a semantic page that exists in all implemented languages, expected alternates are:

```text
en
pt-BR
de
fr
es
ru
```

`x-default` may point to the English version.

Rules:

- alternates must be reciprocal;
- emit alternates only for versions that actually exist;
- language switching should stay on the same semantic tool;
- do not auto-redirect crawlers/users by IP or geography;
- do not use hreflang to paper over wrong canonicals or duplicate route generation.

## Search appearance

The homepage provides the preferred site name using one `WebSite` JSON-LD node derived from the same `siteConfig.name` and canonical origin used by the product.

Keep this markup minimal:

```text
@type = WebSite
name = configured site name
url = https://hardwareinspect.com
```

Do not add speculative `Organization`, ratings, reviews, FAQ, fake usage counts/offers, or other structured data unsupported by real content.

The search-result favicon must:

- represent the approved Hardware Inspect brand mark;
- use a stable URL;
- be square;
- have a Google-supported raster fallback of at least 48×48px;
- remain crawlable together with the homepage.

Search appearance is selected algorithmically by search engines. Markup expresses a preference; it does not guarantee a particular site name, favicon, title link, or snippet.

## Measurement-honesty copy

SEO phrasing never overrides measurement truth.

Prefer the locale-equivalent of:

```text
browser-detected
browser-reported
observed
estimated
heuristic
visual inspection
camera-assisted
controlled reference
```

Do not use search-friendly wording to imply:

- direct USB/device packets when browser events are measured;
- hardware refresh-rate certification from rAF;
- confirmed keyboard ghosting from free-form browser input;
- touchscreen health from a short browser observation;
- automated pixel/backlight/uniformity/burn-in diagnosis from a visual stage;
- physical frame skipping from browser timestamps alone;
- guaranteed native panel resolution from browser screen APIs;
- printer telemetry, exact CMYK/nozzle state, or certified print accuracy;
- a camera-quality score or uploaded/recorded webcam media.

Translation must preserve the same level of uncertainty. If a natural localized phrase becomes stronger than the source claim, change it.

## Internal linking

Related links exist for useful continuation and cluster strength, not link-count maximization.

Rules:

- place related tools after the primary task/result;
- normally show 2 relevant tools, at most 3 when justified;
- only link implemented routes;
- prefer same-device/same-problem adjacency;
- avoid unrelated cross-promotion before the diagnostic;
- on localized pages, keep related links in the same locale when that localized target exists;
- an empty related set is valid for singleton channels such as Camera or Printer;
- do not turn the expanded Display cluster into an all-sibling list.

The explicit/capped V2 relation model is defined in `23_HARDWARE_EXPANSION_V2_SPEC.md`. Current implemented cluster structure remains described in `02_INFORMATION_ARCHITECTURE.md` until each V2 route is merged.

## Homepage

The homepage is a catalog/wayfinding surface, not an SEO article.

Show every **implemented** diagnostic exactly once, grouped by implemented taxonomy. Today that begins from:

```text
Controller
Mouse
Keyboard
Display
Touch
```

Expansion V2 prepares Camera and Printer taxonomy and grows Display, but empty/unimplemented groups must not be exposed. Once all V2 routes are live the implemented groups are:

```text
Controller
Mouse
Keyboard
Display
Touch
Camera
Printer
```

Use short job descriptions. Localized homepages translate navigation/catalog labels naturally without creating category landing pages solely because category headings exist.

## Current indexing boundary

The production configuration is:

```text
https://hardwareinspect.com
indexingEnabled = true
```

Current SEO verification should check, rather than assume:

1. production HTTPS and canonical origin;
2. robots behavior;
3. generated sitemap;
4. homepage `WebSite` structured data;
5. crawlable raster favicon;
6. Search Console/webmaster property and sitemap status;
7. representative URL Inspection results.

For newly released localized/V2 routes also verify:

1. correct locale URL generation;
2. correct `<html lang>`;
3. self canonical;
4. reciprocal hreflang;
5. sitemap coverage;
6. no accidental English leakage in primary UI/content;
7. no locale route canonicalized to another language;
8. no rejected synonym routes accidentally generated.

## Post-launch SEO evidence

Do not pre-optimize every title against guessed queries before the site has its own evidence.

Use Search Console to review:

- impressions and clicks per route and locale;
- actual query vocabulary;
- country distribution;
- CTR where impression volume is meaningful;
- unexpected cannibalisation between adjacent tools;
- unexpected language/canonical selection;
- pages Google chooses not to index or canonicalises unexpectedly;
- whether V2 absorbed sub-intents actually land on the intended canonical page.

A title or intent boundary should change after launch only when query/CTR evidence or a new external review gives a concrete reason. Preserve measurement honesty when doing so.

After Expansion V2, pause broad expansion research and use first-party evidence before approving another wave.

## Future content expansion

New diagnostic pages outside the currently implemented catalog and six approved V2 routes require the expansion rule from `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`:

```text
validated independent demand/opportunity
or repeated Search Console intent
or material cluster-strengthening value
```

Approved localization of an existing/approved route is governed by `22_LOCALIZATION_SPEC.md` and does not itself constitute a new diagnostic intent.

Technical feasibility or a keyword synonym alone is not enough.
