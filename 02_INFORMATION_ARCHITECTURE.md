# Information Architecture

## Top-level structure

```text
/
├── gamepad-tester
├── controller-stick-drift-test
├── controller-deadzone-test
├── mouse-dpi-test
├── fps-test
├── refresh-rate-test
├── keyboard-tester
├── about
└── privacy
```

## Homepage role

The homepage is a utility directory, not a long marketing landing page.

Recommended structure:

```text
Header

H1: Hardware Tests in Your Browser
Short value proposition

Controller
- Gamepad Tester
- Stick Drift Test
- Deadzone Test

Mouse
- Mouse DPI Test

Display
- FPS Test
- Refresh Rate Test

Keyboard
- Keyboard Tester

Short privacy/trust section
Short explanation of browser-based testing
Footer
```

## Category relationships

### Controller

```text
Gamepad Tester
├── Stick Drift Test
└── Deadzone Test
```

The Gamepad Tester is the broad entry point.

Stick Drift and Deadzone are separate pages because they solve distinct jobs, not because they are synonyms.

### Display

```text
FPS Test
└── Refresh Rate Test
```

The two pages may share measurement infrastructure but must present different user jobs.

- FPS Test: browser/rendering frame cadence
- Refresh Rate Test: estimate display refresh frequency from stable frame timing

### Keyboard

`Keyboard Tester` is the MVP entry point.

Rollover/Ghosting can later become separate pages if search and product evidence justify them.

## Internal linking rules

Each tool page should link to 2–4 genuinely related tools.

Examples:

```text
Gamepad Tester
→ Stick Drift Test
→ Deadzone Test

FPS Test
→ Refresh Rate Test
→ Dead Pixel Test (after launch)

Keyboard Tester
→ Keyboard Rollover Test (after launch)
```

Do not create a site-wide block containing every tool on every page.

## URL rules

- lowercase
- hyphen-separated
- no dates
- no locale prefix for initial English version
- no query-string-dependent canonical content
- canonical URL points to the clean route

## Duplicate-intent rule

Do not create:

```text
/gamepad-tester
/controller-tester
/gamepad-test-online
```

as three pages if SERP overlap shows one intent.

One canonical page should naturally mention the valid synonyms in text.

## Future category expansion

Potential future categories:

```text
Audio
Camera / Microphone
File / Metadata
Network
```

Do not introduce them into the navigation until at least one real tool exists.


## Release-aware navigation

The structure above describes full v1.

Before a tool is live:

- do not link to a placeholder route;
- do not show `Coming soon` cards merely to make the homepage look larger;
- homepage/category lists contain only working indexable tools.

Every tool page must work as a standalone search landing page. It must not rely on homepage onboarding or a previous tool visit.
