import type { Locale } from '../locales';
import { deContent } from './de';
import { enContent } from './en';
import { esContent } from './es';
import { frContent } from './fr';
import { printerHomepageCopyByLocale } from './printer-home';
import { printerContentByLocale } from './printer';
import { ptBRContent } from './pt-BR';
import { ruContent } from './ru';
import type { ResolvedSiteContent, SiteContent } from './types';

export const implementedContentLocales = ['en', 'pt-BR', 'de', 'fr', 'es', 'ru'] as const satisfies readonly Locale[];
export type ImplementedContentLocale = (typeof implementedContentLocales)[number];

const baseContentByLocale = {
  en: enContent,
  'pt-BR': ptBRContent,
  de: deContent,
  fr: frContent,
  es: esContent,
  ru: ruContent,
} as const satisfies Record<ImplementedContentLocale, SiteContent>;

const resolveSiteContent = (locale: ImplementedContentLocale): ResolvedSiteContent => {
  const base = baseContentByLocale[locale];
  const printer = printerContentByLocale[locale];
  const printerHomepageCopy = printerHomepageCopyByLocale[locale];

  return {
    ...base,
    categories: {
      ...base.categories,
      printer: printer.category,
    },
    home: {
      ...base.home,
      ...printer.home,
      ...printerHomepageCopy,
      inputs: [...base.home.inputs, printer.signal],
    },
    tools: {
      ...base.tools,
      'printer-test-page': printer.tool,
    },
  };
};

const contentByLocale = {
  en: resolveSiteContent('en'),
  'pt-BR': resolveSiteContent('pt-BR'),
  de: resolveSiteContent('de'),
  fr: resolveSiteContent('fr'),
  es: resolveSiteContent('es'),
  ru: resolveSiteContent('ru'),
} as const satisfies Record<ImplementedContentLocale, ResolvedSiteContent>;

export const hasContentForLocale = (locale: Locale): locale is ImplementedContentLocale =>
  (implementedContentLocales as readonly Locale[]).includes(locale);

export const getSiteContent = (locale: ImplementedContentLocale): ResolvedSiteContent => contentByLocale[locale];

export type {
  ResolvedSiteContent,
  SiteContent,
  SupportPageContent,
  ToolContentSection,
  ToolPageContent,
} from './types';
