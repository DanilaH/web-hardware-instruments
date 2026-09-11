# Launch Plan

## Current release boundary

After the Screen Resolution Checker Expansion V2 wave, the 23-tool hardware/output catalog is implemented code-side. Full v1, Expansion 1, localization, the V2 Foundation, Printer Test Page, Monitor Test, Screen Uniformity Test, OLED Burn-In Test, and Screen Resolution Checker have passed their respective code-side implementation/review gates once this wave merges; each V2 job still needs its own wave-specific release evidence.

The production origin is already configured as:

```text
https://hardwareinspect.com
indexingEnabled = true
```

Historical instructions referring to `hardware-testing.invalid`, deferred domain purchase, or globally disabled indexing are no longer current state.

Do not infer that every external release step has been completed merely from the code configuration. Current production status must be verified from actual deployment/Search Console evidence.

Implemented locales are:

```text
en
pt-BR
de
fr
es
ru
```

Every registered V2 ToolId must ship across this same set atomically. Localization must not duplicate or fork diagnostic logic.

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
- no raw device/input/document/media data is sent to analytics;
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
- Frame Skipping checked with a real camera and multiple valid photographs; screenshots are not evidence;
- Monitor Test start/fullscreen/fallback/exit flow checked in current desktop browsers;
- Monitor Test click/tap/Space/arrow navigation and hide-controls behavior checked;
- the 12 Monitor patterns are visually reviewed on a real display without turning that observation into proof that the panel has or lacks physical defects;
- Screen Uniformity Test start/fullscreen/fallback/exit flow checked in current desktop browsers;
- Screen Uniformity Test click/tap/Space/arrow navigation and hide-controls behavior checked;
- the six encoded gray/white presets are visually reviewed on a real display from normal viewing conditions without converting visible variation into an automatic defect verdict;
- OLED Burn-In Test start/fullscreen/fallback/exit flow checked in current desktop browsers;
- OLED Burn-In Test click/tap/Space/arrow navigation and hide-controls behavior checked;
- the eight OLED solid/gray patterns are visually reviewed on a real display without treating a visible shape as proof of permanent burn-in, temporary retention, panel uniformity failure, tint or mura;
- Screen Resolution Checker shows an immediate browser-reported screen size without a Start action;
- viewport values update on resize and orientation-dependent values update when applicable;
- estimated device-pixel dimensions stay visibly labelled as estimated and are not presented as native/physical panel resolution;
- no Multi-Screen Window Placement permission is requested.

Printer Test Page:

- Chrome print preview flow;
- Firefox print preview flow;
- A4 portrait fit;
- Letter portrait fit;
- Full / Color / Grayscale profile output;
- explicit 100% / Actual Size guidance;
- no site chrome in print output;
- essential text/line/alignment/grayscale/color references are foreground/vector content rather than depending only on background-graphics printing;
- cancelling print returns to a usable page;
- no printer telemetry/health/nozzle/CMYK-certification claim.

Physical printer output is useful optional evidence but must not be fabricated. Browser/headless print-media checks prove layout/flow, not ink/toner/device behavior.

Every untested browser/hardware/physical-output case must be documented rather than inferred from mocks.

## Localization rollout

The initial localization rollout is complete for `pt-BR`, `de`, `fr`, `es`, and `ru`. The phased L0–L4 sequence is historical implementation context; future V2 jobs do **not** repeat that phased release. Each new V2 ToolId ships all six locale versions together.

For every V2 localization wave verify:

- root EN route + all five locale-prefixed alternates exist;
- correct `<html lang>`;
- self canonical;
- reciprocal `en` / `pt-BR` / `de` / `fr` / `es` / `ru` hreflang;
- localized H1/title/meta;
- localized primary controls/status/errors/instructions;
- localized navigation and related-tool links where applicable;
- no unexpected English leakage in the primary task flow;
- measurement/capability wording remains no stronger than the English source;
- sitemap contains every shipped alternate.

### Phase-2 language watchlist

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
= code-complete + applicable real-device/browser/camera/print-preview/display checks
```

For a translated route, add:

```text
locale-ready
= code-complete + localized content/runtime coverage + routing/canonical/hreflang/sitemap QA
```

This distinction is permanent. Translation passing tests does not prove real hardware or physical printer behavior.

## Search Console / webmaster tools

For the production site:

1. keep the existing `hardwareinspect.com` property/site registrations;
2. keep the generated sitemap submitted;
3. after a new wave reaches production, inspect the new root route and representative localized alternates when useful;
4. review canonical/language signals;
5. monitor indexing, queries, CTR and page performance.

Do not create separate site properties merely because a route has localized alternates unless a webmaster platform explicitly requires it.

After each V2 wave:

1. verify new URLs appear in the sitemap;
2. verify Google/Bing/Yandex recrawl/indexing state through the existing site properties where available;
3. monitor impressions/clicks by page and country;
4. review actual localized query vocabulary;
5. look for accidental English/localized cannibalization or incorrect alternate selection;
6. tune titles/copy only when query/CTR evidence supports it.

## Initial monitoring

After production or locale deployment:

- 404s;
- JS errors;
- API unsupported errors;
- device/permission failures where relevant;
- print-flow failures for Printer Test Page;
- fullscreen/fallback/navigation failures for Monitor Test, Screen Uniformity Test and OLED Burn-In Test;
- stale/incorrect screen or viewport values in Screen Resolution Checker after resize/orientation changes;
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
- translating slugs in the current localization model;
- creating synonym pages;
- auto-redirecting by IP/geography;
- rewriting every title weekly;
- adding huge SEO articles due to impatience;
- purchasing/manipulating backlinks;
- creating large sets of low-value generated pages;
- adding backend complexity without product need.

## Future expansion trigger

Expansion 1 is complete. Expansion V2 is approved only for the exact six jobs in `23_HARDWARE_EXPANSION_V2_SPEC.md`; Printer Test Page, Monitor Test, Screen Uniformity Test, OLED Burn-In Test, and Screen Resolution Checker are implemented in the first five waves. Webcam remains the final approved V2 job and must follow its reviewed atomic wave.

Any diagnostic job **outside** that approved V2 set requires at least one strong condition:

- external research validates independent search opportunity;
- Search Console reveals recurring adjacent demand;
- the tool materially strengthens an already-successful cluster.

Adding an approved language version of an existing tool is governed by the localization architecture and is not a new diagnostic job.

Technical ease alone is not enough for either new tools or unapproved phase-2 languages.

## Future ad-placement boundary

Ads are not part of the current implementation scope.

When monetization is introduced later:

- no ad may appear between H1/instruction and the primary tool;
- no ad may appear inside the tool card;
- no ad may cover or shift the live visualization/result;
- first preferred placement is below the completed primary tool/result;
- ad layout must preserve the one-screen diagnostic UX where that gate applies.
