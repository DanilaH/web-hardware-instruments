# Global Goals and Release Strategy

This document defines why the product exists, what success means, what gets built first, and what must remain out of scope.

`18_DECISIONS_AND_BOUNDARIES.md` remains the source of truth for exact implementation algorithms and browser behavior.

# 1. Business thesis

Build a portfolio-style, low-maintenance browser utility asset.

The intended model is:

```text
organic search traffic
→ user completes a useful diagnostic
→ optional natural navigation to a related tool
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

# 2. Acquisition

Primary acquisition channel:

```text
Google organic search
```

Initial content/search-market target:

```text
English
US keyword market
```

The actual tools should remain globally usable.

Do not create geo pages or US-only product behavior merely because the initial keyword research is US-focused.

# 3. Core product promise

A user arriving directly from search should:

1. understand the job within a few seconds;
2. immediately know what to do;
3. perform the diagnostic without login/install;
4. see the result in the same tool region;
5. understand the limitation of the measurement;
6. optionally discover one or two relevant next diagnostics.

Do not optimize for artificial dwell time.

Useful task completion is the retention mechanism.

# 4. Cost / maintenance constraint

The site should remain close to a static asset operationally.

Expected ongoing infrastructure:

```text
static hosting
Search Console
optional lightweight analytics
future ads
```

Avoid any feature that creates recurring operational burden without strong evidence of value.

Examples to avoid:

```text
backend services
databases
scheduled jobs
external data feeds
account support
paid runtime APIs
manual hardware catalogs
```

# 5. Product design constraint

The product is simple but not visually generic.

Use functional beauty:

```text
measurement visualization
data-driven motion
strong numeric hierarchy
instrument-like visual language
```

Every visual must improve task execution or diagnostic understanding.

No decorative feature exists merely to make the site feel larger or more premium.

# 6. SEO constraint

Each page maps to one real job/intent.

Do not create:

- synonym pages;
- thin generated pages;
- keyword-stuffed copies;
- placeholder/coming-soon indexable pages;
- huge SEO articles that push the tool downward.

Tool first. Search content supports the tool.

# 7. Public deployment boundary

The original staged-release intent was to publish the first four tools before finishing the full catalog so Search Console could begin collecting evidence early. Public deployment is now intentionally deferred until a real domain is purchased immediately before deployment.

This changes sequencing, not the launch-quality requirements:

- full-v1 development may continue while the reserved placeholder origin and `noindex` protection remain active;
- do not invent or temporarily publish a fake production origin merely to preserve the earlier release sequence;
- before the first public indexed deployment, set the real production origin, complete required real-device/browser smoke, enable indexing, deploy, set up Google Search Console, and submit the generated sitemap.

The first public deployment may therefore contain every approved tool that has passed its implementation/review gates by that time.

# 8. Full v1

Approved full-v1 catalog:

```text
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test
/keyboard-tester
/fps-test
/refresh-rate-test
/mouse-dpi-test
```

Build and review each page independently and keep each polished enough to ship on its own. Do not use the deferred deployment decision as permission to bundle unfinished work or weaken review gates.

Full v1 is complete when all seven approved tools are production-ready in code and the final audit is complete. Public indexing/deployment remains a separate explicit boundary immediately afterward.

# 9. Expansion rule

After full v1, a new tool is built only when at least one strong reason exists:

```text
research validates independent demand/opportunity
Search Console exposes repeated adjacent intent
the tool materially strengthens a successful existing cluster
```

Being technically possible is not enough.

Do not expand the catalog for completeness.

# 10. Measurement of success

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

Do not treat a technically working site as proof that the business hypothesis worked.

Do not treat early low traffic as failure before the site has had a reasonable indexing/ranking window.

# 11. Monetization boundary

Display ads are a later layer, not an MVP dependency.

When enabled:

- no ad before the primary tool;
- no ad inside the tool;
- no overlay on diagnostic state/result;
- no layout shift that breaks one-screen tool usage;
- first preferred ad placement is after the tool/result.

Do not add empty ad boxes before monetization begins.

# 12. Global priorities

When choices conflict, use this order:

```text
1. User understands the task
2. User completes it easily
3. Result is honest and useful
4. Tool remains lightweight and low-maintenance
5. Page remains strong for search intent
6. Functional visual polish
7. Additional features
```

Feature richness is last.
