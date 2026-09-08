import type { ImplementedContentLocale } from '../content';
import { enRuntimeMessages } from './en';
import { ptBRRuntimeMessages } from './pt-BR';
import type { RuntimeMessages } from './types';

const runtimeMessagesByLocale = {
  en: enRuntimeMessages,
  'pt-BR': ptBRRuntimeMessages,
} as const satisfies Record<ImplementedContentLocale, RuntimeMessages>;

export const getRuntimeMessages = (locale: ImplementedContentLocale): RuntimeMessages => runtimeMessagesByLocale[locale];
export type { RuntimeMessages, RuntimeMessageKey, ToolRuntimeMessages } from './types';
export { formatMessage, readSerializedMessages } from './format';
