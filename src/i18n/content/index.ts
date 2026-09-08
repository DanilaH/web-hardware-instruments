import type { Locale } from '../locales';
import { deContent } from './de';
import { enContent } from './en';
import { esContent } from './es';
import { frContent } from './fr';
import { ptBRContent } from './pt-BR';
import type { SiteContent } from './types';

export const implementedContentLocales = ['en', 'pt-BR', 'de', 'fr', 'es'] as const satisfies readonly Locale[];
export type ImplementedContentLocale = (typeof implementedContentLocales)[number];

const contentByLocale = {
  en: enContent,
  'pt-BR': ptBRContent,
  de: deContent,
  fr: frContent,
  es: esContent,
} as const satisfies Record<ImplementedContentLocale, SiteContent>;

export const hasContentForLocale = (locale: Locale): locale is ImplementedContentLocale =>
  (implementedContentLocales as readonly Locale[]).includes(locale);

export const getSiteContent = (locale: ImplementedContentLocale): SiteContent => contentByLocale[locale];

export type { SiteContent, SupportPageContent, ToolContentSection, ToolPageContent } from './types';