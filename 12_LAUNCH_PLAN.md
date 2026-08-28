# Launch Plan

## Current release boundary

The full 18-tool hardware catalog is implemented and code-side audited.

Public deployment is intentionally deferred until a real production domain is purchased immediately before release and the applicable real-device/browser/camera checks are completed.

Until that point:

- keep `https://hardware-testing.invalid` as the reserved placeholder origin;
- keep indexing disabled;
- do not publish an invented temporary production domain;
- do not claim Google Search Console or sitemap submission;
- do not substitute mocked/headless checks for required real-device/browser/camera QA.

The first public indexed release is expected to contain the current implemented catalog unless a route fails its release-ready gate and is deliberately withheld. Code completion alone does not make a hardware-dependent route release-ready.

## Pre-launch

### Global release checks

- real production domain configured;
- HTTPS works;
- canonical origin finalized;
- `indexingEnabled` reviewed and enabled only with the real origin;
- every released route returns 200;
- no placeholder/temporary routes are indexable;
- sitemap correct for the real origin;
- robots correct;
- favicon/app icons present;
- metadata complete;
- privacy page accurate;
- analytics tested if custom analytics is enabled;
- no raw device/input data sent to analytics;
- unsupported browser states tested;
- mobile smoke complete;
- current Chrome, Edge, and Firefox desktop smoke complete where the tool is desktop-relevant;
- Safari/mobile graceful-degradation gaps recorded honestly where applicable.

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

## Code-complete vs release-ready

```text
code-complete
= implementation + source-of-truth compliance + review + visual/headless review + automated validation

release-ready
= code-complete + applicable real-device/browser/camera checks
```

This distinction is permanent. Do not weaken it merely because the implementation roadmap is complete.

## Search Console

Immediately after deployment:

1. verify the production domain property;
2. submit the generated sitemap;
3. inspect the homepage;
4. inspect every released tool URL;
5. request indexing only if appropriate;
6. monitor indexing and Search Console performance.

## Initial monitoring

First week:

- 404s;
- JS errors;
- API unsupported errors;
- device connection failures;
- layout regressions;
- accidental indexing issues.

First month:

- Search Console queries;
- country split;
- impressions by page;
- unexpected problem-first queries;
- CTR;
- early position trends.

Do not overreact to early low traffic before the site has had a reasonable crawl/index/ranking window.

## Do not do after launch

Avoid:

- changing URLs casually;
- creating synonym pages;
- rewriting every title weekly;
- adding huge SEO articles due to impatience;
- purchasing/manipulating backlinks;
- creating large sets of low-value generated pages;
- adding backend complexity without product need.

## Future expansion trigger

The existing Expansion 1 catalog is complete. It no longer needs implementation-time revalidation.

Any **new** tool requires at least one strong condition:

- external research validates independent search opportunity;
- Search Console reveals recurring adjacent demand;
- the tool materially strengthens an already-successful cluster.

Technical ease alone is not enough.

## Future ad-placement boundary

Ads are not part of the current implementation scope.

When monetization is introduced later:

- no ad may appear between H1/instruction and the primary tool;
- no ad may appear inside the tool card;
- no ad may cover or shift the live visualization/result;
- first preferred placement is below the completed primary tool/result;
- ad layout must preserve the one-screen diagnostic UX where that gate applies.

Do not render empty ad placeholders before monetization is enabled. Reserve ad space only when a real integration is introduced so CLS can be managed without making the pre-monetization site look unfinished.
