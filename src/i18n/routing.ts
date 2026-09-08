import { localeDefinitions, locales, type Locale } from './locales';

export interface ParsedLocalizedPath {
  readonly locale: Locale;
  readonly semanticPath: string;
}

export interface AlternateLink {
  readonly hreflang: string;
  readonly path: string;
}

export const normalizePath = (path: string): string => {
  if (!path || path === '/') return '/';
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.replace(/\/+$/, '') || '/';
};

export const parseLocalizedPath = (path: string): ParsedLocalizedPath => {
  const normalized = normalizePath(path);
  const [firstSegment = ''] = normalized.slice(1).split('/');

  for (const locale of locales) {
    const definition = localeDefinitions[locale];
    if (!definition.routeSegment || definition.routeSegment !== firstSegment.toLowerCase()) continue;

    const semantic = normalized.slice(definition.routePrefix.length) || '/';
    return { locale, semanticPath: normalizePath(semantic) };
  }

  return { locale: 'en', semanticPath: normalized };
};

export const buildLocalizedPath = (locale: Locale, semanticPath: string): string => {
  const normalized = normalizePath(semanticPath);
  const prefix = localeDefinitions[locale].routePrefix;
  if (!prefix) return normalized;
  return normalized === '/' ? prefix : `${prefix}${normalized}`;
};

export const buildAlternateLinks = (
  semanticPath: string,
  availableLocales: readonly Locale[] = locales,
): readonly AlternateLink[] => [
  ...availableLocales.map((locale) => ({
    hreflang: localeDefinitions[locale].hreflang,
    path: buildLocalizedPath(locale, semanticPath),
  })),
  ...(availableLocales.includes('en')
    ? [{ hreflang: 'x-default', path: buildLocalizedPath('en', semanticPath) }]
    : []),
];

export const getSemanticPath = (path: string): string => parseLocalizedPath(path).semanticPath;
