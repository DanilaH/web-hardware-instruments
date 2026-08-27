# Hardware Testing Research Evidence — August 2026

> Non-normative research context. This file explains why the initial tools were selected. It does not define implementation behavior; numbered product documents remain authoritative.

## Research thesis

Hardware Testing was selected because it is not a single utility-intent bet. It is a cluster of independently validated browser-diagnostic jobs that can live in one low-cost static site.

The investment logic is:

```text
multiple independent SEO bets
inside one inexpensive static product
```

The project does not require every page to win. If a subset gains meaningful search visibility, the cluster can still become a useful portfolio asset.

## Initial validated submarkets

Research covered:

- Gamepad Tester / Controller Tester
- Controller Stick Drift
- Controller Deadzone
- Mouse DPI
- FPS / Frame Rate
- Refresh Rate
- Keyboard Tester

The first production release intentionally selects four independent entry points before the remaining full-v1 pages:

```text
/gamepad-tester
/fps-test
/refresh-rate-test
/mouse-dpi-test
```

This allows crawl/indexing/Search Console evidence to begin before the complete seven-tool catalog exists.

## Gamepad / controller evidence

Keyword Surfer snapshots:

```text
gamepad tester      ~33.1K US monthly volume
controller tester   ~27.1K US monthly volume
```

Manual Ahrefs traffic estimates observed during research:

```text
gpadtester.com              ~64.5K organic / ~$8.1K traffic value
joypad.ai                   ~56.6K organic / ~$7.2K
gamespadtester.com          ~46.3K organic / ~$4K
gamepad-tester.net          ~32.1K organic / ~$3.2K
controllertestonline.com    ~742 organic, very new entrant
```

Observed weak/new entrants included:

```text
controllertestonline.com    DR ~0.1, Jun 2026
gamespadtester.com          DR ~24, Jan 2026
gamepad-tester.net          DR ~6, Jul 2025
gpadtester.com              DR ~17, Jul 2024
joypad.ai                   DR ~13, Jun 2024
```

Core controller-testing terms dominated traffic on the strongest examples, which made this a meaningful traffic proof rather than unrelated domain traffic.

## Mouse DPI evidence

Strong low-authority example observed:

```text
mousedpianalyzers.com
DR ~1.4
~36.9K Ahrefs organic/month
traffic value ~$9.7K
```

Top terms were centered on the intended job:

- dpi checker
- dpi test
- mouse dpi

A second relevant example, `mousedpianalyzer.com`, was observed at roughly ~38.8K organic traffic.

The backlink profile of the strongest example contained many low-quality/irrelevant links, so the authority barrier did not appear to be an obvious hidden moat.

## Display evidence

Keyword Surfer snapshots:

```text
frame rate test      ~14.8K
refresh rate test    ~3.6K
frame skipping test  ~210
```

Weak/new ranking examples included:

```text
frameratetest.com           DR ~3.7, Jan 2025
fpscount.com                DR ~0, Aug 2025
whatismyrefreshrate.com     DR ~0, Jan 2026
```

Manual Ahrefs traffic estimates observed:

```text
frameratetest.com           ~33.2K organic / ~$3.4K traffic value
fpscount.com                ~2.3K organic / ~$488
whatismyrefreshrate.com     ~2.2K organic / ~$162, fast growth
```

Target FPS/refresh-rate terms were prominent in traffic, supporting the intended search jobs.

## Why the project was promoted to BUILD

The research conclusion was stronger than a single keyword-volume observation:

- multiple independently useful jobs exist;
- several weak or relatively young sites receive targeted organic traffic;
- core intent dominates traffic for important examples;
- the implementation can remain browser-native and static;
- operational cost is close to zero;
- no obvious backend, data-maintenance, account, or paid-API moat exists;
- the product can be released incrementally and cheaply falsified with Search Console.

Internal research rating at selection time:

```text
🔥🔥🔥 — priority BUILD
```

## Research limitations

These values are snapshots, not guarantees.

- Keyword Surfer volumes are estimates.
- Ahrefs organic traffic is an estimate, not Analytics.
- Ahrefs traffic value is equivalent PPC value, not expected display-ad revenue.
- Research used US keyword-market demand, while actual tools should remain globally usable.
- Final proof must come from the site's own crawl/indexing, Search Console impressions/queries, rankings, clicks, and later monetization economics.

## Next evidence step

Do not repeat broad validation before launch merely to increase confidence.

```text
ship
→ crawl/index
→ Search Console
→ impressions and queries
→ ranking movement
→ clicks
```
