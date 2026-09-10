import type { ImplementedToolChannel } from '../config/tools';
import type { ImplementedContentLocale } from './content';

const homeSignalLabels = {
  en: {
    controller: 'Controller',
    mouse: 'Pointer',
    keyboard: 'Keyboard',
    display: 'Frames',
    touch: 'Touch',
  },
  'pt-BR': {
    controller: 'Controle',
    mouse: 'Ponteiro',
    keyboard: 'Teclado',
    display: 'Frames',
    touch: 'Toque',
  },
  de: {
    controller: 'Controller',
    mouse: 'Zeiger',
    keyboard: 'Tastatur',
    display: 'Frames',
    touch: 'Touch',
  },
  fr: {
    controller: 'Manette',
    mouse: 'Pointeur',
    keyboard: 'Clavier',
    display: 'Images',
    touch: 'Tactile',
  },
  es: {
    controller: 'Gamepad',
    mouse: 'Puntero',
    keyboard: 'Teclado',
    display: 'Frames',
    touch: 'Táctil',
  },
  ru: {
    controller: 'Геймпад',
    mouse: 'Указатель',
    keyboard: 'Клавиатура',
    display: 'Кадры',
    touch: 'Касания',
  },
} as const satisfies Record<ImplementedContentLocale, Record<ImplementedToolChannel, string>>;

export const getHomeSignalLabel = (
  locale: ImplementedContentLocale,
  channel: ImplementedToolChannel,
): string => homeSignalLabels[locale][channel];
