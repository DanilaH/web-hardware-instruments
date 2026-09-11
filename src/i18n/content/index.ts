import type { Locale } from '../locales';
import { deContent } from './de';
import { enContent } from './en';
import { esContent } from './es';
import { frContent } from './fr';
import { monitorContentByLocale } from './monitor';
import { oledBurnInContentByLocale } from './oled-burn-in';
import { printerHomepageCopyByLocale } from './printer-home';
import { printerContentByLocale } from './printer';
import { ptBRContent } from './pt-BR';
import { ruContent } from './ru';
import { screenResolutionContentByLocale } from './screen-resolution';
import { screenUniformityContentByLocale } from './screen-uniformity';
import type { HomeContent, ResolvedSiteContent, SiteContent } from './types';

export const implementedContentLocales = ['en', 'pt-BR', 'de', 'fr', 'es', 'ru'] as const satisfies readonly Locale[];
export type ImplementedContentLocale = (typeof implementedContentLocales)[number];

type PrinterHomeContent = Pick<
  HomeContent,
  'facts' | 'boundaryAria' | 'boundaryLocal' | 'boundarySignals' | 'boundaryObserved' | 'boundaryNoUpload'
>;
type PrinterHomepageCopy = Pick<HomeContent, 'metaDescription' | 'intro'>;

const resolveHomeContent = (
  base: HomeContent,
  printerHome: PrinterHomeContent,
  printerHomepageCopy: PrinterHomepageCopy,
  facts: string,
  printerSignal: string,
): HomeContent => ({
  ...base,
  ...printerHome,
  ...printerHomepageCopy,
  facts,
  inputs: [...base.inputs, printerSignal],
});

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
  const monitor = monitorContentByLocale[locale];
  const screenUniformity = screenUniformityContentByLocale[locale];
  const oledBurnIn = oledBurnInContentByLocale[locale];
  const screenResolution = screenResolutionContentByLocale[locale];
  const home = resolveHomeContent(
    base.home,
    printer.home,
    printerHomepageCopy,
    screenResolution.home.facts,
    printer.signal,
  );

  return {
    ...base,
    categories: {
      ...base.categories,
      printer: printer.category,
    },
    home,
    tools: {
      ...base.tools,
      'printer-test-page': printer.tool,
      'monitor-test': monitor.tool,
      'screen-uniformity-test': screenUniformity.tool,
      'oled-burn-in-test': oledBurnIn.tool,
      'screen-resolution-checker': screenResolution.tool,
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
