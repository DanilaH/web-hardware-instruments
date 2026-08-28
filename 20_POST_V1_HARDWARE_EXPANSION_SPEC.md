# Hardware Tests — Post-v1 Hardware Expansion 1 Product & Technical Specification

**Status:** approved for implementation after E1.0.1 review corrections  
**Date:** 2026-08-28  
**Repository:** `DanilaH/web-hardware-instruments`  
**Scope:** Expansion 1 additions only. Existing full-v1 tools remain stable and are not redesigned.

---

# 0. Purpose

Expansion 1 started as a deferred list of plausible hardware utilities. The expansion catalog below is approved for implementation based on completed search/SERP research and cluster-fit review.

This document is the implementation contract for that approved catalog, not the research report itself. Do not invent or duplicate keyword-volume, traffic, or competitor-authority figures here. If future scope changes are proposed, validate them through the project's expansion rule before changing this contract.

The goal is not to inflate the catalog. The goal is to add search-landed browser diagnostics that:

1. solve one clear user job;
2. have evidence of demand and accessible competition;
3. run locally in the browser;
4. preserve measurement honesty;
5. stay static and low-maintenance;
6. reuse the current visual system and browser-service architecture;
7. do not regress or redesign the completed full-v1 tools.

Existing source-of-truth rules remain binding:

- Astro static output;
- strict TypeScript;
- plain CSS;
- browser-native APIs;
- SVG / Canvas / DOM;
- no React/Vue/Svelte/Tailwind/UI library/chart library/global state;
- no backend/database/auth;
- raw input remains local;
- one real job per search landing;
- tool first, explanatory SEO content below;
- one dominant action where an action is needed;
- honest result labels: observed / estimated / visual inspection / heuristic;
- primary desktop interaction should fit at `1366×768` when that device class is appropriate.

Expansion 1 is additive. Do not refactor full v1 merely to make new code aesthetically uniform.

The catalog is approved, but implementation remains sequential. A route is not production-ready merely because it appears here; each route passes its own implementation, review, visual, and quality gates.

## E1.0.1 review corrections

Independent review after E1.0 found several ambiguities that could create false measurement semantics. This revision makes the following rules exact:

- one polling measurement session uses one timestamp source; fallback restarts the session instead of mixing streams;
- Touch coverage may consume real coalesced Pointer Event samples, but never synthetic interpolation;
- touch samples outside the active surface do not get clamped into edge coverage cells;
- confirmation is offered for any uncovered cell, without an invented `meaningful area` threshold;
- first-pass and confirmation-pass coverage are stored separately;
- hands-off Touch observation is cancelled on blur/hidden visibility;
- Frame Skipping freezes its timing reference for a READY capture epoch and discards that epoch when readiness is lost.

These corrections do not change the approved route catalog.

---

# 1. Final Expansion 1 scope

## 1.1 Mouse

New routes:

```text
/mouse-tester
/mouse-button-test
/mouse-scroll-test
/double-click-test
/mouse-polling-rate-test
```

Existing:

```text
/mouse-dpi-test
```

stays intact except for related-tool links.

Product model:

```text
Mouse
├── Mouse Tester            broad basic input check
├── Mouse Button Test       focused button registration
├── Mouse Scroll Test       wheel direction / reverse events
├── Double Click Test       unintended rapid repeated presses
├── Mouse Polling Rate Test browser-observed pointer sample rate
└── Mouse DPI Test          existing estimated DPI
```

Do not add CPS, reaction time, click-speed leaderboards, cursor games, or mouse latency claims to Expansion 1.

## 1.2 Touch

New route:

```text
/touch-screen-test
```

One substantial touchscreen diagnostic contains:

- live touch detection;
- multi-touch observation;
- screen-coverage mapping;
- suspicious untouched-area confirmation;
- separate hands-off unexpected-touch check.

Do not create thin synonym routes in Expansion 1:

```text
/touchscreen-tester
/multi-touch-test
/ghost-touch-test
/touch-dead-zone-test
```

Search Console may justify splitting later if real query evidence appears.

## 1.3 Keyboard

New routes:

```text
/keyboard-rollover-test
/keyboard-ghosting-test
```

Existing `/keyboard-tester` remains the simple “does the browser receive this key?” job. Do not turn Keyboard Tester into a tabbed diagnostic suite.

## 1.4 Display

New routes:

```text
/dead-pixel-test
/backlight-bleed-test
/frame-skipping-test
```

Existing `/fps-test` and `/refresh-rate-test` remain stable except for related links.

---

# 2. Explicitly out of Expansion 1

Do not add:

```text
Tone Generator
Speaker Test
Headphone Test
Microphone Test
other Audio tools
CPS / click-speed game
reaction-time test
mouse hardware latency
keyboard hardware latency
touch latency score
touch pressure score
pixel fixer / flashing repair mode
OLED burn-in scoring
monitor calibration suite
UFO clone / motion blur suite
persistent history
CSV/JSON export
accounts
shareable result URLs
hardware database
automatic warranty verdicts
AI explanations
WebHID
```

Audio remains a separate expansion direction and is outside this approved batch.

CPS is a separate gaming/skill utility opportunity.

---

# 3. Product lessons from competitor research

The approved scope is based on completed search/SERP research plus competitor review. This specification records implementation takeaways, not SEO metrics.

## Mouse

Broad mouse-tester intent naturally expects buttons + wheel + movement in one surface. Focused polling and accidental-repeat jobs remain separate routes. Do not copy competitor dashboards, CPS, drag counters, exports, or latency-style hardware claims.

Polling-rate tools demonstrate a useful pattern: short sample, coalesced pointer events where available, and a clear caveat that browser/OS event delivery may differ from configured device polling.

Double-click/chatter tools demonstrate a useful pattern: same-button inter-press intervals and suspicious very-short repeats. Do not turn this into an engineering dashboard or warranty verdict.

## Touchscreen

Useful patterns:

- broad touch tester;
- grid coverage;
- edges/corners;
- multi-touch;
- separate hands-off unexpected-touch check;
- explicit browser-only limitation;
- confirmation pass instead of instantly calling untouched areas dead.

Avoid pressure/latency scores and diagnostic-tab dashboards.

## Keyboard

A free-form browser test knows which key events arrived. It does not know all physical keys the user intended to hold if some events never arrived.

Therefore:

- Rollover = observation only: `Maximum detected together`;
- Ghosting = guided expected-combination test, where the software knows the intended set because it instructed the user what to hold.

## Dead pixel / backlight

Dead-pixel intent needs only solid colors + fullscreen + visual inspection. Backlight-bleed intent needs a pure black screen, dark-room instruction, and careful distinction between LCD backlight bleed, viewing-angle glow, and OLED behavior.

No automatic diagnosis is required or honest.

## Frame skipping

Camera evidence defines this job. Browser timing can run the pattern and report readiness; it cannot prove physical monitor frame skipping by itself. Screenshots are not valid evidence.

---

# 4. Architecture changes

Existing full-v1 capability services remain stable:

```text
GamepadService
FrameSampler
KeyboardInputService
MouseMovementService
```

The full-v1 rule that these were the four approved MVP acquisition boundaries remains historically correct. Expansion 1 explicitly approves two additional acquisition boundaries for genuinely new input jobs; do not rename or generalize the existing four merely to make the architecture look uniform.

`MouseMovementService` stays specialized for Mouse DPI and Pointer Lock capture.

Add only:

```text
MouseInputService
TouchInputService
Fullscreen helper
```

Suggested files:

```text
src/browser/mouse-input-service.ts
src/browser/touch-input-service.ts
src/browser/fullscreen.ts
```

`Fullscreen` is a helper, not another hardware acquisition service.

Dependency direction remains:

```text
page
 ↓
tool controller / UI binder
 ├── browser capability service
 ├── pure helpers
 └── prepared view data → renderer
```

Pure helpers and renderers must not import browser acquisition services.

Do not rename/generalize existing services for architectural neatness.

---

# 5. MouseInputService

## 5.1 Responsibility

Own normal browser mouse acquisition for Expansion 1:

```text
button down/up
wheel
normal pointer movement
high-frequency polling samples when explicitly requested
blur / visibility clear signals
```

When Pointer Events are used for mouse tools, ignore events whose `pointerType` is present and is not `"mouse"`. Touch or pen input on a hybrid device must not be presented as mouse input.

Tool controllers own held-button sets, counters, recent-direction state, and other presentation/interpretation state. On blur or hidden visibility, the service emits a clear/reset signal and the controller clears held presentation state.

It must not own:

```text
UI
SEO copy
double-click interpretation
polling-rate calculation
counters
held presentation state
visual rendering
analytics
```

## 5.2 Profiles

```ts
type MouseInputProfile = 'basic' | 'polling';
```

`basic`:

- pointer/mouse down/up;
- wheel;
- ordinary movement.

`polling` additionally enables high-frequency pointer acquisition.

Do not attach raw/high-frequency listeners on ordinary mouse pages.

## 5.3 Button semantics

Browser semantic button codes:

```text
0 primary
1 auxiliary / middle
2 secondary
3 back
4 forward
```

Visible labels:

```text
Primary
Middle
Secondary
Back
Forward
```

Do not promise that Primary is physically left-most; users/OS software can remap roles.

## 5.4 Default browser actions

Only inside a dedicated test surface:

- prevent context menu for secondary-button testing;
- prevent applicable auxiliary/side-button navigation where browser behavior allows;
- prevent page scroll inside the wheel test area.

Never disable those behaviors globally.

## 5.5 Polling acquisition source and timestamp extraction

Polling source precedence:

```text
1. pointerrawupdate when supported and successfully registered
2. pointermove + getCoalescedEvents() when available
3. ordinary pointermove fallback
```

**One measurement attempt uses exactly one timestamp source.** Do not append timestamps from concurrent raw, coalesced, and ordinary streams into one result.

Source selection/fallback rules:

1. choose the highest supported source before the 2-second measurement clock begins;
2. if feature detection or listener registration for that source fails, fall back to the next source before collecting measurement timestamps;
3. if a selected source produces no usable timestamp samples while ordinary pointer movement is observed during an initial liveness check, cancel that collection, clear all collected timestamps, select the next source, and restart the full 2-second measurement clock;
4. a liveness listener may detect that movement exists, but its timestamps must never be mixed into the measured source;
5. once usable measurement samples are accepted from a source, keep that source for the attempt; insufficient data then returns `Not enough movement — try again.` rather than silently mixing a fallback stream.

Timestamp extraction for the selected source is deterministic:

- for `pointerrawupdate`, if `getCoalescedEvents()` exists and returns a non-empty batch, use finite timestamps from that batch; otherwise use the event timestamp;
- for `pointermove` in coalesced mode, if `getCoalescedEvents()` returns a non-empty batch, use finite timestamps from that batch; otherwise use the parent event timestamp;
- for ordinary `pointermove`, use the finite parent event timestamp;
- do not append a parent-event timestamp in addition to a non-empty coalesced batch unless it is a distinct finite timestamp;
- preserve chronological order;
- deduplicate identical timestamps;
- do not synthesize missing hardware samples.

`pointerrawupdate` is a higher-frequency browser pointer-event path. Never describe it as USB reports, direct device packets, or guaranteed hardware polling samples.

## 5.6 Lifecycle

```text
create
subscribe
start
...
stop
destroy
```

- `subscribe()` does not start acquisition;
- `stop()` is reusable;
- `destroy()` is idempotent/permanent;
- one listener set per service/profile;
- blur/hidden page emits a clear/reset signal;
- any active explicit polling measurement is cancelled on blur/hidden visibility;
- no input data leaves the page.

---

# 6. TouchInputService

Use Pointer Events as the primary model and consume only:

```text
pointerType === "touch"
```

Mouse must not paint the touchscreen grid. Pen/stylus is not counted as finger touch in Expansion 1. `navigator.maxTouchPoints` is a capability hint only.

Suggested normalized event contract:

```ts
type TouchInputEvent =
  | {
      type: 'start' | 'move' | 'end' | 'cancel';
      pointerId: number;
      x: number; // normalized relative to active surface; may be outside 0..1 under pointer capture
      y: number;
      insideSurface: boolean;
      timestamp: number;
    }
  | {
      type: 'clear';
      reason: 'blur' | 'visibility-hidden';
    };
```

`pointerId` is only an active-contact key. Never persist or present it as device identity.

### Coalesced observed touch samples

For `pointermove`, when `getCoalescedEvents()` exists and returns a non-empty batch, normalize each finite `pointerType === "touch"` sample from that batch as an actually observed browser sample. Otherwise normalize the parent move event.

These coalesced samples are not interpolation: they are browser-observed pointer changes delivered together. They may contribute to Touch coverage if their coordinates are actually inside the active surface.

Do not synthesize samples between observed events.

### Surface coordinates

Derive normalized coordinates from the active surface bounding rect.

Do **not** clamp out-of-surface samples into `0..1` for measurement. Under pointer capture a finger may continue generating events after leaving the surface; clamping those events into an edge cell would manufacture edge coverage.

Rules:

- `insideSurface === true` only when the finite client coordinate is actually within the current active surface bounds;
- only inside-surface samples may mark Touch coverage cells;
- renderer code may clamp a visual marker to the surface edge if useful, but that visual clamp must not alter measurement state;
- active-contact lifecycle still follows the pointer ID even while a captured pointer is temporarily outside the surface.

Apply `touch-action: none` only to the active diagnostic surface. Do not apply it globally because browser zoom/accessibility/scrolling outside the surface must remain available.

Handle:

```text
pointerdown
pointermove
pointerup
pointercancel
blur
visibilitychange
```

Clear active contacts on blur/hidden visibility. Tool controllers must treat a clear signal as invalidating any observation interval that requires continuous visibility/focus.

---

# 7. Fullscreen helper

A small shared helper is approved because Touch, Dead Pixel, and Backlight Bleed need fullscreen or large-stage behavior.

Responsibilities:

```text
feature detection
request fullscreen on supplied element
exit fullscreen
observe fullscreen state
handle rejected request cleanly
cleanup
```

A fullscreen request must come from an eligible user activation. Resolve success from the actual fullscreen state (`document.fullscreenElement` / fullscreen state notification), not merely from absence of a synchronous error.

Fullscreen is always progressive enhancement. Every tool must have a usable in-page fallback.

---

# 8. `/mouse-tester`

## Job

```text
Does this browser receive my mouse movement, main buttons, side buttons and wheel input?
```

No Start button.

Instruction:

```text
Move, click, and scroll inside the test area.
```

Primary surface:

```text
generic functional SVG mouse
Primary / Middle / Secondary
Back / Forward
wheel direction
movement detected
```

Button zones highlight while held and retain a small press count. Wheel reacts to up/down. Movement proves pointer motion reaches the page.

Primary wording:

```text
Browser-detected mouse input
```

Never claim `Mouse hardware is healthy` or `All buttons work`.

No CPS, polling Hz, double-click metrics, latency, DPI, raw event log, or movement-statistics dashboard.

One quiet `Reset` clears visible counters/state only.

Acceptance:

- buttons 0–4 map correctly;
- held state clears on release and clear/reset signals;
- secondary click does not open context menu inside the surface;
- side buttons do not accidentally navigate away where preventable;
- wheel reacts without scrolling the page inside the surface;
- normal page behavior remains normal outside;
- no Pointer Lock;
- fits `1366×768`.

---

# 9. `/mouse-button-test`

Job:

```text
Which mouse button inputs does this browser receive?
```

Large generic mouse visual plus five semantic states:

```text
Primary
Middle
Secondary
Back
Forward
```

For each:

```text
held/not held
press count
detected/not yet detected
```

Count on button-down, not `click`. Unsupported/unpressed side buttons are not failures. Held highlight is enough to expose an unexpected release; no separate hold benchmark.

Primary label:

```text
Detected button input
```

No pass/fail.

---

# 10. `/mouse-scroll-test`

Job:

```text
Does my wheel/scroll input register in the expected direction without obvious reverse events?
```

Instruction:

```text
Scroll steadily in one direction inside the test area, then repeat in the other direction.
```

Show:

```text
Up events
Down events
Horizontal events
Recent direction strip
```

Example:

```text
↑ ↑ ↑ ↑ ↑ ↓ ↑ ↑
```

Keep only the latest ~24 events.

Do not label browser wheel events as physical notches. `deltaX` / `deltaY` units depend on `deltaMode`; primary UI therefore uses sign/direction and event count.

`wheel` events may be produced by a physical wheel, trackpad, or another scrolling device. SEO/job language may remain `Mouse Scroll Test`, but measured wording stays `Browser-detected wheel events`.

Do not automatically output `Encoder bad`, `Wheel failed`, or count reversals as a hardware verdict because the page cannot know exactly when the user intentionally changed direction.

---

# 11. `/double-click-test`

Job:

```text
Is one deliberate mouse press producing an unusually fast repeated browser press?
```

This diagnoses suspicious rapid repeats, not click speed.

Instruction:

```text
Click slowly, once at a time. Do not intentionally double-click.
```

Show only:

```text
Total presses
Rapid repeat events
Shortest same-button gap
Last same-button gap
```

Primary interpretation:

```text
No rapid repeat observed
```

or:

```text
Rapid repeat observed
```

Never `Mouse broken` / `Switch failed`.

Algorithm: track button-down timestamps per semantic button. For consecutive presses of the same button:

```text
gap = currentTimestamp - previousTimestamp
```

Ignore non-finite or non-positive gaps.

Approved initial conservative heuristic:

```text
rapidRepeatThresholdMs = 50
```

If `gap <= 50ms`, increment Rapid repeat events.

This is not a hardware standard and does not prove switch chatter. It surfaces unusually fast same-button repeats while the user is deliberately clicking slowly. Explain that limitation directly below the tool.

If real-device QA shows the threshold is materially misleading, change it only through a reviewed source-of-truth update plus regression tests. Do not silently tune it.

Do not use `dblclick` as the primary diagnostic signal.

Reset clears timestamps, counts, shortest/last gap, and rapid-repeat count.

Pure tests:

```text
same-button interval
different buttons isolated
exact 50ms boundary
51ms does not flag
non-positive ignored
non-finite ignored
reset
```

---

# 12. `/mouse-polling-rate-test`

Job:

```text
What pointer sample rate is this browser observing while I move my mouse?
```

SEO may use `Mouse Polling Rate Test`.

Primary label:

```text
Observed pointer sample rate
```

Flow:

```text
Move continuously inside the area.
[ Start 2-second test ]

Observed pointer sample rate
972 Hz

Source
Coalesced pointer samples
```

One Start action. The accepted measurement source receives a full `2 seconds` after source selection/fallback is complete.

Visible source note:

```text
High-frequency pointer updates
Coalesced pointer samples
Basic browser pointer events
```

Do not call any path USB raw reports.

Calculation: collect finite monotonically increasing timestamps from the single selected source, deduplicate equal timestamps, then:

```text
intervals = positive differences between consecutive timestamps
medianInterval = median(intervals)
observedRateHz = 1000 / medianInterval
```

Require at least `20` valid intervals, otherwise:

```text
Not enough movement — try again.
```

Display nearest whole Hz. Do not snap to common hardware rates. Do not claim manufacturer-equivalent certification.

Directly below result:

```text
Browsers and operating systems can merge, limit, or reschedule pointer events, so this may differ from the mouse's configured hardware polling rate.
```

Performance:

- no DOM write per sample;
- bounded 2-second data only;
- render at low cadence;
- detach high-frequency/liveness listeners immediately after completion/cancel;
- never combine sample sources to make a result look more complete.

A known 1000Hz mouse reading lower on a fallback source is not automatically a bug if the source/caveat is correct.

---

# 13. `/touch-screen-test`

## Job

```text
Where does this browser receive finger input, how many simultaneous touches does it see, and does unexpected touch input appear while hands-off?
```

This is one substantial touch tool and is genuinely mobile/tablet oriented. Real-device QA around `390×844` is a primary release gate.

## Coverage mode

Instruction:

```text
Touch and drag across the whole test area, including edges and corners.
```

Primary surface:

- subtle fixed grid;
- live touch markers;
- short touch trails;
- browser-observed cells become covered;
- current active touch count;
- maximum simultaneously detected count;
- coverage percentage.

Primary metrics:

```text
Active touches
Maximum detected together
Coverage
```

Coverage means coverage of the browser test area, not touchscreen health.

Use a normalized `16 × 10` grid.

### Coverage sample rule

Mark coverage only for finite, actually browser-observed finger-touch samples whose coordinates are actually inside the active surface.

Accepted measurement samples include:

- normal touch `pointerdown` / `pointermove` samples;
- finite touch samples returned by `getCoalescedEvents()` for a delivered `pointermove`.

Do not synthesize covered cells between samples. Do not clamp an out-of-surface captured pointer into an edge cell. Either behavior could hide a repeatable area where the browser did not actually report in-surface touch input.

A short visual trail may interpolate between observed samples or clamp a marker for rendering continuity only. Interpolated/clamped visual pixels must not affect coverage percentage, confirmation state, or any diagnostic label.

Store covered cells in bounded fixed-size bitsets/sets.

## First pass + confirmation pass

Maintain separate fixed-size coverage state:

```text
pass1Covered
pass2Covered
```

Pass 1: user sweeps the surface. Untouched cells are `Not covered yet`, never `Dead zones` or `Failed cells`.

The secondary action:

```text
Check missed areas
```

becomes available whenever `pass1Covered` contains fewer than all 160 cells. There is **no hidden `meaningful area` threshold**.

If pass 1 reaches all 160 cells, confirmation is not required and may remain unavailable.

When confirmation starts:

- preserve `pass1Covered`;
- clear/start an independent `pass2Covered` set;
- already-covered pass-1 cells become visually quiet;
- cells not covered in pass 1 remain neutrally emphasized;
- only samples actually observed during confirmation mark `pass2Covered`.

Overall displayed Coverage may use the union:

```text
union(pass1Covered, pass2Covered)
```

but repeatability semantics use the separate sets.

After confirmation, a cell may be labeled:

```text
Not detected in both passes
```

only if it exists in neither `pass1Covered` nor `pass2Covered`.

Copy:

```text
Repeatable missed areas may indicate a touch problem, but this browser test cannot identify the failed hardware component.
```

Never automatically output `dead zone confirmed`.

Reset clears both pass sets, active contacts, maximum count, trails, and confirmation state.

## Multi-touch

Maintain active touch-pointer set and show:

```text
Active touches: N
Maximum detected together: N
```

`navigator.maxTouchPoints` may appear in Details as `Device-reported maximum touch points`, not as the primary result.

## Input filtering

Only `pointerType === "touch"`. Mouse must not fill the grid. Stylus does not count as finger touch in Expansion 1.

## Fullscreen

In-page test works by default. `Full screen` is secondary progressive enhancement. Rejection/unsupported state continues in-page without an error wall.

## Hands-off unexpected-touch check

Secondary mode:

```text
Run hands-off check
```

Exact arming flow:

1. user presses Start;
2. wait until activation contact ended and active-touch set is empty;
3. begin a `500ms` quiet guard only while the set remains empty;
4. if any touch starts during the guard, restart the guard only after active contacts become empty again;
5. arm only after continuous `500ms` touch-free guard;
6. run a continuously observable `15 seconds`;
7. instruct: `Place the device down and do not touch the screen.`

While armed, count new touch-contact starts. Moves do not become extra unexpected contacts.

A contact beginning before arm must never be silently carried into the armed state. If active contacts exist, remain waiting until touch-free again.

### Visibility/focus invalidation

The 500ms guard and 15-second result are valid only while the page remains observable.

If the service emits `blur` or `visibility-hidden` during the quiet guard or armed 15-second observation:

- cancel the current hands-off run;
- clear its pending guard/timer and partial unexpected-contact count;
- do not produce a quiet/no-input result from the partial interval;
- show a concise state such as `Check interrupted — keep this page visible and start again.`;
- require a new explicit Start action before another run.

Normal page/tool teardown or pagehide likewise cancels an unfinished run.

Result after a complete uninterrupted 15 seconds:

```text
No unexpected touch input observed in 15 seconds
```

or:

```text
Unexpected touch input observed: 3 contacts
```

After completion, small markers may show observed start locations.

Never `Ghost touch confirmed`, `Digitizer failed`, or `Touchscreen healthy`. A quiet 15-second sample cannot rule out intermittent faults.

## Unsupported state

```text
No touchscreen capability is reported on this device. Open this page on the device you want to test.
```

Do not offer mouse simulation as equivalent.

`touch-action: none` applies only to active diagnostic surface. Normal page scrolling/zooming outside it remains available.

---

# 14. `/keyboard-rollover-test`

Job:

```text
How many simultaneous key inputs does this browser detect while I hold keys?
```

No Start button.

Instruction:

```text
Hold several keys at the same time and compare them with the highlighted keyboard.
```

Reuse existing `KeyboardInputService` and keyboard grid. No second keyboard acquisition implementation.

Primary result:

```text
Keys held now
Maximum detected together
Last detected key
```

Never automatically output `8KRO`, `NKRO confirmed`, `NKRO likely`, or `Full NKRO`.

Correct label:

```text
Maximum detected together
```

Below:

```text
This is the largest simultaneous key set the browser observed during this session, not a hardware certification.
```

Suggested helper combinations may include:

```text
W + A + S + D + Shift + Space
Q + W + E + A + S + D
```

Avoid reserved shortcuts. One `Reset maximum` action; current held state always remains live.

---

# 15. `/keyboard-ghosting-test`

Free-form highlighting cannot know the user physically intended to press a missing key, so this route uses guided expected combinations.

Job:

```text
When I intentionally hold this exact combination, which expected keys does the browser receive together?
```

Presets at minimum:

```text
W + A + S + D + ShiftLeft + Space
W + A + ShiftLeft + Space
W + D + ShiftLeft + Space
Q + W + E + A + S + D
```

Avoid OS/browser-reserved combinations.

Custom selection is optional polish; if implemented, `min 2`, `max 10` keys.

Flow:

```text
Choose combination
[ Start test ]

Get ready…
Hold every highlighted key.

Observe for 3 seconds.
```

One dominant Start action. A ~1s prep period is allowed before the 3s observation.

During observation:

- maintain detected held codes;
- compare each snapshot with expected codes;
- retain snapshot with greatest expected-key match count;
- record detected codes outside expected set.

If all expected keys were observed simultaneously:

```text
All 6 selected keys were detected together.
```

Otherwise:

```text
5 of 6 selected keys were detected together at best.
Not observed together: Space
```

If extra codes were detected:

```text
Additional detected key: E
```

Primary label:

```text
Observed for this combination
```

Do not automatically state `Ghosting confirmed` or `Keyboard failed`. Result assumes the user physically followed the instruction.

Reserved OS/browser shortcuts may never reach the page. Do not globally `preventDefault()` to force them through.

---

# 16. `/dead-pixel-test`

Job:

```text
Can I visually spot a dead or stuck pixel against solid colors?
```

No automated pixel diagnosis.

Primary card:

```text
Dead Pixel Test
Inspect the screen against solid colors.
[ Start fullscreen test ]
Black  White  Red  Green  Blue
```

Exact sequence:

```text
Black
White
Red
Green
Blue
```

No calibration palette in Expansion 1.

Inside stage:

```text
tap/click   next color
Space       next
ArrowRight  next
ArrowLeft   previous
Esc         browser/fullscreen exit behavior
```

Compact overlay shows color and `N / 5`; it may hide after ~1.5s inactivity and return on interaction.

If Fullscreen API fails, use largest in-page stage and explain that browser chrome cannot be inspected. Do not fail the tool.

No result score. Instruction:

```text
Look for a pixel that stays dark, bright, or the wrong color as the background changes.
```

Below fold explain dead vs stuck appearance, dirt/smudges, and visual-inspection limitation.

No pixel fixer, rapid flashing, warranty pass/fail, ISO classification, camera upload, or automatic detection.

---

# 17. `/backlight-bleed-test`

Job:

```text
Does a backlit display show obvious bright leakage or unevenness on a black screen?
```

Primary card:

```text
Backlight Bleed Test
Dim the room, then inspect a full black screen.
[ Start black screen ]
```

Active stage is pure `#000`, fullscreen when available, largest in-page fallback otherwise, no animation. Overlay may auto-hide after ~1.5s.

Never output `Pass`, `No bleed`, or `Bad bleed`. The browser does not measure emitted luminance; this is visual inspection.

Below-fold explanation must distinguish:

- backlight bleed on backlit LCD/LED;
- IPS glow/viewing angle effects;
- OLED has no backlight, so same diagnosis does not apply;
- cameras may exaggerate glow;
- inspect under conditions that matter to the user.

Dead Pixel and Backlight Bleed share the fullscreen/color-stage infrastructure. Do not create two fullscreen implementations.

---

# 18. `/frame-skipping-test`

Job:

```text
Can I photograph a displayed frame sequence and see repeatable gaps that may indicate skipped refreshes?
```

Non-negotiable limitation:

```text
camera photograph = diagnostic evidence
FrameSampler = pattern timing + browser readiness
```

Browser rAF timestamps alone cannot prove physical monitor frame skipping.

Primary instructions visible without reading the article:

```text
1. Wait for READY.
2. Photograph the moving blocks with a camera.
3. Use ~1/10 s exposure or longer so several blocks appear.
4. Screenshots do not work.
5. Look for gaps in the captured sequence.
```

Visual: Canvas, black background, `48` horizontal slots, one bright square per expected frame ordinal. Reuse `FrameSampler`; no independent rAF loop.

Do not simply `slot++` per callback because a browser timing step that is materially late must invalidate/restart the capture epoch rather than silently redefining the expected sequence.

## Readiness monitor

Provisional readiness rule:

1. warm up at least `1000ms`;
2. maintain latest `60` positive finite frame deltas;
3. require at least `30` deltas;
4. calculate the live median delta;
5. every delta in the most recent `30` must be `< 1.5 × liveMedian`.

Before readiness:

```text
Browser timing unstable — close heavy tabs/apps and wait.
```

When the rule first becomes satisfied, enter a new READY capture epoch.

## Frozen READY capture epoch

At the transition into READY, freeze together:

```text
referenceInterval = median(most recent 30 positive deltas)
referenceStart = current rAF timestamp
```

The `referenceInterval` for that capture epoch **must not be recomputed in the denominator of elapsed-time ordinals** while the epoch remains READY. A changing median applied to a fixed `referenceStart` can manufacture ordinal jumps/repeats even when delivery is stable.

Within that READY epoch:

```text
frameOrdinal = round((timestamp - referenceStart) / referenceInterval)
slot = frameOrdinal % 48
```

The live rolling delta window continues separately only to monitor whether READY remains valid.

READY copy:

```text
READY — take the photo now.
```

## Losing readiness

If the live readiness rule becomes false at any point:

- remove READY immediately;
- clear the current `referenceInterval` and `referenceStart` capture epoch;
- show the unstable/waiting state;
- do not continue rendering ordinals using the stale epoch;
- when timing becomes stable again, create a **fresh** frozen epoch from that new READY transition.

On `FrameSampler reset` (including visibility invalidation): clear readiness, rolling readiness state as required, and the frozen capture epoch; perform a fresh warmup.

This readiness/ordinal rule remains provisional until required real-browser/camera QA. If it is materially misleading or unusable in that QA, change it only through reviewed source-of-truth update + regression tests. Never silently tune semantics.

Interpretation includes tiny continuous/gap examples and states that repeatable gaps in multiple valid photos may indicate skipping, while browser timing/camera exposure can also produce bad captures.

No automatic pass/fail.

---

# 19. Shared visuals

Suggested additions only where useful:

```text
src/visuals/mouse/StandardMouseVisual.astro
src/visuals/mouse/MouseWheelEventStrip.astro
src/visuals/touch/TouchTestSurface.astro
src/visuals/display/FullscreenColorStage.astro
src/visuals/display/frame-skipping-renderer.ts
```

Do not build a generic charting/visualization framework.

Continue instrument minimalism:

```text
off-white / neutral
near-black text
one restrained cool live signal accent
thin borders
subtle grids
strong numeric hierarchy
data-driven motion only
```

No gaming neon.

---

# 20. Recommended project tree

```text
src/
├── browser/
│   ├── frame-sampler.ts
│   ├── gamepad-service.ts
│   ├── keyboard-input-service.ts
│   ├── mouse-movement-service.ts
│   ├── mouse-input-service.ts
│   ├── touch-input-service.ts
│   └── fullscreen.ts
├── tools/
│   ├── mouse/
│   │   ├── dpi/
│   │   ├── tester/
│   │   ├── buttons/
│   │   ├── scroll/
│   │   ├── double-click/
│   │   └── polling-rate/
│   ├── keyboard/
│   │   ├── tester/
│   │   ├── rollover/
│   │   └── ghosting/
│   ├── touch/
│   │   └── tester/
│   └── display/
│       ├── fps/
│       ├── refresh-rate/
│       ├── dead-pixel/
│       ├── backlight-bleed/
│       └── frame-skipping/
├── visuals/
│   ├── mouse/
│   ├── keyboard/
│   ├── touch/
│   └── display/
└── pages/
```

Keep it shallow. Do not pre-create empty abstractions.

---

# 21. SEO page intent boundaries

```text
/mouse-tester
Title: Mouse Tester — Test Buttons, Scroll & Movement Online
H1: Mouse Tester
Intent: broad basic browser mouse-input check

/mouse-button-test
Title: Mouse Button Test — Check Mouse Buttons Online
H1: Mouse Button Test
Intent: button registration

/mouse-scroll-test
Title: Mouse Scroll Test — Check Your Scroll Wheel
H1: Mouse Scroll Test
Intent: wheel direction / obvious reverse events

/double-click-test
Title: Double Click Test — Check Mouse Double-Clicking
H1: Double Click Test
Intent: unintended rapid repeated presses

/mouse-polling-rate-test
Title: Mouse Polling Rate Test — Check Pointer Sample Rate
H1: Mouse Polling Rate Test
Intent: browser-observed pointer sample frequency

/touch-screen-test
Title: Touch Screen Test — Check Touch, Dead Areas & Multi-Touch
H1: Touch Screen Test
Intent: broad touchscreen diagnostic

/keyboard-rollover-test
Title: Keyboard Rollover Test — Check Simultaneous Keys
H1: Keyboard Rollover Test
Intent: simultaneous browser-detected input

/keyboard-ghosting-test
Title: Keyboard Ghosting Test — Check Key Combinations
H1: Keyboard Ghosting Test
Intent: expected combination vs browser-detected combination

/dead-pixel-test
Title: Dead Pixel Test — Check Dead & Stuck Pixels Fullscreen
H1: Dead Pixel Test
Intent: solid-color visual inspection

/backlight-bleed-test
Title: Backlight Bleed Test — Fullscreen Black Screen Check
H1: Backlight Bleed Test
Intent: black-screen visual inspection

/frame-skipping-test
Title: Frame Skipping Test — Check Monitor Frame Skipping
H1: Frame Skipping Test
Intent: camera-assisted skipped-refresh visual test
```

No synonym pages with substantially identical tools.

---

# 22. Internal linking

Mouse Tester links to natural adjacent mouse jobs, but keep related links after the main task/result. Focused mouse pages link back to Mouse Tester plus at most two adjacent diagnostics.

Examples:

```text
Double Click → Mouse Button Test / Mouse Tester
Polling → Mouse DPI Test / Mouse Tester
Scroll → Mouse Tester / Mouse Button Test
Keyboard Tester → Keyboard Rollover / Keyboard Ghosting
Rollover / Ghosting → Keyboard Tester
Touch Screen → Dead Pixel / Backlight Bleed
Dead Pixel → Backlight Bleed / Refresh Rate
Backlight → Dead Pixel
Frame Skipping → Refresh Rate / FPS
```

Never place cross-promotion before primary interaction. Never link an approved-but-unimplemented route as if it were live.

---

# 23. Homepage

Add only implemented routes. No coming-soon cards.

Once enough Expansion 1 tools exist, categories may become:

```text
Controller
Mouse
Keyboard
Display
Touch
```

Do not redesign homepage into a giant directory/dashboard.

---

# 24. Measurement-honesty table

| Tool | Primary wording |
|---|---|
| Mouse Tester | Browser-detected mouse input |
| Mouse Button | Detected button input |
| Mouse Scroll | Browser-detected wheel events |
| Double Click | Rapid repeat events / same-button interval |
| Polling | Observed pointer sample rate |
| Touch | Browser-detected touch input |
| Touch multi-touch | Maximum detected together |
| Touch coverage | Coverage of test area |
| Hands-off touch | Unexpected touch input observed |
| Rollover | Maximum detected together |
| Ghosting | Expected vs detected combination |
| Dead Pixel | Visual inspection |
| Backlight Bleed | Visual inspection |
| Frame Skipping | Camera-assisted frame sequence check |

Forbidden stronger claims:

```text
true hardware polling rate
hardware latency
touchscreen health score
ghosting-free certified
NKRO certified
dead pixel automatically detected
monitor passed
frame skipping automatically detected
```

---

# 25. Accessibility

General:

- announce state transitions/results, not high-frequency streams;
- active state never color-only;
- preserve focus indicators;
- no giant fake-focusable passive keyboard;
- reduced-motion removes decorative interpolation only, not diagnostic state.

Mouse: right-click suppression only on explicit surface; Reset remains keyboard reachable.

Touch: textual metrics available; fullscreen optional; `touch-action:none` only on active surface; page zoom/scroll available outside. A hands-off cancellation caused by focus/visibility loss must be communicated textually.

Fullscreen display tests: clear instructions before fullscreen; obvious exit; no flashing Dead Pixel/Backlight content.

Keyboard: no global `preventDefault()`; reserved shortcuts remain documented limitations.

---

# 26. Performance

Mouse polling:

- no per-sample DOM writes;
- bounded short-session data;
- high-frequency/liveness listeners removed immediately after test;
- source fallback clears the previous attempt rather than retaining mixed data.

Touch:

- fixed grid;
- bounded trails;
- fixed-size pass coverage sets;
- active pointer state removed on end/cancel;
- coalesced samples processed into bounded state without per-sample DOM creation;
- no unlimited event log.

Frame Skipping:

- one existing FrameSampler loop;
- Canvas renderer only;
- no DOM nodes created per frame;
- frozen capture epoch state is small and reset on readiness loss.

Keyboard:

- existing `Set<code>` state model;
- no key history timeline.

---

# 27. Automated test requirements

Existing Vitest quality gate remains.

## MouseInputService

```text
button 0–4 normalization
down/up
non-mouse Pointer Events ignored
wheel delta + deltaMode
blur/visibility clear signal
basic profile does not attach polling listeners
polling source precedence
one-source-per-attempt invariant
registration fallback clears/no samples
liveness-triggered fallback clears timestamps and restarts duration
coalesced timestamp extraction
duplicate removal
start/stop reuse
idempotent destroy
```

## Double-click helper

```text
same-button interval
different buttons isolated
50ms boundary
51ms non-flag
non-finite ignored
non-positive ignored
reset
```

## Polling helper

```text
median interval
duplicate timestamps
non-finite timestamps
minimum 20 interval boundary
known synthetic 125Hz
known synthetic 500Hz
known synthetic 1000Hz
```

These prove math only, not physical hardware accuracy.

## TouchInputService

```text
mouse ignored
pen ignored
touch start/move/end/cancel
coalesced touch moves expanded as observed samples
parent move used when coalesced batch empty
normalized coordinates
inside-surface flag
out-of-surface captured samples not clamped for measurement
multiple active pointer IDs
blur clear
visibility clear
lifecycle
```

## Touch coverage

```text
grid cell mapping
edge coordinates
inside-surface requirement
out-of-surface sample does not mark edge cell
observed/coalesced-sample-only coverage
visual interpolation does not mark coverage
pass1 bitset
confirmation offered for any uncovered pass1 cell
pass2 stored separately
union coverage calculation
not-detected-in-both-passes intersection/complement semantics
reset
```

## Hands-off check

```text
Start activation cannot count
wait until active contacts empty
500ms continuous touch-free guard
guard restarts when touch appears
new touch-contact count
moves do not become extra contacts
blur during guard cancels
hidden during guard cancels
blur during 15s observation cancels
hidden during 15s observation cancels
partial interval never yields quiet result
15s uninterrupted completion
reset/cancel
```

## Rollover

```text
held count
maximum count
repeat keydown no duplication
clear
```

## Ghosting

```text
all expected observed
one expected missing
additional unexpected code
best snapshot retained
preset change resets
```

## Fullscreen helper

```text
unsupported
resolved request + actual fullscreen state
rejected request
exit
cleanup
```

## Frame Skipping

```text
warmup
minimum readiness data
live median interval
1.5× instability boundary
READY transition freezes reference interval/start
frozen denominator remains unchanged during epoch
elapsed-time frame ordinal
readiness loss clears epoch
fresh READY creates fresh epoch
FrameSampler reset clears readiness/reference
```

---

# 28. Real-device QA

Automation does not replace hardware checks.

Mouse: basic 3-button mouse, side-button mouse, wheel, known ~1000Hz gaming mouse if available; Chrome/Edge/Firefox and Safari graceful degradation where available. Verify right/middle/side buttons, wheel, rapid-repeat flow, polling source/caveat, no accidental navigation. For polling, verify the visible Source matches the selected single acquisition path and no fallback attempt mixes timestamps.

Touch: Android Chrome, iPhone/iPad Safari if available, touch laptop/tablet if available. Verify single/multi-touch, edges/corners, coalesced observed-sample coverage where supported, out-of-surface captured movement does not paint edge cells, confirmation pass semantics, pointercancel, scroll/zoom boundaries, fullscreen fallback, hands-off guard/timer, blur/hidden cancellation, mouse ignored.

Keyboard: ordinary keyboard + gaming/NKRO keyboard where available. Verify real gaming combinations and reserved-key limitations.

Display: desktop monitor + mobile display for Dead Pixel/Backlight; fullscreen/fallback. Frame Skipping requires real camera, ~1/10s or longer exposure, multiple visible blocks, screenshots rejected, repeatability review. Verify READY epoch resets cleanly when browser timing becomes unstable or visibility changes.

---

# 29. Visual QA

Capture every new route at:

```text
1440×900
1366×768
1024×768
390×844
```

For Touch Screen Test, add real portrait mobile review.

At `1366×768`, desktop-relevant pages should show without page scroll:

```text
header
H1
one-line intro
full main interaction
primary result/status
```

No page-level horizontal overflow. Touch mobile does not need to fit an article; active test needs enough usable area.

---

# 30. Documentation integration

Before Expansion 1 product code starts, synchronize all normative documents that would otherwise contradict the approved scope/boundaries.

At minimum E1.0/E1.0.1 synchronize:

```text
AGENTS.md
01_PRODUCT.md
02_INFORMATION_ARCHITECTURE.md
06_ARCHITECTURE.md
07_BROWSER_APIS.md
08_ANALYTICS.md
12_LAUNCH_PLAN.md
13_AGENT_RULES.md
14_DEFINITION_OF_DONE.md
15_BACKLOG.md
19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md
README.md
project-manifest.json
20_POST_V1_HARDWARE_EXPANSION_SPEC.md
```

Do not copy this specification wholesale into older full-v1 documents.

`03_TOOL_SPECS.md`, `04_UX_UI.md`, `09_TESTING_QA.md`, `16_UX_ACCEPTANCE.md`, `17_FUNCTIONAL_VISUAL_SYSTEM.md`, and `18_DECISIONS_AND_BOUNDARIES.md` remain valid for full-v1 history and/or global rules unless a genuine cross-cutting conflict is found.

Important:

- promoted Expansion 1 tools are no longer unvalidated backlog;
- Audio stays separate;
- this file owns exact Expansion 1 tool behavior unless a higher-priority cross-cutting rule in `18` applies;
- older docs cross-reference rather than duplicate Expansion 1 algorithms;
- full-v1 history remains accurate;
- do not rewrite docs as if Expansion 1 had always been MVP.

---

# 31. Implementation order

## E1.0 — source-of-truth update

Initial docs-only approval:

- approved Expansion 1 scope;
- exact boundaries;
- routes;
- algorithms;
- manifest/status.

No product code.

## E1.0.1 — independent review corrections

Before E1.1 product code:

- close measurement ambiguities found by independent review;
- synchronize stale normative API/IA/launch/privacy docs;
- run clean diff review and Quality;
- merge before starting Mouse foundation.

## E1.1 — Mouse foundation + broad Mouse Tester

```text
MouseInputService
StandardMouseVisual
/mouse-tester
```

Human visual checkpoint before copying the pattern.

## E1.2 — Mouse focused routes

```text
/mouse-button-test
/mouse-scroll-test
/double-click-test
/mouse-polling-rate-test
```

All reuse MouseInputService. Mouse DPI remains stable.

## E1.3 — Touch

```text
TouchInputService
Fullscreen helper
/touch-screen-test
```

Code review/headless visual review may complete without real hardware, but release-ready status requires real touch hardware review.

## E1.4 — Keyboard

```text
/keyboard-rollover-test
/keyboard-ghosting-test
```

Reuse existing service/grid.

## E1.5 — Display visual inspection

```text
/dead-pixel-test
/backlight-bleed-test
```

Share fullscreen/color-stage code.

## E1.6 — Frame Skipping

```text
/frame-skipping-test
```

Last because:

- lowest standalone SEO ceiling among approved Expansion 1;
- highest interpretation risk;
- real camera QA required.

## E1.7 — final audit

Review:

```text
measurement honesty
one-job/page
viewport budget
mobile/touch
browser cleanup
internal linking
SEO intent separation
no synonym/thin pages
no full-v1 regression
```

---

# 32. Definition of Done

## 32.1 Expansion 1 code-complete

Expansion 1 is code-complete only when:

1. every approved route has a distinct user job;
2. completed full-v1 behavior remains unchanged except related navigation/genuine correctness fixes;
3. new input acquisition is behind approved small typed capability boundaries;
4. no raw input is uploaded/stored;
5. exact calculation/heuristic helpers have tests;
6. unsupported browser states are readable;
7. polling uses one source per attempt and never claims exact hardware/USB truth;
8. free-form rollover never certifies NKRO;
9. ghosting uses a guided expected combination;
10. touch coverage counts only in-surface browser-observed samples, including real coalesced samples where available, and never synthetic interpolation/clamped outside samples;
11. pass-1 and confirmation touch coverage are separate and no hidden uncovered-area threshold is invented;
12. untouched touch cells are not automatically called dead;
13. hands-off touch reports only a complete continuously visible/focused 15-second observation and cancels interrupted runs;
14. Dead Pixel and Backlight remain visual-inspection tools;
15. Frame Skipping explicitly requires camera evidence and uses a frozen READY capture epoch;
16. screenshots are explicitly invalid for Frame Skipping;
17. `1366×768` desktop visual/headless gate passes where appropriate;
18. ~390px layout integrity passes;
19. build/typecheck/tests pass;
20. documentation matches implementation;
21. no Audio/CPS/dashboard scope leaked into Hardware.

Automated/headless validation may use mocked browser input for state/geometry, but it must not be reported as real-device validation.

## 32.2 Expansion 1 release-ready

Before an indexed production release that includes the relevant Expansion 1 routes:

1. real touch-device smoke passes for Touch Screen Test;
2. real mouse smoke passes for mouse input, side buttons, wheel behavior, rapid-repeat flow, and polling caveats/source behavior;
3. real keyboard smoke passes for rollover/ghosting flows;
4. real camera smoke passes for Frame Skipping;
5. required browser graceful-degradation checks are recorded honestly;
6. fullscreen supported/fallback paths are exercised where practical;
7. untested hardware/browser cases remain documented rather than inferred from mocks.

A route may be code-complete before external hardware for its release-ready gate is available. Do not weaken either label or claim validation that did not occur.

---

# 33. Research references

Competitor/product references reviewed in the supplied research/spec include:

```text
https://mousetesters.com/
https://mousetester.io/
https://zumatools.com/mouse-tester/
https://wutools.com/hardware/input/mouse-tester
https://screendetect.com/tests/touch-screen-test
https://tembrica.com/en/touchscreen-test
https://www.luabify.com/device-tests/touch-test
https://systemrequirements.net/tools/keyboard-ghosting-test
https://www.keytesthub.com/n-key-rollover-test/
https://keyboardtester.click/keyboard-ghosting-test.php
https://screen.diy/
https://www.testufo.com/frameskipping
```

Browser/API references for implementation review:

```text
MDN MouseEvent.button / buttons
MDN WheelEvent.deltaMode / deltaX / deltaY
MDN Pointer Events / pointerType / pointerId
MDN PointerEvent.getCoalescedEvents()
MDN pointerrawupdate
MDN Navigator.maxTouchPoints
MDN touch-action
MDN requestFullscreen()
MDN KeyboardEvent.code
MDN dblclick
```

Do not treat competitor copy as source-of-truth when it makes stronger hardware claims than this specification.

---

# 34. Source-of-truth priority for Expansion 1

For Expansion 1 work, read:

```text
19_GLOBAL_GOALS_AND_RELEASE_STRATEGY.md
→ business goal, approved expansion scope, sequencing, release boundary

18_DECISIONS_AND_BOUNDARIES.md
→ global/full-v1 cross-cutting technical and measurement boundaries

20_POST_V1_HARDWARE_EXPANSION_SPEC.md
→ exact Expansion 1 route behavior, algorithms, UX, QA, and implementation order
```

`20` may add explicitly approved post-v1 capability boundaries and tool semantics. It must not silently override an incompatible global rule in `18`.

If `18` and `20` conflict on shared architecture, privacy, lifecycle, measurement honesty, or browser behavior, stop and resolve the source-of-truth conflict before product code changes.

Existing full-v1 behavior remains governed by the existing full-v1 specifications unless an explicit reviewed change says otherwise.

---

# 35. Final product rule

Competitors often try to win by adding:

```text
CPS
latency
exports
logs
scores
benchmark classes
dozens of metrics
aggressive hardware claims
```

That is not our advantage.

The intended experience remains:

```text
search lands directly on the job
→ user understands it immediately
→ interaction itself is useful
→ browser limitations are stated accurately
→ result is not oversold
→ one or two natural next diagnostics are available
```

If an Expansion 1 page starts looking like a peripheral-control dashboard, the implementation has drifted off-spec.
