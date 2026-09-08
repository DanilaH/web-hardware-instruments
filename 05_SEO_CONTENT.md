# SEO and Content Rules

This document defines durable SEO/content rules for the current catalog.

Exact full-v1 title boundaries are maintained here. Exact Expansion 1 title/H1/intent boundaries are owned by `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`. Localization routing, terminology, hreflang/canonical behavior, and runtime-message i18n are owned by `22_LOCALIZATION_SPEC.md`.

## Core rule

One indexable tool route should map to one real diagnostic job/search intent.

Do not create:

- synonym pages with substantially identical tools;
- thin generated variants;
- keyword-stuffed copies;
- placeholder/coming-soon indexable routes;
- articles whose primary purpose is to occupy search space while pushing the tool below the fold.

Localized alternates of the same semantic tool are allowed under approved locale prefixes. They are language versions of one existing job, not permission to create locale-specific synonym routes.

## Search-landing independence

Assume a user may enter directly on any diagnostic route, including a localized route.

Every tool page should independently provide:

1. exact H1/job framing;
2. compact instruction/status;
3. primary diagnostic interaction;
4. honest result/measurement wording;
5. concise limitation/context;
6. useful explanatory content below the tool;
7. a small related-tool section after the task/result.

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

## Current full-v1 title boundaries

```text
Gamepad Tester — Test Controller Buttons & Sticks
Controller Stick Drift Test — Check Analog Stick Drift
Controller Deadzone Test — Check Stick Center Noise
Mouse DPI Test — Estimate Your Mouse DPI
FPS Test — Check Browser Frame Rate
Refresh Rate Test — Estimate Monitor Hz
Keyboard Tester — Test Keyboard Keys Online
```

Exact English H1 values are the plain tool names.

`Refresh Rate Test — Estimate Monitor Hz` intentionally keeps the measurement-honesty verb `Estimate` while using the common monitor/Hz vocabulary of the search job. Do not strengthen it into an exact hardware-certification claim in English or translation.

## Expansion 1 intent ownership

For these routes, use section `SEO page intent boundaries` in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` as the exact English title/H1/intent contract:

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

Do not copy those exact titles into additional normative files unless there is a strong maintenance reason.

## Localization ownership

Approved initial locales:

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

Do not translate slugs in the first localization implementation.

Do not create regional Spanish duplicates by default. One `/es/` locale owns general Spanish until Search Console or fresh market evidence justifies a true regional split.

Technical loanwords such as DPI, FPS, NKRO, polling rate, ghosting, drift, deadzone or frame skipping may remain untranslated when that is the natural technical search vocabulary. Literal translation is not the objective; correct user vocabulary and measurement semantics are.

## Canonical and hreflang

Every localized URL must be self-canonical. Do not canonicalize translated pages to English.

For a semantic page that exists in all initial languages, expected alternates are:

```text
en
pt-BR
de
fr
es
ru
```

Optional `x-default` may point to the English version.

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

Do not add speculative `Organization`, ratings, reviews, FAQ, or other structured data that is not supported by real page/product content.

The search-result favicon must:

- represent the approved Hardware Inspect brand mark;
- use a stable URL;
- be square;
- have a Google-supported raster fallback of at least 48×48px;
- remain crawlable together with the homepage.

A browser-oriented SVG icon may exist as a source/secondary asset, but the indexed site must not rely on SVG alone for Google Search favicon eligibility.

Search appearance is selected algorithmically by Google. Markup expresses a preference; it does not guarantee a particular site name, favicon, title link, or snippet.

## Measurement-honesty copy

SEO phrasing never overrides measurement truth.

Prefer the locale-equivalent of:

```text
browser-detected
observed
estimated
heuristic
visual inspection
camera-assisted
```

Do not use search-friendly wording to imply:

- direct USB/device packets when browser events are measured;
- hardware refresh-rate certification from rAF;
- confirmed keyboard ghosting from free-form browser input;
- touchscreen health from a short browser observation;
- automated pixel/backlight diagnosis from a visual stage;
- physical frame skipping from browser timestamps alone.

Translation must preserve the same level of uncertainty. If a natural localized phrase becomes stronger than the source claim, change it.

## Internal linking

Related links exist for useful continuation and cluster strength, not link-count maximization.

Rules:

- place related tools after the primary task/result;
- normally show 2 relevant tools, at most 3 when justified;
- only link implemented routes;
- prefer same-device/same-problem adjacency;
- avoid unrelated cross-promotion before the diagnostic;
- on localized pages, keep related links in the same locale when that localized target exists.

Current cluster structure is defined in `02_INFORMATION_ARCHITECTURE.md`.

## Homepage

The homepage is a catalog/wayfinding surface, not an SEO article.

With the current catalog size, group implemented tools by:

```text
Controller
Mouse
Keyboard
Display
Touch
```

Use short job descriptions. Localized homepages should translate these navigation/catalog labels naturally without creating category landing pages solely because category headings exist.

## Current indexing boundary

The current production configuration is:

```text
https://hardwareinspect.com
indexingEnabled = true
```

This supersedes historical pre-launch placeholder instructions.

Current SEO verification should check, rather than assume:

1. production HTTPS and canonical origin;
2. robots behavior;
3. generated sitemap;
4. homepage `WebSite` structured data;
5. crawlable raster favicon;
6. Search Console property/access and sitemap status;
7. representative URL Inspection results.

Localization adds these checks:

1. correct locale URL generation;
2. correct `<html lang>`;
3. self canonical;
4. reciprocal hreflang;
5. localized sitemap coverage;
6. no accidental English leakage in primary UI/content;
7. no locale route canonicalized to another language.

## Post-launch SEO evidence

Do not pre-optimize every title against guessed queries before the site has its own evidence.

Use Search Console to review:

- impressions and clicks per route and locale;
- actual query vocabulary;
- country distribution;
- CTR where impression volume is meaningful;
- unexpected cannibalisation between adjacent tools;
- unexpected language/canonical selection;
- pages Google chooses not to index or canonicalises unexpectedly.

A title or intent boundary should change after launch only when query/CTR evidence or a new external review gives a concrete reason. Preserve measurement honesty when doing so.

## Future content expansion

New diagnostic pages require the expansion rule from `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`:

```text
validated independent demand/opportunity
or repeated Search Console intent
or material cluster-strengthening value
```

Approved localization of an existing route is governed by `22_LOCALIZATION_SPEC.md` and does not itself constitute a new diagnostic intent.

Technical feasibility or a keyword synonym alone is not enough.
