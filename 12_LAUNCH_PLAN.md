# Launch Plan

## Current release boundary

The full 18-tool hardware catalog is implemented and code-side audited.

The production origin is already configured as:

```text
https://hardwareinspect.com
indexingEnabled = true
```

Historical instructions referring to `hardware-testing.invalid`, deferred domain purchase, or globally disabled indexing are no longer current state.

Do not infer that every external release step has been completed merely from the code configuration. Current production status must be verified from actual deployment/Search Console evidence.

Localization of the existing catalog is now approved under `22_LOCALIZATION_SPEC.md` for:

```text
pt-BR
de
fr
es
ru
```

Localization is an additive release stream over the same 18 diagnostic jobs. It must not duplicate or fork diagnostic logic.

## Production verification

### Global checks

- `https://hardwareinspect.com` resolves over HTTPS;
- canonical origin is `https://hardwareinspect.com` everywhere;
- homepage `WebSite` structured data resolves to that same canonical origin and configured site name;
- every released English route returns 200;
- no placeholder/temporary routes are indexable;
- sitemap uses the production origin;
- robots behavior is correct;
- branded favicon/site icon is crawlable;
- Google Search favicon fallback is square, at least 48×48px, uses a supported raster format, and has a stable URL;
- metadata is complete and unique for each search landing;
- privacy page is accurate;
- analytics is tested if custom analytics is enabled;
- no raw device/input data is sent to analytics;
- unsupported-browser states are tested;
- mobile smoke is complete;
- current Chrome, Edge, and Firefox desktop smoke is complete where the tool is desktop-relevant;
- Safari/mobile graceful-degradation gaps are recorded honestly where applicable.

### Real hardware / browser checks

Controller cluster:

- real controller smoke for Gamepad Tester;
- Stick Drift and Deadzone tested with a standard-mapped controller;
- disconnect, controller selection, and mapping limitations checked where applicable.

Keyboard cluster:

- real Keyboard Tester smoke;
- Rollover held-set/max behavior checked with real simultaneous presses;
- Ghosting guided presets checked without treating reserved shortcuts as hardware failure.

Mouse cluster:

- Mouse Tester / Button / Scroll / Double Click smoke with a real mouse;
- side-button navigation/context-menu behavior checked where applicable;
- Polling Rate checked with continuous real movement and source/caveat wording reviewed;
- Mouse DPI Pointer Lock/fallback flow and measured-distance caveats manually reviewed.

Touch cluster:

- real touch-device smoke for coverage, edges/corners, multi-touch, confirmation pass, and hands-off observation;
- blur/hidden invalidation checked;
- fullscreen/fallback behavior checked on a touch-capable device.

Display cluster:

- FPS and Refresh Rate checked on available display/browser combinations, including high-refresh or multi-monitor behavior where available;
- Dead Pixel and Backlight Bleed fullscreen/fallback flow checked on real display hardware;
- Frame Skipping checked with a real camera and multiple valid photographs; screenshots are not evidence.

Every untested browser/hardware case must be documented rather than inferred from mocks.

## Localization rollout

### Phase L0 — i18n infrastructure

Before shipping any translated URL:

- introduce the locale registry/routing helpers from `22_LOCALIZATION_SPEC.md`;
- preserve all existing English URLs and behavior;
- make `<html lang>` locale-aware;
- make canonical generation locale-aware;
- implement reciprocal hreflang generation;
- make tool catalog / related-tool links locale-aware;
- extract all user-visible runtime controller strings from hardcoded English into typed locale messages;
- keep diagnostic algorithms/services/renderers single-source;
- add locale-aware sitemap output through the existing Astro static build.

### Phase L1 — pt-BR validation locale

Ship `pt-BR` first because it has the strongest sampled quantitative evidence.

Before indexing the locale verify representative pages from every device cluster:

```text
/pt-br/gamepad-tester
/pt-br/mouse-tester
/pt-br/keyboard-tester
/pt-br/refresh-rate-test
/pt-br/touch-screen-test
```

Checks:

- 200 response;
- `lang="pt-BR"`;
- self canonical;
- reciprocal `en` + `pt-BR` hreflang;
- localized H1/title/meta;
- localized primary tool status/actions/errors;
- localized navigation and related-tool links;
- no unexpected English leakage in the primary task flow;
- measurement wording remains no stronger than the English source;
- sitemap contains each shipped localized URL.

### Phase L2 — de + fr

After the architecture is clean, add German and French using the same message/content contracts. Do not fork components or controllers.

### Phase L3 — es

Add one general Spanish `/es/` locale. Do not create `es-ES`/`es-MX` regional duplicates without first-party evidence.

### Phase L4 — ru

Add Russian `/ru/`. Exact Russia/Yandex keyword volume is not claimed; measure this locale primarily from real indexing/GSC and, where available, Yandex evidence.

### Phase-2 watchlist

Do not automatically add:

```text
pl
it
tr
```

Revisit after first-party localization results or a focused new market decision.

## Code-complete vs release-ready

```text
code-complete
= implementation + source-of-truth compliance + review + visual/headless review + automated validation

release-ready
= code-complete + applicable real-device/browser/camera checks
```

For a translated locale, add:

```text
locale-ready
= code-complete + localized content/runtime coverage + routing/canonical/hreflang/sitemap QA
```

This distinction is permanent. Translation passing tests does not prove real hardware behavior.

## Search Console

For the production site:

1. verify access to the `hardwareinspect.com` property;
2. submit/verify the generated sitemap;
3. inspect the homepage and representative English tool URLs;
4. review canonical/site-name/favicon signals;
5. monitor indexing, queries, CTR and page performance.

After each localization wave:

1. verify localized URLs appear in the sitemap;
2. inspect representative localized URLs;
3. verify Google-selected canonical and detected language;
4. monitor impressions/clicks by page and country;
5. review actual localized query vocabulary;
6. look for accidental English/localized cannibalization or incorrect alternate selection;
7. tune titles/copy only when query/CTR evidence supports it.

## Initial monitoring

After production or locale deployment:

- 404s;
- JS errors;
- API unsupported errors;
- device connection failures;
- layout regressions from longer translated strings;
- accidental indexing/noindex issues;
- unexpected canonical selection;
- missing/incorrect hreflang;
- language-switch links pointing to the wrong semantic page;
- untranslated runtime strings;
- missing/incorrect site-name or favicon search appearance after recrawl.

First meaningful evidence window:

- Search Console queries;
- country split;
- impressions by page/locale;
- unexpected problem-first queries;
- query overlap/cannibalisation between adjacent tools;
- CTR;
- early position trends.

Do not overreact to early low traffic before the site has had a reasonable crawl/index/ranking window.

## Do not do after launch

Avoid:

- changing English URLs casually;
- translating slugs in the first localization implementation;
- creating synonym pages;
- auto-redirecting by IP/geography;
- rewriting every title weekly;
- adding huge SEO articles due to impatience;
- purchasing/manipulating backlinks;
- creating large sets of low-value generated pages;
- adding backend complexity without product need.

## Future expansion trigger

The existing Expansion 1 catalog is complete. It no longer needs implementation-time revalidation.

Any **new diagnostic job** requires at least one strong condition:

- external research validates independent search opportunity;
- Search Console reveals recurring adjacent demand;
- the tool materially strengthens an already-successful cluster.

Adding an approved language version of an existing tool is governed by `22_LOCALIZATION_SPEC.md` and is not a new diagnostic job.

Technical ease alone is not enough for either new tools or unapproved phase-2 languages.

## Future ad-placement boundary

Ads are not part of the current implementation scope.

When monetization is introduced later:

- no ad may appear between H1/instruction and the primary tool;
- no ad may appear inside the tool card;
- no ad may cover or shift the live visualization/result;
- first preferred placement is below the completed primary tool/result;
- ad layout must preserve the one-screen diagnostic UX where that gate applies.

Do not render empty ad placeholders before monetization is enabled.
