import type { ImplementedContentLocale } from '../content';
import { deRuntimeMessages } from './de';
import { enRuntimeMessages } from './en';
import { frRuntimeMessages } from './fr';
import { ptBRRuntimeMessages } from './pt-BR';
import type { RuntimeMessages } from './types';

const runtimeMessagesByLocale = {
  en: enRuntimeMessages,
  'pt-BR': ptBRRuntimeMessages,
  de: deRuntimeMessages,
  fr: frRuntimeMessages,
} as const satisfies Record<ImplementedContentLocale, RuntimeMessages>;

export const getRuntimeMessages = (locale: ImplementedContentLocale): RuntimeMessages => runtimeMessagesByLocale[locale];
export type { RuntimeMessages, RuntimeMessageKey, ToolRuntimeMessages } from './types';
export { formatMessage, readSerializedMessages } from './format';
