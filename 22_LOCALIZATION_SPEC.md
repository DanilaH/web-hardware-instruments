# HardwareInspect — Localization & i18n Specification

**Status:** approved implementation contract  
**Date:** 2026-09-08  
**Production origin:** `https://hardwareinspect.com`  
**Scope:** localization of the existing implemented catalog; no new diagnostic jobs

---

# 0. Purpose

HardwareInspect now has a validated reason to localize its existing browser-diagnostic catalog.

This work is **not** permission to create synonym pages, redesign tools, alter diagnostic semantics, or expand the catalog. It adds locale-aware routing/content/SEO/runtime messages while keeping each diagnostic implementation single-source.

The localization must preserve the project's existing invariants:

- one route = one real diagnostic job/search intent;
- tool-first page structure;
- static Astro output;
- browser-native diagnostics;
- raw hardware input remains local;
- measurement honesty is mandatory;
- existing English URLs remain stable;
- no backend/account/database requirement;
- no route zoo from translated keyword variants.

Source market decision: `DanilaH/decisions/SEO Utilities/HARDWARE_LOCALIZATION_RESEARCH_V1.md`.

---

# 1. Approved locales

## Initial rollout

```ts
type Locale = 'en' | 'pt-BR' | 'de' | 'fr' | 'es' | 'ru';
```

Routing prefixes:

```text
en     -> no prefix
pt-BR  -> /pt-br
 de    -> /de
 fr    -> /fr
 es    -> /es
 ru    -> /ru
```

English stays at the existing root URLs. Do not migrate it to `/en/`.

Examples:

```text
/gamepad-tester
/pt-br/gamepad-tester
/de/gamepad-tester
/fr/gamepad-tester
/es/gamepad-tester
/ru/gamepad-tester
```

## Phase-2 watchlist

```text
pl
it
tr
```

Do not implement these merely because the i18n system makes it easy. Add them after first-party Search Console evidence or a fresh decision.

## Spanish boundary

Ship one general Spanish locale: `/es/`.

Do not create `/es-es/`, `/es-mx/`, or other regional duplicates until first-party evidence demonstrates a materially distinct search/user need.

Spanish copy may naturally include both globally understood technical loanwords (`mouse`, `gamepad`) and regional synonyms (`ratón`, `mando`, `control/controlador`) where useful. Do not keyword-stuff all variants into H1s.

---

# 2. Stable route identifiers

The existing English route slugs are the canonical semantic identifiers and remain unchanged beneath every locale prefix.

```text
/gamepad-tester
/controller-stick-drift-test
/controller-deadzone-test
/mouse-tester
/mouse-button-test
/mouse-scroll-test
/double-click-test
/mouse-polling-rate-test
/mouse-dpi-test
/keyboard-tester
/keyboard-rollover-test
/keyboard-ghosting-test
/fps-test
/refresh-rate-test
/frame-skipping-test
/dead-pixel-test
/backlight-bleed-test
/touch-screen-test
```

Do not translate URL slugs in v1 localization.

Reasons:

1. route-to-tool identity remains stable;
2. related-tool switching is deterministic;
3. analytics/GSC aggregation can map locale pages to one tool id;
4. no translated-slug alias/redirect matrix is required;
5. SEO value comes primarily from localized title/H1/content and language targeting, not from translating a short utility slug.

---

# 3. Preferred localized H1 / search-job names

These are the initial preferred job names. Technical loanwords are deliberately retained where they match established vocabulary.

| Tool id | English | pt-BR | de | fr | es | ru |
|---|---|---|---|---|---|---|
| `gamepad-tester` | Gamepad Tester | Teste de Gamepad | Gamepad-Test | Test de manette | Test de gamepad | Тест геймпада |
| `controller-stick-drift-test` | Controller Stick Drift Test | Teste de Drift do Controle | Stick-Drift-Test für Controller | Test de drift de manette | Test de drift del joystick | Тест дрифта стиков |
| `controller-deadzone-test` | Controller Deadzone Test | Teste de Deadzone do Controle | Deadzone-Test für Controller | Test de zone morte de manette | Test de zona muerta del gamepad | Тест мёртвой зоны геймпада |
| `mouse-tester` | Mouse Tester | Teste de Mouse | Maus-Test | Test de souris | Test de mouse | Тест мыши |
| `mouse-button-test` | Mouse Button Test | Teste dos Botões do Mouse | Maustasten-Test | Test des boutons de souris | Test de botones del mouse | Тест кнопок мыши |
| `mouse-scroll-test` | Mouse Scroll Test | Teste de Scroll do Mouse | Mausrad-/Scroll-Test | Test de molette de souris | Test de rueda / scroll del mouse | Тест колеса мыши |
| `double-click-test` | Double Click Test | Teste de Duplo Clique | Doppelklick-Test | Test de double clic | Test de doble clic | Тест двойного клика |
| `mouse-polling-rate-test` | Mouse Polling Rate Test | Teste de Polling Rate do Mouse | Maus-Polling-Rate-Test | Test du polling rate de la souris | Test de polling rate del mouse | Тест частоты опроса мыши |
| `mouse-dpi-test` | Mouse DPI Test | Teste de DPI do Mouse | Maus-DPI-Test | Test DPI de souris | Test de DPI del mouse | Тест DPI мыши |
| `keyboard-tester` | Keyboard Tester | Teste de Teclado | Tastatur-Test | Test de clavier | Test de teclado | Тест клавиатуры |
| `keyboard-rollover-test` | Keyboard Rollover Test | Teste de NKRO / Rollover do Teclado | Tastatur-NKRO-/Rollover-Test | Test NKRO / rollover du clavier | Test de NKRO / rollover del teclado | Тест NKRO / одновременных нажатий |
| `keyboard-ghosting-test` | Keyboard Ghosting Test | Teste de Ghosting do Teclado | Tastatur-Ghosting-Test | Test de ghosting du clavier | Test de ghosting del teclado | Тест гостинга клавиатуры |
| `fps-test` | FPS Test | Teste de FPS | FPS-Test | Test FPS | Test de FPS | Тест FPS |
| `refresh-rate-test` | Refresh Rate Test | Teste de Taxa de Atualização | Bildwiederholraten-Test | Test du taux de rafraîchissement | Test de frecuencia de actualización | Тест частоты обновления монитора |
| `frame-skipping-test` | Frame Skipping Test | Teste de Frame Skipping | Frame-Skipping-Test | Test de frame skipping | Test de frame skipping | Тест пропуска кадров (Frame Skipping) |
| `dead-pixel-test` | Dead Pixel Test | Teste de Pixel Morto | Pixelfehler-Test | Test de pixel mort | Test de píxeles muertos | Тест битых пикселей |
| `backlight-bleed-test` | Backlight Bleed Test | Teste de Backlight Bleed | Backlight-Bleeding-Test | Test de fuite de rétroéclairage | Test de fugas de luz / backlight bleed | Тест засветов монитора |
| `touch-screen-test` | Touch Screen Test | Teste de Tela Sensível ao Toque | Touchscreen-Test | Test d’écran tactile | Test de pantalla táctil | Тест сенсорного экрана |

Do not mechanically translate established terms such as DPI, FPS, NKRO, polling rate, ghosting, drift, deadzone, frame skipping when local technical usage clearly retains them.

---

# 4. SEO title rules

The English source titles in `05_SEO_CONTENT.md` and the exact Expansion 1 boundaries remain the semantic source of truth.

Localized titles should:

1. lead with the localized job name;
2. add one concise user-outcome phrase only where it improves clarity;
3. naturally include `online`/browser wording where established in that locale;
4. preserve measurement uncertainty;
5. never stack synonym variants.

Examples of acceptable patterns:

```text
pt-BR: Teste de Teclado Online — Verifique as Teclas
de:    Tastatur-Test Online — Tasten im Browser prüfen
fr:    Test de clavier en ligne — Vérifier les touches
es:    Test de teclado online — Comprobar las teclas
ru:    Тест клавиатуры онлайн — Проверка клавиш
```

For measurement-sensitive pages, use the locale-equivalent of `estimate`, `observed`, `visual inspection`, `camera-assisted`, or `heuristic` where required.

Examples:

- Refresh Rate: estimate browser-visible cadence; do not promise exact physical monitor Hz certification.
- Mouse DPI: estimate DPI from entered physical travel.
- Mouse Polling Rate: browser-observed sample rate; do not call it direct USB polling measurement.
- Controller Deadzone: heuristic starting deadzone, not authoritative device calibration.

Exact localized titles may be tuned later from GSC CTR/query evidence without changing the route intent.

---

# 5. i18n architecture

## 5.1 Core rule

**Strings vary by locale. Diagnostic logic does not.**

Do not create five copies of a page controller, browser service, view model, renderer, or calculation helper.

Preferred architecture:

```text
stable tool id
    ↓
locale
    ↓
localized content/messages
    ↓
Astro page shell + shared tool component
    ↓
same controller / browser service / algorithm
```

## 5.2 Suggested files

A reasonable implementation shape is:

```text
src/i18n/
├── locales.ts
├── routing.ts
├── get-locale.ts
├── get-messages.ts
├── types.ts
└── messages/
    ├── en.ts
    ├── pt-BR.ts
    ├── de.ts
    ├── fr.ts
    ├── es.ts
    └── ru.ts
```

Equivalent structure is acceptable if it preserves strict typing and single-source tool logic.

## 5.3 Locale definition

Keep a strongly typed locale registry containing at least:

```ts
interface LocaleDefinition {
  locale: Locale;
  routePrefix: string;
  htmlLang: string;
  hreflang: string;
  label: string;
}
```

Example intent:

```ts
'en'    -> prefix '',       htmlLang 'en',    hreflang 'en'
'pt-BR' -> prefix '/pt-br', htmlLang 'pt-BR', hreflang 'pt-BR'
'de'    -> prefix '/de',    htmlLang 'de',    hreflang 'de'
'fr'    -> prefix '/fr',    htmlLang 'fr',    hreflang 'fr'
'es'    -> prefix '/es',    htmlLang 'es',    hreflang 'es'
'ru'    -> prefix '/ru',    htmlLang 'ru',    hreflang 'ru'
```

Do not infer locale from arbitrary URL substrings throughout the application. Centralize route parsing/building.

---

# 6. Content model

The current `src/config/tools.ts` mixes stable tool metadata with English presentation copy.

Refactor only as much as required to separate:

### Stable data

```text
tool id
route slug
icon
channel
related-tool relationships
```

### Localized data

```text
name
short description
SEO title
meta description
H1
page intro
instruction/help copy
limitation copy
related-tool display copy
runtime labels/status/error/action strings
```

The tool registry should be addressable by a stable tool id, not by a locale-prefixed pathname.

Current code such as:

```ts
getToolByPath(canonicalPath)
```

must not silently fail for `/pt-br/gamepad-tester`. Either strip/resolve locale centrally before tool lookup or pass the stable tool id explicitly.

---

# 7. Page generation

Avoid manually maintaining ~90 copied `.astro` pages.

Preferred options, in order:

1. typed data-driven static generation for locale/tool combinations;
2. shared page components with `getStaticPaths()` and stable tool ids;
3. minimal thin locale route wrappers only if Astro constraints make option 1 materially less clear.

The English root routes must remain stable and can continue using current files during migration, but localized variants should reuse shared page/content primitives rather than fork tool logic.

A migration that eventually centralizes English through the same content system is desirable if it can be done without redesigning or behavior-changing completed tools.

Do not perform broad unrelated refactors merely for architectural neatness.

---

# 8. Runtime TypeScript messages

Localization is incomplete if the Astro shell is translated while controllers continue emitting English.

Current runtime controllers contain literal strings for states such as:

```text
No controller detected
Controller detected
Connect a controller and press any button
Gamepad API unavailable
Not enough movement — try again
Reset
Start
Stop
Fullscreen
```

All user-visible runtime strings must come from a locale/tool message object or another strongly typed i18n source.

Acceptable patterns:

```ts
mountGamepadTester(root, messages.gamepadTester)
```

or

```ts
const messages = readSerializedToolMessages(root);
```

Do not make controllers import a global mutable locale singleton. Prefer explicit dependencies so tests can inject English/translated messages and diagnostic logic remains deterministic.

Do not localize:

- DOM data attributes;
- internal enum/status keys;
- analytics event identifiers;
- machine-readable result fields intended to be stable;
- browser API identifiers.

Localize only user-visible representation.

---

# 9. BaseLayout changes

`BaseLayout.astro` currently hardcodes:

```html
<html lang="en">
```

Add locale awareness.

Expected responsibility:

```ts
interface Props {
  locale?: Locale;
  // existing props...
}
```

English remains the default for backwards safety.

Render the registry-defined `htmlLang`.

`data-channel` should continue to work on locale routes. It must derive from the stable tool identity rather than failing because the canonical pathname contains a locale prefix.

Homepage WebSite structured data remains one site identity. Do not create fake locale-specific organizations/brands.

---

# 10. Canonical and hreflang

`SeoHead.astro` currently emits only a canonical URL.

Add support for reciprocal alternates.

For an implemented semantic route, output one alternate for each locale that actually exists.

Example for Gamepad Tester:

```html
<link rel="alternate" hreflang="en" href="https://hardwareinspect.com/gamepad-tester" />
<link rel="alternate" hreflang="pt-BR" href="https://hardwareinspect.com/pt-br/gamepad-tester" />
<link rel="alternate" hreflang="de" href="https://hardwareinspect.com/de/gamepad-tester" />
<link rel="alternate" hreflang="fr" href="https://hardwareinspect.com/fr/gamepad-tester" />
<link rel="alternate" hreflang="es" href="https://hardwareinspect.com/es/gamepad-tester" />
<link rel="alternate" hreflang="ru" href="https://hardwareinspect.com/ru/gamepad-tester" />
<link rel="alternate" hreflang="x-default" href="https://hardwareinspect.com/gamepad-tester" />
```

Rules:

- localized page canonical points to itself;
- never canonicalize translations back to English;
- hreflang relationships are reciprocal;
- do not advertise an alternate that is not actually generated/indexable;
- `x-default` may point to English;
- canonical and alternate URLs must use `siteConfig.origin`.

Apply equivalent alternate grouping to homepage and supporting localized pages when those versions ship.

---

# 11. Sitemap

The Astro sitemap must include every indexable localized page after generation.

Do not rely on sitemap presence as a substitute for hreflang in `<head>`.

Optional sitemap alternate annotations may be added if they are generated from the same locale registry and cannot drift from head alternates. Do not maintain two independent alternate maps manually.

Before release, verify representative URLs for every locale appear in built sitemap output.

---

# 12. Language switcher

Add a compact language selector in a non-disruptive header/footer location.

Behavior:

- switching language keeps the user on the same semantic tool when an alternate exists;
- homepage switches to locale homepage;
- supporting pages switch to the equivalent localized page when available;
- do not force IP/geolocation redirects;
- do not redirect search crawlers based on `Accept-Language`;
- optional persisted preference is allowed only as a convenience and must not make canonical URLs inaccessible.

Labels should use recognizable language self-names, for example:

```text
English
Português (Brasil)
Deutsch
Français
Español
Русский
```

Avoid flag-only controls because language != country and flags are ambiguous.

---

# 13. Navigation / related tools

`SiteHeader`, `SiteFooter`, homepage groups and `RelatedTools` must be localized.

All internal tool links from a localized page should remain in that locale unless an equivalent page does not exist.

Example:

```text
/de/mouse-dpi-test
  -> /de/mouse-tester
  -> /de/mouse-polling-rate-test
```

Do not silently send a localized user back to English through related-tool links.

The existing related-tool graph remains authoritative. Localization changes labels/URLs, not relationship logic.

---

# 14. Supporting pages

Localize at least:

```text
/
/about
/privacy
```

into every shipped initial locale.

Privacy copy must accurately match the product's real data behavior. Translation must not introduce broader claims than the English source.

The homepage should preserve current catalog grouping:

```text
Controller
Mouse
Keyboard
Display
Touch
```

Use natural local category names but do not create category landing pages merely for localization.

---

# 15. Translation quality rules

## 15.1 Translate meaning, not tokens

Good localization uses native technical vocabulary, including loanwords where users actually use them.

Do not force awkward literal translations of:

```text
DPI
FPS
NKRO
polling rate
rollover
ghosting
drift
deadzone
frame skipping
backlight bleed
```

when the local technical ecosystem primarily uses the English term or a hybrid phrase.

## 15.2 Preserve product semantics

A translation must never claim:

- certified hardware health;
- exact USB polling packets;
- exact physical display refresh certification;
- automatic dead-pixel/backlight diagnosis;
- confirmed ghosting from unconstrained free-form input;
- touch hardware health from a short browser observation.

## 15.3 Avoid SEO translation spam

Do not put every synonym into H1/title.

Use secondary wording naturally in:

- intro;
- meta description;
- how-to text;
- limitation/explanation blocks.

Example Spanish:

- H1 may say `Test de mouse`;
- supporting copy may explain `mouse (ratón)` once where useful;
- do not title the page `Test de Mouse Ratón Mando...`.

## 15.4 Brand

`HardwareInspect` is a brand and remains unchanged.

---

# 16. Locale-specific terminology notes

## pt-BR

Prefer:

```text
Teste de Teclado
Teste de Mouse
Teste de Gamepad
pixel morto
taxa de atualização
Polling Rate
DPI
Ghosting
NKRO / Rollover
```

ABNT/ABNT2 is relevant supporting vocabulary for Keyboard Tester, but do not redesign the physical keyboard visualization solely for SEO unless the actual current input mapping needs it. If a localized keyboard layout is added, it must remain truthful to browser physical-code semantics.

`controle` is natural in explanatory copy; `gamepad` is strong technical/search vocabulary.

## de

Prefer natural compounds where clear:

```text
Tastatur-Test
Maus-Test
Maustasten-Test
Pixelfehler-Test
Bildwiederholrate
```

Retain technical loanwords where established:

```text
Gamepad
Stick Drift
Deadzone
Polling Rate
DPI
Ghosting
NKRO
Frame Skipping
Backlight Bleeding
```

## fr

Natural core nouns:

```text
clavier
souris
manette
pixel mort
taux de rafraîchissement
écran tactile
fuite de rétroéclairage
```

Technical loanwords such as `polling rate`, `ghosting`, `NKRO` are acceptable and often clearer than invented literal terminology.

## es

General Spanish must work beyond Spain.

Core strategy:

```text
mouse / gamepad in globally technical contexts
ratón / mando / control in natural secondary copy
píxeles muertos
frecuencia de actualización
pantalla táctil
zona muerta
doble clic
```

Do not build separate Spain/Mexico/LatAm pages now.

## ru

Preferred technical vocabulary:

```text
тест клавиатуры
тест мыши
тест геймпада
дрифт стиков
мёртвая зона
частота опроса мыши
DPI
гостинг / NKRO
частота обновления монитора
битые пиксели
засветы монитора
сенсорный экран
```

`Frame Skipping` may be retained in parentheses after `пропуск кадров` for recognizability.

---

# 17. Analytics

Preserve existing stable analytics event names and add locale as a dimension/property where useful.

Recommended analytics identity:

```text
toolId = stable English semantic id
locale = en | pt-BR | de | fr | es | ru
```

Do not translate event names or create a different analytics schema per language.

GSC analysis should compare:

- locale page impressions/clicks;
- actual query vocabulary;
- country distribution;
- indexation rate;
- CTR by localized title;
- unexpected cannibalization;
- which technical loanword/native-language variants Google associates with each route.

Real GSC evidence may later justify title vocabulary changes or phase-2 locales.

---

# 18. QA / Definition of Done

Localization is not complete until all of the following pass.

## Routing

- English routes remain unchanged and return 200.
- Every expected localized route returns 200.
- no duplicate slash/locale variants become indexable accidentally;
- 404 behavior remains correct.

## Language

- every localized document has correct `<html lang>`;
- no visible English leftovers in primary tool flow unless the term is intentionally technical vocabulary;
- dynamic runtime state/error/action text is localized;
- layout does not break with longer German/French/Russian strings.

## SEO

- self-canonical for every locale route;
- correct reciprocal hreflang set;
- no localized page canonicalizes to English;
- `x-default` is consistent if used;
- sitemap contains localized routes;
- titles/descriptions are unique by language and intent;
- no locale page is accidentally `noindex` when production indexing is enabled.

## Internal links

- localized header/footer links stay localized;
- related tools stay localized;
- language switcher maps to same semantic job;
- no orphan locale tool pages.

## Functional parity

For each of the 18 tools, validate at least English + pt-BR + one non-Latin locale (`ru`) after architecture work:

- same acquisition behavior;
- same result math/heuristics;
- same lifecycle cleanup;
- same accessibility semantics;
- same privacy behavior.

Then run smoke coverage across the remaining locales.

## Accessibility

- translated labels remain connected to controls;
- aria-live text is localized;
- screen-reader-only status text is localized;
- language switcher is keyboard accessible and has a text label;
- no flag-only language semantics.

## Measurement honesty

Independent review must verify translations did not strengthen claims.

---

# 19. Recommended implementation sequence

## Phase A — infrastructure, English unchanged

1. introduce typed locale registry/routing helpers;
2. introduce message/content model;
3. make BaseLayout locale-aware;
4. add locale-aware canonical/hreflang support;
5. make stable tool lookup independent of locale-prefixed pathname;
6. make navigation/RelatedTools locale-aware;
7. externalize runtime user-visible strings from controllers/components;
8. migrate English through the message system where safe;
9. prove English output/behavior has not changed unexpectedly.

## Phase B — pt-BR

1. add full pt-BR page/content/runtime dictionary;
2. generate all 18 pt-BR tools + homepage/about/privacy;
3. verify ABNT/technical wording;
4. run functional/visual/SEO QA;
5. deploy and inspect representative URLs.

## Phase C — de + fr

Add both after infrastructure is proven. Pay special attention to long strings and retained technical loanwords.

## Phase D — es

Add one general Spanish locale. Include regional synonyms naturally but keep one canonical Spanish page per job.

## Phase E — ru

Add Russian and verify Cyrillic typography/layout plus localized runtime status text.

Do not add PL/IT/TR in this implementation scope.

---

# 20. Explicit non-goals

Localization V1 does **not** include:

- new diagnostic routes;
- translated URL slugs;
- country-specific Spanish copies;
- automatic IP/geolocation redirects;
- machine-translated thin pages with English tool UI left behind;
- new backend or CMS;
- user accounts/preferences service;
- new analytics vendor;
- redesign of completed diagnostic interactions;
- changing measurement algorithms;
- phase-2 PL/IT/TR pages;
- localized article/content-farm expansion.

---

# 21. Final product rule

The localized product must feel like the same HardwareInspect tool written for the user's language, **not an English page wrapped in translated SEO text**.

The success criterion is:

```text
one diagnostic implementation
× several genuinely localized search/user surfaces
× truthful identical measurement semantics
```

After launch, use first-party GSC/indexing/query evidence to tune wording and decide additional locales. Do not reopen broad localization discovery merely because uncertainty remains non-zero.
