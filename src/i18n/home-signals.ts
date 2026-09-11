import type { ImplementedToolChannel } from '../config/tools';
import type { ImplementedContentLocale } from './content';
import { printerContentByLocale } from './content/printer';
import { webcamContentByLocale } from './content/webcam';

const homeSignalLabels = {
  en: {
    controller: 'Controller',
    mouse: 'Pointer',
    keyboard: 'Keyboard',
    display: 'Frames',
    touch: 'Touch',
    camera: webcamContentByLocale.en.signal,
    printer: printerContentByLocale.en.signal,
  },
  'pt-BR': {
    controller: 'Controle',
    mouse: 'Ponteiro',
    keyboard: 'Teclado',
    display: 'Frames',
    touch: 'Toque',
    camera: webcamContentByLocale['pt-BR'].signal,
    printer: printerContentByLocale['pt-BR'].signal,
  },
  de: {
    controller: 'Controller',
    mouse: 'Zeiger',
    keyboard: 'Tastatur',
    display: 'Frames',
    touch: 'Touch',
    camera: webcamContentByLocale.de.signal,
    printer: printerContentByLocale.de.signal,
  },
  fr: {
    controller: 'Manette',
    mouse: 'Pointeur',
    keyboard: 'Clavier',
    display: 'Images',
    touch: 'Tactile',
    camera: webcamContentByLocale.fr.signal,
    printer: printerContentByLocale.fr.signal,
  },
  es: {
    controller: 'Gamepad',
    mouse: 'Puntero',
    keyboard: 'Teclado',
    display: 'Frames',
    touch: 'Táctil',
    camera: webcamContentByLocale.es.signal,
    printer: printerContentByLocale.es.signal,
  },
  ru: {
    controller: 'Геймпад',
    mouse: 'Указатель',
    keyboard: 'Клавиатура',
    display: 'Кадры',
    touch: 'Касания',
    camera: webcamContentByLocale.ru.signal,
    printer: printerContentByLocale.ru.signal,
  },
} as const satisfies Record<ImplementedContentLocale, Record<ImplementedToolChannel, string>>;

export const getHomeSignalLabel = (
  locale: ImplementedContentLocale,
  channel: ImplementedToolChannel,
): string => homeSignalLabels[locale][channel];
