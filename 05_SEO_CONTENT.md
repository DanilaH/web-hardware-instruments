# SEO and Content Rules

This document defines durable SEO/content rules for the current catalog.

Exact full-v1 title boundaries are maintained here. Exact Expansion 1 title/H1/intent boundaries are owned by `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` and must not be independently re-invented in multiple files.

## Core rule

One indexable tool route should map to one real diagnostic job/search intent.

Do not create:

- synonym pages with substantially identical tools;
- thin generated variants;
- keyword-stuffed copies;
- placeholder/coming-soon indexable routes;
- articles whose primary purpose is to occupy search space while pushing the tool below the fold.

## Search-landing independence

Assume a user may enter directly on any diagnostic route.

Every tool page should independently provide:

1. exact H1/job framing;
2. compact instruction/status;
3. primary diagnostic interaction;
4. honest result/measurement wording;
5. concise limitation/context;
6. useful explanatory content below the tool;
7. a small related-tool section after the task/result.

Do not require homepage context to understand a tool.

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
- canonical URL using the configured production origin;
- one stable intent boundary.

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

Exact H1 values are the plain tool names.

`Refresh Rate Test — Estimate Monitor Hz` intentionally keeps the measurement-honesty verb `Estimate` while using the common monitor/Hz vocabulary of the search job. Do not strengthen it into an exact hardware-certification claim.

## Expansion 1 intent ownership

For these routes, use section `SEO page intent boundaries` in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` as the exact title/H1/intent contract:

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

Do not copy those exact titles into additional normative files unless there is a strong maintenance reason; duplicated exact strings are what previously allowed drift.

## Search appearance

The homepage provides the preferred site name using one `WebSite` JSON-LD node derived from the same `siteConfig.name` and canonical origin used by the product.

Keep this markup minimal:

```text
@type = WebSite
name = configured site name
url = canonical homepage origin
```

Do not add speculative `Organization`, ratings, reviews, FAQ, or other structured data that is not supported by real page/product content.

The search-result favicon must:

- represent the approved Hardware Tests brand mark;
- use a stable URL;
- be square;
- have a Google-supported raster fallback of at least 48×48px;
- remain crawlable together with the homepage once indexing is enabled.

A browser-oriented SVG icon may exist as a source/secondary asset, but the indexed site must not rely on SVG alone for Google Search favicon eligibility.

Search appearance is still selected algorithmically by Google. Markup expresses a preference; it does not guarantee a particular site name, favicon, title link, or snippet.

## Measurement-honesty copy

SEO phrasing never overrides measurement truth.

Prefer:

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

## Internal linking

Related links exist for useful continuation and cluster strength, not link-count maximization.

Rules:

- place related tools after the primary task/result;
- normally show 2 relevant tools, at most 3 when justified;
- only link implemented routes;
- prefer same-device/same-problem adjacency;
- avoid unrelated cross-promotion before the diagnostic.

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

Use short job descriptions. Do not create category landing pages solely because the homepage uses category headings.

## Indexing boundary

Before the real production origin exists:

```text
https://hardware-testing.invalid
indexingEnabled = false
```

Robots/noindex protection must remain active and sitemap integration may remain disabled.

After the real domain is configured and release-ready checks pass:

1. replace the placeholder origin with the real canonical HTTPS origin;
2. verify homepage `WebSite` structured data resolves to that same origin;
3. verify the raster favicon is crawlable from its stable URL;
4. enable indexing;
5. verify canonical URLs, robots, and generated sitemap;
6. deploy over HTTPS;
7. connect Google Search Console;
8. submit the generated sitemap;
9. inspect the homepage and representative tool URLs with URL Inspection;
10. monitor indexing/query evidence before approving new adjacent scope.

## Post-launch SEO evidence

Do not pre-optimise every title against guessed queries before the site has its own evidence.

Use Search Console to review:

- impressions and clicks per route;
- actual query vocabulary;
- CTR where impression volume is meaningful;
- unexpected cannibalisation between adjacent tools;
- pages Google chooses not to index or canonicalises unexpectedly.

A title or intent boundary should change after launch only when query/CTR evidence or a new external review gives a concrete reason. Preserve measurement honesty when doing so.

## Future content expansion

New pages require the expansion rule from `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`:

```text
validated independent demand/opportunity
or repeated Search Console intent
or material cluster-strengthening value
```

Technical feasibility or a keyword synonym alone is not enough.
