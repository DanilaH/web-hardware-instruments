import type { ToolId } from '../../config/tool-definitions';
import type { ToolChannel } from '../../config/tools';

export interface ToolContentSection {
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly steps?: readonly string[];
}

export interface ToolPageContent {
  readonly name: string;
  readonly shortDescription: string;
  readonly seoTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly intro: string;
  readonly sections: readonly ToolContentSection[];
}

export interface HomeContent {
  readonly seoTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly intro: string;
  readonly facts: string;
  readonly boundaryAria: string;
  readonly boundaryTitle: string;
  readonly boundaryLocal: string;
  readonly boundarySignals: string;
  readonly boundaryObserved: string;
  readonly boundaryNoUpload: string;
  readonly inputs: readonly string[];
  readonly categoryAria: string;
  readonly chooseTool: string;
  readonly chooseToolIntro: string;
  readonly toolCountSingle: string;
  readonly toolCountPlural: string;
}

export interface SupportPageContent {
  readonly seoTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly intro: string;
  readonly paragraphs: readonly string[];
}

export interface SiteContent {
  readonly nav: {
    readonly primaryAria: string;
    readonly tools: string;
    readonly about: string;
    readonly language: string;
    readonly languageAria: string;
  };
  readonly footer: {
    readonly privacyNote: string;
    readonly navigationAria: string;
    readonly about: string;
    readonly privacy: string;
  };
  readonly relatedTools: string;
  readonly categories: Record<ToolChannel, string>;
  readonly home: HomeContent;
  readonly about: SupportPageContent;
  readonly privacy: SupportPageContent;
  readonly tools: Record<ToolId, ToolPageContent>;
}
