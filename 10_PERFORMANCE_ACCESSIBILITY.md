# Performance and Accessibility

## Performance targets

Aim for excellent Core Web Vitals, but prioritize actual user-perceived responsiveness.

Suggested budgets:

```text
initial JS per tool page: as small as practical
no large UI framework solely for one tool
no autoplay media
no unnecessary third-party scripts
```

## Static-first

The H1 and intro must exist in static HTML. Any below-the-fold how-to, limitations, FAQ, or related-tool content that the page includes must also be static HTML; those sections are not mandatory on every page.

Interactive code should load and initialize only for the relevant tool page.

## Lazy loading

Lazy-load only genuinely heavy below-the-fold media if any exists.

The approved primary diagnostic visualizations are part of the tool and must not be deferred behind scroll-triggered loading.

Do not lazy-load the actual primary tool if it delays interaction unnecessarily.

## Fonts

Prefer system fonts or one carefully chosen web font.

Do not load large font families.

## Images

Prefer SVG for UI diagrams.

Avoid large decorative hero images.

## Accessibility

Target WCAG 2.2 AA where practical.

Required:

- visible focus states
- sufficient contrast
- semantic headings
- labels for controls
- no color-only status
- interactive targets large enough
- reduced-motion respect where animation is nonessential

## Animation

Real-time hardware visualization is functional animation and is allowed.

Decorative motion should be minimal.

For users preferring reduced motion:

- keep diagnostic state readable;
- avoid unnecessary transitions;
- do not disable functional live values.

## Graph accessibility

When a graph shows diagnostic information, provide a textual/numeric equivalent.

Example:

```text
Average frame time: 6.94 ms
Estimated refresh rate: 144 Hz
```

The graph must not be the only way to obtain the result.
