# UX / UI Specification

## UX is the primary product requirement

The site succeeds when a visitor lands, immediately understands what to do, performs the test, and understands the result.

Do not use complexity to make the site feel more “professional”.

Professional here means:

```text
clear
compact
consistent
responsive
polished
trustworthy
```

not feature-rich.

## First-screen acceptance target

At `1366 × 768` desktop, for desktop-relevant tools:

- compact header is visible;
- H1 is visible;
- instruction is visible;
- entire main interaction is visible;
- primary result/status area is visible;
- user does not need to scroll to finish the primary task.

At `1440 × 900`, the same should feel comfortable rather than cramped.

Below-the-fold explanatory content may scroll normally.

Touch Screen Test is explicitly mobile/tablet oriented in Expansion 1. Its active surface follows the route-specific mobile-first acceptance rules in `20_POST_V1_HARDWARE_EXPANSION_SPEC.md`; do not shrink the diagnostic area merely to satisfy a desktop-shaped one-screen rule.

## Page density

Use vertical space carefully.

Avoid:

- tall hero sections;
- large empty gaps;
- oversized headings;
- large marketing banners;
- separate cards for every small metric.

Recommended:

```text
header: compact
H1: clear but not huge
intro: 1 sentence
tool: dominant element
result: inside the same tool region
```

## One-job rule

Each page solves one job.

Do not add neighboring tests into the same primary tool just to make the page feel richer.

Use related-tool links below the result instead.

## One-primary-action rule

At any point, there should normally be only one dominant action.

Examples:

```text
Start test
Measure DPI
Reset
```

When interaction is passive/live, there may be no CTA:

```text
Press any key
Move the controller sticks
Move, click, or scroll inside the test surface
```

## Progressive disclosure

Main tool:

- instruction;
- required inputs;
- primary visualization;
- key status/result.

Optional or below fold:

- raw values;
- methodology;
- technical device details;
- secondary statistics;
- long caveats.

A `Details` disclosure is allowed only when there is genuinely useful secondary information.

Do not add Details just because data exists.

## Result placement

Result must appear where the user is already looking.

Avoid:

```text
user interacts at top
→ result appears 500px below
→ user must hunt for it
```

Prefer:

```text
same card
same visual focus
stable layout
```

Reserve result space where useful to prevent layout shift.

For long/mobile-first active surfaces, status/metrics may remain adjacent/sticky/predictably placed according to the route design; do not sacrifice usable touch area simply to eliminate all vertical movement.

## Visual direction

Use a clean measurement-instrument aesthetic: mostly monochrome, crisp geometry, strong measurement numerals, and one restrained live signal accent.

Avoid:

- gradient SaaS;
- glassmorphism;
- dark hacker/gaming styling by default;
- neon;
- giant rounded cards;
- heavy shadows;
- decorative 3D hardware;
- dashboard chrome.

Recommended:

- neutral background;
- one restrained accent color;
- subtle borders;
- modest radius;
- system font or lightweight single font family;
- clear typography hierarchy.

## Global shell

Desktop max width:

```text
1100–1200px
```

Reading content:

```text
680–800px
```

## Header

Keep very small:

```text
Brand       Tools       About
```

No mega-menu in current scope.

## Tool card

One main card/surface per page.

It should visually contain the whole job.

Requirements:

- subtle border;
- modest radius;
- enough padding;
- no nested-card maze;
- no heavy shadow;
- predictable placement across related tool pages.

## Instructions

Instructions should be short and actionable.

Good:

```text
Connect your controller and press any button.
Release both sticks and keep them untouched.
Move your mouse exactly 10 cm.
Press any key to test it.
Touch and drag across the whole test area.
```

Bad:

```text
Follow the steps below to begin the comprehensive diagnostic process.
```

If instructions require more than 2–3 short lines, reconsider the interaction. Camera-assisted Frame Skipping may use a compact numbered instruction block because its physical procedure genuinely requires multiple steps; keep those steps inside the primary tool and concise.

## State model

Internally, tools may have detailed states.

The visible UX should usually collapse them into a small set:

```text
waiting / ready
measuring / active
result
unsupported / error / interrupted
```

Do not create a visible stepper or wizard unless technically unavoidable.

## Gamepad visualization

Use a generic compact SVG controller.

Primary purpose:

- show pressed buttons;
- show stick positions.

Do not recreate console branding exactly.

## Functional visualization

The interface should be visually richer than a generic form utility when the measurement itself benefits from visualization.

Prefer one meaningful live visualization over multiple cards, metrics, tables, or decorative elements.

Approved examples include:

- controller SVG with live button/stick states;
- short stick-position trail;
- deadzone ring around stick center;
- mouse relative-movement guide;
- generic mouse button/wheel/movement feedback;
- touch coverage/live-contact surface;
- short FPS time trace;
- quiet refresh-rate cadence trace;
- frame-skipping camera pattern;
- fullscreen solid-color / black inspection stage;
- visual keyboard with active keys.

These visuals are part of the tool, not decoration.

Do not add a visualization if it does not help perform the test or interpret the result.

Do not use a generic chart library.

## Mobile

Mobile must be tidy. Some tools remain desktop-oriented, while Touch Screen Test is intentionally mobile/tablet-oriented.

Mobile requirements:

- no page-level overflow;
- readable controls;
- clear unsupported/impractical states;
- no broken visualization;
- primary actions remain obvious;
- diagnostic surfaces remain large enough for the physical task.

Do not distort desktop UX to make every hardware test equally meaningful on mobile, and do not distort a mobile-first Touch diagnostic merely to imitate desktop proportions.

## Trust

Compact trust message may appear inside the tool footer or immediately below the primary tool:

```text
Runs locally in your browser. Raw test data is not uploaded.
```

It must not become a separate above-the-fold marketing section.

Only if implementation truly satisfies it.

## Related tools and retention

Do not interrupt the primary task with cross-promotion.

After the user sees a result/status, show a small related-tools block.

Only link implemented routes.

The goal is useful continuation, not artificial pageview inflation.

## UX anti-patterns

Do not add:

- onboarding modal;
- cookie-like product tutorial;
- multi-step wizard for a one-step test;
- tabbed dashboards;
- collapsible sections inside the main interaction unless needed;
- multiple equal-weight CTAs;
- live technical logs;
- verbose empty states;
- autoplay decorative effects.

## Copy tone

Utility copy should be concise and literal.

Avoid marketing language.

The page should feel like a tool someone bookmarked, not a campaign landing page.

## Responsive acceptance boundaries

The strict one-screen requirement applies to `1366×768` and larger **desktop-relevant** tool pages.

At `1024×768`:

- no horizontal overflow;
- primary task remains fully usable;
- vertical scrolling is acceptable if needed.

At mobile widths around `390px`:

- one-screen completion is not required;
- the tool must remain understandable and usable where the browser/device capability makes sense;
- Touch Screen Test must prioritize usable finger interaction area and route-specific real-device acceptance from `20`.

## Human visual checkpoint

The completed Gamepad Tester established the base visual system for full v1.

Expansion 1 reuses that system. E1.1 Mouse Tester is a human visual checkpoint before its mouse pattern is propagated to the focused E1.2 routes; later device-specific routes still receive their own visual review.

## Search-landing independence

Assume most users may enter directly on a tool URL from search.

Do not require:

- prior homepage context;
- onboarding completed elsewhere;
- category selection before using a tool.

The page must explain its job and next action on its own.
