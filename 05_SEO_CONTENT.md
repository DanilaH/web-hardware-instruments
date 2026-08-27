# SEO and Content Specification

## Principle

SEO content must support the tool, not push the tool below the fold.

The interactive utility is the page's primary content.

## Above the fold

Only:

```text
H1
one concise descriptive sentence
primary tool
primary result/status
```

No FAQ, SEO paragraphs, feature grids, testimonials, long trust sections, or related-tool grids before the tool.

## Initial market / language

Initial SEO content is English and is researched against the US keyword market.

Use natural US-English wording where regional wording differs, but keep the utility itself globally usable.

Use:

```html
<html lang="en">
```

Do not create country pages, city pages, or locale folders in MVP.

## Search-first constraint

Each tool page is designed to receive direct organic landings.

The title/H1/intro must immediately match the task promised by the query, but keyword targeting must never force extra controls or duplicate pages.

Normal crawlability is enough for AI/search retrieval too. Do not add special AI-only content, hidden text, or `llms.txt` as a substitute for useful HTML content.

## Intent mapping

### `/gamepad-tester`

```text
gamepad tester
controller tester
controller test online
gamepad test online
```

### `/controller-stick-drift-test`

```text
controller stick drift test
gamepad stick drift test
stick drift test
```

Problem language:

```text
why is my controller moving by itself
how to know if my controller has stick drift
```

### `/controller-deadzone-test`

```text
controller deadzone test
gamepad deadzone test
```

### `/mouse-dpi-test`

```text
mouse dpi test
dpi tester
mouse dpi analyzer
```

Be careful with generic `dpi checker`, which can mix image and mouse intent.

### `/fps-test`

```text
fps test
fps tester
fps checker
frame rate test
```

### `/refresh-rate-test`

```text
refresh rate test
monitor refresh rate test
```

### `/keyboard-tester`

```text
keyboard tester
keyboard test
keyboard key tester
```

## Page structure

After the primary tool:

1. brief `How to use` if needed;
2. brief result explanation;
3. limitations;
4. concise FAQ based on real user questions;
5. 2–4 related tools.

Do not force every page to contain every section if it adds no value.

## Content length

There is no minimum word count.

Do not create 1000+ words merely for SEO.

Prefer concise, useful copy that directly answers questions.

## Titles

Examples:

```text
Gamepad Tester — Test Controller Buttons & Sticks
Controller Stick Drift Test — Check Analog Stick Drift
Controller Deadzone Test — Check Stick Center Noise
Mouse DPI Test — Estimate Your Mouse DPI
FPS Test — Measure Browser Frame Rate
Refresh Rate Test — Check Display Refresh Rate
Keyboard Tester — Test Keyboard Keys Online
```

## Duplicate intent

Do not make separate pages for:

```text
gamepad tester
controller tester
gamepad test online
```

when they are one intent.

## Static HTML

H1 and intro must exist in static HTML. Any below-the-fold explanatory copy and internal links included on the page must also be static HTML.

The interactive module may be client-side.

## Search / AI retrieval friendliness

Use literal, human-readable descriptions of:

- what the tool does;
- what action the user takes;
- what result it returns;
- key limitations.

Do not add artificial LLM-targeted text files or hidden content as a substitute for normal crawlable pages.

## Internal links

Related-tool links should be contextually relevant and mostly appear after the task/result.

Do not surround the primary interaction with distracting navigation.

## Indexation

Index real production pages only.

Do not index:

- debug pages;
- test fixtures;
- query variants;
- temporary experiments;
- duplicate synonym pages.

## Search Console

Track:

- impressions;
- clicks;
- query distribution;
- average position;
- country;
- device.

Do not rewrite pages constantly based on the first few days of data.


## FPS vs Refresh Rate boundary

Keep `/fps-test` and `/refresh-rate-test` as separate pages, but they must not be copy variants.

`/fps-test` owns:

```text
fps test
fps tester
fps checker
frame rate test
```

and explains short-term browser frame delivery/drops.

`/refresh-rate-test` owns:

```text
refresh rate test
monitor refresh rate test
```

and explains the inferred display refresh cadence/mode.

Do not use the same H1, intro, result wording, FAQ set, or identical visualization on both pages.

If future Search Console data shows sustained query cannibalization, review the split before creating any additional display pages.
