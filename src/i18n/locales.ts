export const locales = ['en', 'pt-BR', 'de', 'fr', 'es', 'ru'] as const;

export type Locale = (typeof locales)[number];

export interface LocaleDefinition {
  readonly locale: Locale;
  readonly routePrefix: string;
  readonly routeSegment: string;
  readonly htmlLang: string;
  readonly hreflang: string;
  readonly label: string;
}

export const localeDefinitions = {
  en: {
    locale: 'en',
    routePrefix: '',
    routeSegment: '',
    htmlLang: 'en',
    hreflang: 'en',
    label: 'English',
  },
  'pt-BR': {
    locale: 'pt-BR',
    routePrefix: '/pt-br',
    routeSegment: 'pt-br',
    htmlLang: 'pt-BR',
    hreflang: 'pt-BR',
    label: 'Português (Brasil)',
  },
  de: {
    locale: 'de',
    routePrefix: '/de',
    routeSegment: 'de',
    htmlLang: 'de',
    hreflang: 'de',
    label: 'Deutsch',
  },
  fr: {
    locale: 'fr',
    routePrefix: '/fr',
    routeSegment: 'fr',
    htmlLang: 'fr',
    hreflang: 'fr',
    label: 'Français',
  },
  es: {
    locale: 'es',
    routePrefix: '/es',
    routeSegment: 'es',
    htmlLang: 'es',
    hreflang: 'es',
    label: 'Español',
  },
  ru: {
    locale: 'ru',
    routePrefix: '/ru',
    routeSegment: 'ru',
    htmlLang: 'ru',
    hreflang: 'ru',
    label: 'Русский',
  },
} as const satisfies Record<Locale, LocaleDefinition>;

export const localizedLocales = locales.filter((locale): locale is Exclude<Locale, 'en'> => locale !== 'en');

const localeByRouteSegment = new Map<string, Exclude<Locale, 'en'>>(
  localizedLocales.map((locale) => [localeDefinitions[locale].routeSegment, locale]),
);

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const getLocaleFromRouteSegment = (segment: string): Locale | null =>
  localeByRouteSegment.get(segment.toLowerCase()) ?? null;

export const getLocaleDefinition = (locale: Locale): LocaleDefinition => localeDefinitions[locale];
