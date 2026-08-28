# Hardware Tests

A static Astro site with 18 lightweight browser-based hardware diagnostics.

The product is designed as a low-maintenance, search-landed utility asset: one focused diagnostic per route, no account or install, raw hardware/input data kept local, and no backend/database runtime.

## Current status

The full 18-tool catalog is implemented and code-side audited.

```text
Controller
├── /gamepad-tester
├── /controller-stick-drift-test
└── /controller-deadzone-test

Mouse
├── /mouse-tester
├── /mouse-button-test
├── /mouse-scroll-test
├── /double-click-test
├── /mouse-polling-rate-test
└── /mouse-dpi-test

Keyboard
├── /keyboard-tester
├── /keyboard-rollover-test
└── /keyboard-ghosting-test

Display
├── /fps-test
├── /refresh-rate-test
├── /frame-skipping-test
├── /dead-pixel-test
└── /backlight-bleed-test

Touch
└── /touch-screen-test
```

Supporting public routes:

```text
/
/about
/privacy
```

A post-expansion independent repository audit has also reconciled the current source-of-truth documents, homepage information architecture, selected mobile result/density issues, stale user-facing MVP wording, and remaining focused-Mouse source readability. A later visual-system refresh established the current authored identity across the homepage, shared shell, and all five hardware families.

### Code-complete is not release-ready

Public deployment is intentionally deferred until a real production domain is purchased and the required real-device/browser/camera checks are performed.

Current placeholder configuration:

```text
origin = https://hardware-testing.invalid
indexingEnabled = false
```

Do not invent a temporary production origin or enable indexing before the real domain is known.

## Source of truth

Coding agents start with `AGENTS.md`.

Decision ownership:

```text
19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md
  durable product strategy, current scope, expansion rule, release/deployment boundary

18_DECISIONS_AND_BOUNDARIES.md
  global + original full-v1 exact algorithms, lifecycle, browser behavior, technical boundaries

20_POST_V1_HARDWARE_EXPANSION_SPEC.md
  exact behavior, algorithms, UX, and route-specific QA for implemented Expansion 1 routes

13_AGENT_RULES.md
  mandatory engineering/review rules

16_UX_ACCEPTANCE.md
  interaction and viewport acceptance

17_FUNCTIONAL_VISUAL_SYSTEM.md
  durable visual-system rules

14_DEFINITION_OF_DONE.md
  code-complete and release-ready gates
```

`00_README.md` is the document map/handoff. `11_IMPLEMENTATION_PLAN.md` preserves the completed E1.0 → E1.7 development history plus the current maintenance workflow.

The old Expansion 1 sequence is historical context, not an instruction to keep inventing E1 stages. There is no approved E1.8.

## Development

Requirements:

```text
Node.js 24
pnpm 11
```

Install and run:

```bash
pnpm install
pnpm dev
```

Quality checks:

```bash
pnpm build
pnpm typecheck
pnpm test
```

The repository Quality workflow runs the same build/typecheck/test gate on pull requests and `main`.

## Architecture

Browser capability acquisition is intentionally thin and explicit:

```text
GamepadService       controller acquisition
FrameSampler         requestAnimationFrame timing + visibility lifecycle
KeyboardInputService keyboard acquisition
MouseMovementService Mouse DPI / Pointer Lock movement capture
MouseInputService    ordinary mouse input + explicit polling acquisition
TouchInputService    finger-touch Pointer Event acquisition
```

The shared Fullscreen utility is progressive enhancement, not a hardware acquisition service.

Dependency direction:

```text
page
 ↓
tool controller / UI binder
 ├── browser capability service
 ├── pure measurement/state helpers
 └── prepared render data → renderer
```

Pure helpers/renderers do not own native browser acquisition. Tool controllers own interpretation and presentation state.

Production UI intentionally does not use React, Vue, Svelte, Tailwind, a UI/chart library, global state library, backend, database, auth, paid runtime APIs, AI, or WebHID.

## Product / measurement principles

### Browser observation is not hardware certification

Every route describes only what it can actually establish.

Examples:

- Gamepad Tester does not guess physical controls for non-standard mappings.
- Stick Drift reports observed center offset without a good/bad verdict.
- Controller Deadzone exposes the documented heuristic starting value rather than a universal correct setting.
- Mouse DPI is always an estimate based on browser movement plus user-provided physical travel distance.
- Mouse Polling reports browser-observed pointer sample rate, not guaranteed USB/device polling rate.
- Keyboard Rollover is browser-observed simultaneous input, not NKRO certification.
- Keyboard Ghosting compares guided expected combinations with browser-observed input; reserved shortcuts may not reach the page.
- Touch coverage uses only actually observed in-surface touch samples and never manufactures coverage through interpolation/clamping.
- FPS and Refresh Rate use browser-visible rAF timing, not another application's FPS or EDID.
- Dead Pixel and Backlight Bleed are visual-inspection tools, not automatic display diagnosis.
- Frame Skipping uses browser timing only to gate/run a sequential camera pattern; physical evidence comes from an external camera photo.

Use `18_DECISIONS_AND_BOUNDARIES.md` and `20_POST_V1_HARDWARE_EXPANSION_SPEC.md` for exact formulas/state machines. Do not duplicate or improvise them here.

## UX / visual direction

The visual system is **instrument minimalism + authored identity**:

```text
light instrument chassis
+ dark diagnostic surfaces only where they have functional meaning
+ five restrained hardware-family channel colors
+ domain-specific browser/input geometry
+ strong measurement typography
+ state/signal-driven motion only
```

Controller, Mouse, Keyboard, Display, and Touch each have a stable muted channel color. Channel color is a family/signal cue, not a replacement for semantic success/warning/error states and not permission to turn the product into a rainbow UI.

Desktop-relevant primary tools target a compact `1366×768` first-screen experience. Touch follows its route-specific mobile/tablet acceptance rules.

The homepage groups the 18 tools by device cluster rather than presenting one undifferentiated feed. The shared shell stays light and neutral; dark surfaces are reserved for meaningful diagnostic/display contexts.

Decorative gradient washes, fake instrument readouts, glass, neon, generic AI/SaaS chrome, and dashboard-card clutter are out. A CSS `linear-gradient()` is still acceptable when it is merely the lightweight implementation primitive for a functional technical grid/reference ruling.

`17_FUNCTIONAL_VISUAL_SYSTEM.md` owns the exact visual grammar.

## Privacy

Raw controller, keyboard, mouse, touch, pointer, and frame-timing streams are not uploaded or stored by the site.

If coarse product analytics are enabled later, they must not contain raw hardware/input streams or raw device identifiers.

## Before public deployment

Follow `12_LAUNCH_PLAN.md`.

At minimum:

- purchase/configure the real production domain;
- complete the route-specific real-device/browser/camera checks for every released tool;
- verify HTTPS, canonical URLs, robots, and sitemap against the real origin;
- enable indexing only with the real origin;
- deploy;
- connect Google Search Console and submit the generated sitemap;
- run final production smoke.

Headless/mock input is useful for state, layout, and automated correctness. It must never be described as real hardware validation.

## Future scope

The current catalog is not a prompt to keep adding tools.

New scope requires at least one strong reason under `19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md`:

```text
validated independent demand/opportunity
Search Console evidence
material value to a successful existing cluster
```

Technical ease alone is not enough.
