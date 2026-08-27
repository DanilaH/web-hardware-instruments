# Launch Plan

## Pre-launch

- production domain configured
- HTTPS works
- canonical origin finalized
- every route included in the current release returns 200
- temporary routes removed/noindexed
- sitemap correct
- robots correct
- favicon/app icons present
- metadata complete
- privacy page accurate
- analytics tested if custom analytics is enabled
- no raw device data sent to analytics
- unsupported browser states tested
- mobile smoke complete
- real controller QA complete if a controller tool is included in the current release
- real keyboard QA complete if Keyboard Tester is included in the current release
- display QA complete if FPS Test or Refresh Rate Test is included in the current release
- mouse DPI caveats reviewed if Mouse DPI Test is included in the current release

## Search Console

Immediately after deployment:

1. verify domain property;
2. submit sitemap;
3. inspect homepage;
4. inspect every tool URL included in the release;
5. request indexing only if appropriate;
6. monitor indexing and Search Console performance;
7. submit/inspect later tool URLs as they are deployed.

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

## Expansion trigger

Add a new tool when at least one condition is true:

- research independently validates its search opportunity;
- Search Console reveals recurring adjacent demand;
- it materially improves the existing cluster;
- it is extremely cheap and useful without diluting site quality.


## Future ad-placement boundary

Ads are not part of MVP.

When monetization is introduced later:

- no ad may appear between H1/instruction and the primary tool;
- no ad may appear inside the tool card;
- no ad may cover or shift the live visualization/result;
- first preferred placement is below the completed primary tool/result;
- ad layout must preserve the one-screen diagnostic UX for the tool itself.


## Release strategy

Do not block the first production deployment on all seven full-v1 tools.

The first search-validation release is defined in `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`.

Later full-v1 tools are added as real production pages, not placeholders.

## Ad-layout future proofing

Do not render empty ad placeholders in MVP.

When ads are eventually enabled, reserve their space only then so the chosen ad integration can avoid CLS without making the pre-monetization site look unfinished.
