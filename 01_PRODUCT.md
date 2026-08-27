# Product Specification

## Product thesis

A browser can observe enough device/input/rendering behavior to provide useful lightweight diagnostics without installing software.

The product converts those browser capabilities into small tools with extremely low interaction cost.

## Business and growth objective

The product is a portfolio-style SEO utility asset.

Primary acquisition:

```text
Google organic search
```

Initial content language / search-market target:

```text
English
US keyword market
```

The tools remain globally usable; do not add unnecessary US-only behavior to the product itself.

Expected monetization later:

```text
display ads
```

Not part of the business model:

```text
subscriptions
accounts
paid feature tiers
lead capture
newsletter funnels
```

The site should remain inexpensive to host and inexpensive to maintain.

## Validation model

Shipping and Search Console feedback matter more than completing every conceivable hardware test.

The product should be cheap to falsify:

```text
build a polished narrow tool
ship it
collect indexing/impression/query evidence
expand only when research or Search Console supports the next page
```

Do not delay search feedback in order to make the first release feel “complete”.

## Product priority order

When requirements conflict, use this order:

```text
1. User understands what to do
2. User can perform the test immediately
3. Result is easy to understand
4. Measurement is technically honest
5. Page is fast and accessible
6. SEO/content supports discovery
7. Additional metrics/features
```

Feature richness is deliberately last.

## Primary user jobs

### Controller

- Verify that a controller is detected
- Verify buttons and sticks
- Check whether untouched sticks drift
- Estimate a practical starting deadzone

### Mouse

- Estimate DPI from a known physical travel distance

### Display

- Observe browser frame cadence
- Estimate display refresh rate

### Keyboard

- Verify that physical key presses register

## Core UX promise

A visitor should not have to learn the product before using it.

Each page should answer visually:

```text
What am I testing?
What do I do right now?
What happened?
```

The answer to the second question must be obvious without reading below-the-fold content.

## One-screen rule

On a normal desktop viewport, the primary tool must fit into one screen.

Target:

```text
1366 × 768 minimum
1440 × 900 preferred
```

The viewport should contain:

- compact header;
- H1;
- one instruction;
- complete primary controls/visualization;
- primary result/status.

Do not require scrolling between input and result.

The result should appear in the same tool region whenever possible.

## Primary action rule

A tool should have at most one visually dominant action at a time.

Examples:

```text
Start test
Measure DPI
Connect / press any controller button
```

If no explicit action is necessary, start automatically after the required device/input is available.

Secondary actions such as Reset or Details must not compete visually with the main action.

## Progressive disclosure

Primary surface:

- only information needed to perform the task;
- key result;
- immediate feedback.

Below the fold or optional disclosure:

- raw values;
- technical details;
- methodology;
- long limitations;
- secondary metrics.

## User promise

Never imply more precision than the browser can provide.

Use:

```text
Observed
Estimated
Browser-reported
Measured in this browser session
```

Avoid:

```text
Exact hardware polling rate
Exact monitor Hz
Exact physical latency
Guaranteed hardware DPI
```

## Product principles

1. Tool first
2. One obvious job per page
3. One-screen main interaction
4. Minimal controls
5. Functional beauty: visuals must represent the measurement or help perform the task
6. Immediate feedback
7. Result near the action
8. No login
9. No install
10. No upload of raw test data
11. Honest limitations
12. No fake diagnostics
13. No decorative complexity
14. No dashboard-like metric overload
15. Mobile-safe layout
16. Related tools only after the primary task

## MVP success criteria

- user can identify the primary action within a few seconds;
- core interaction fits in one desktop viewport;
- input and primary result do not require scrolling between them;
- each tool has one clear job;
- no page requires login;
- no backend is required;
- unsupported states are explained directly;
- primary result is understandable without reading technical documentation;
- technical details do not dominate the primary tool;
- static page content remains crawlable.

## Non-goals

Not MVP:

- native apps
- hardware drivers
- firmware updates
- accounts
- cloud history
- leaderboards
- global benchmark databases
- WebHID deep access
- exact end-to-end latency testing
- AI diagnosis
- advanced analytics dashboards
- user-configurable expert modes
