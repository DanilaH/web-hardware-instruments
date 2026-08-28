# Launch Plan

## Current release boundary

All seven full-v1 tools are implemented and audited. Post-v1 Hardware Expansion 1 is also approved for sequential implementation under `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`.

Public deployment is intentionally deferred until a real production domain is purchased immediately before release.

Until that point:

- keep `https://hardware-testing.invalid` as the reserved placeholder origin;
- keep indexing disabled;
- do not publish an invented temporary production domain;
- do not claim Google Search Console or sitemap submission;
- do not substitute mocked/headless checks for required real-device/browser/camera QA.

The first public release may contain full v1 plus any Expansion 1 routes that are actually implemented and have passed their route-specific release-ready gates by deployment time. Approval alone does not make an unfinished route releasable or linkable.

## Pre-launch

Global release checks:

- real production domain configured
- HTTPS works
- canonical origin finalized
- `indexingEnabled` reviewed and enabled only with the real origin
- every route included in the release returns 200
- no placeholder/temporary routes are indexable
- sitemap correct for the real origin
- robots correct
- favicon/app icons present
- metadata complete
- privacy page accurate
- analytics tested if custom analytics is enabled
- no raw device/input data sent to analytics
- unsupported browser states tested
- mobile smoke complete
- latest Chrome, Edge, and Firefox desktop smoke complete where the tool is desktop-relevant
- Safari/mobile graceful-degradation gaps recorded honestly where applicable

Full-v1 hardware/browser checks:

- real controller QA complete for Gamepad Tester, Stick Drift, and Deadzone where required hardware is available
- real keyboard QA complete for Keyboard Tester
- display QA complete for FPS Test and Refresh Rate Test, including high-refresh/multi-monitor behavior where hardware is available
- Mouse DPI capture/fallback behavior and physical-distance caveats manually reviewed

Expansion 1 checks apply only to routes included in the release, but must not be skipped for those routes:

- real mouse smoke for Mouse Tester / Button / Scroll / Double Click / Polling as required by `20`
- side-button navigation/context-menu behavior checked where applicable
- real touch-device smoke for Touch Screen Test, including coverage, multi-touch, hands-off visibility/focus invalidation, and fullscreen/fallback behavior
- real keyboard smoke for Rollover/Ghosting guided flows
- Dead Pixel and Backlight fullscreen/fallback visual flow checked on real display hardware
- Frame Skipping checked with a real camera and multiple valid photographs; screenshots are not evidence
- every untested browser/hardware case documented rather than inferred from mocks

A route may be `code-complete` before these external checks, but it is not `release-ready` until its applicable real-device/browser/camera gate is satisfied.

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

- 404s
- JS errors
- API unsupported errors
- device connection failures
- layout regressions
- accidental indexing issues

First month:

- Search Console queries
- country split
- impressions by page
- unexpected problem-first queries
- CTR
- early position trends

## Do not do after launch

Avoid:

- changing URLs casually;
- creating synonym pages;
- rewriting every title weekly;
- adding huge SEO articles due to impatience;
- purchasing/manipulating backlinks;
- creating 100 low-value generated pages;
- adding backend complexity without product need.

## Expansion trigger outside approved Expansion 1

Expansion 1 has already passed its research/cluster-fit promotion gate and should not be re-litigated during implementation.

For any future tool **outside Expansion 1**, require at least one strong condition:

- research independently validates its search opportunity;
- Search Console reveals recurring adjacent demand;
- it materially improves the existing cluster.

Technical ease alone is not enough.

## Future ad-placement boundary

Ads are not part of the current implementation scope.

When monetization is introduced later:

- no ad may appear between H1/instruction and the primary tool;
- no ad may appear inside the tool card;
- no ad may cover or shift the live visualization/result;
- first preferred placement is below the completed primary tool/result;
- ad layout must preserve the one-screen diagnostic UX for the tool itself where that gate applies.

## Ad-layout future proofing

Do not render empty ad placeholders before monetization is enabled.

When ads are eventually enabled, reserve their space only then so the chosen ad integration can avoid CLS without making the pre-monetization site look unfinished.
