import type { Locale } from '../locales';
import type { HomeContent } from './types';

export const printerHomepageCopyByLocale = {
  en: {
    metaDescription: 'Focused browser hardware tests for controllers, mice, keyboards, displays, touchscreens, and printable printer references. No install or account required.',
    intro: 'Focused diagnostics for controllers, mice, keyboards, displays, touchscreens, and print output — built to show what the browser can actually detect, estimate, or render locally.',
  },
  'pt-BR': {
    metaDescription: 'Testes de hardware no navegador para controles, mouse, teclado, telas, touchscreens e referências imprimíveis para impressoras. Sem instalação nem conta.',
    intro: 'Diagnósticos focados para controles, mouse, teclado, telas, touchscreens e saída de impressão — mostrando o que o navegador consegue detectar, estimar ou renderizar localmente.',
  },
  de: {
    metaDescription: 'Gezielte Browser-Hardwaretests für Controller, Mäuse, Tastaturen, Displays, Touchscreens und druckbare Drucker-Referenzen. Keine Installation, kein Konto.',
    intro: 'Gezielte Diagnosen für Controller, Mäuse, Tastaturen, Displays, Touchscreens und Druckausgabe — sie zeigen, was der Browser tatsächlich erkennen, schätzen oder lokal rendern kann.',
  },
  fr: {
    metaDescription: 'Tests matériels ciblés dans le navigateur pour manettes, souris, claviers, écrans, écrans tactiles et références imprimables. Sans installation ni compte.',
    intro: 'Des diagnostics ciblés pour manettes, souris, claviers, écrans, écrans tactiles et sortie imprimée — pour montrer ce que le navigateur peut réellement détecter, estimer ou rendre localement.',
  },
  es: {
    metaDescription: 'Tests de hardware en el navegador para gamepads, mouse, teclados, pantallas, pantallas táctiles y referencias imprimibles. Sin instalación ni cuenta.',
    intro: 'Diagnósticos específicos para gamepads, mouse, teclados, pantallas, pantallas táctiles y salida impresa, diseñados para mostrar lo que el navegador puede detectar, estimar o renderizar localmente.',
  },
  ru: {
    metaDescription: 'Аппаратные тесты в браузере для геймпадов, мышей, клавиатур, экранов, сенсорных дисплеев и печатных тестовых эталонов. Без установки и аккаунта.',
    intro: 'Диагностика геймпадов, мышей, клавиатур, экранов, сенсорных дисплеев и печати — с честным показом того, что браузер может обнаружить, оценить или локально отрисовать.',
  },
} as const satisfies Record<Locale, Pick<HomeContent, 'metaDescription' | 'intro'>>;
