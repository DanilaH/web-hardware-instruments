import type { Locale } from '../locales';

export interface ScreenResolutionRuntimeMessages {
  readonly controlsHeading: string;
  readonly browserReported: string;
  readonly screenSize: string;
  readonly cssPixels: string;
  readonly estimatedDevicePixels: string;
  readonly estimated: string;
  readonly devicePixels: string;
  readonly viewport: string;
  readonly availableArea: string;
  readonly devicePixelRatio: string;
  readonly colorDepth: string;
  readonly bits: string;
  readonly orientation: string;
}

const messagesByLocale = {
  en: {
    controlsHeading: 'Screen resolution information', browserReported: 'Browser-reported values', screenSize: 'Browser-reported screen size', cssPixels: 'CSS px', estimatedDevicePixels: 'Estimated device-pixel dimensions', estimated: 'Estimated', devicePixels: 'device px', viewport: 'Browser viewport', availableArea: 'Available screen area', devicePixelRatio: 'Device pixel ratio', colorDepth: 'Color depth', bits: 'bits', orientation: 'Orientation',
  },
  'pt-BR': {
    controlsHeading: 'Informações de resolução da tela', browserReported: 'Valores informados pelo navegador', screenSize: 'Tamanho da tela informado pelo navegador', cssPixels: 'px CSS', estimatedDevicePixels: 'Dimensões estimadas em pixels do dispositivo', estimated: 'Estimado', devicePixels: 'px do dispositivo', viewport: 'Viewport do navegador', availableArea: 'Área de tela disponível', devicePixelRatio: 'Proporção de pixels do dispositivo', colorDepth: 'Profundidade de cor', bits: 'bits', orientation: 'Orientação',
  },
  de: {
    controlsHeading: 'Informationen zur Bildschirmauflösung', browserReported: 'Vom Browser gemeldete Werte', screenSize: 'Vom Browser gemeldete Bildschirmgröße', cssPixels: 'CSS px', estimatedDevicePixels: 'Geschätzte Gerätepixel-Abmessungen', estimated: 'Geschätzt', devicePixels: 'Geräte-px', viewport: 'Browser-Viewport', availableArea: 'Verfügbarer Bildschirmbereich', devicePixelRatio: 'Device Pixel Ratio', colorDepth: 'Farbtiefe', bits: 'Bit', orientation: 'Ausrichtung',
  },
  fr: {
    controlsHeading: "Informations sur la résolution de l’écran", browserReported: 'Valeurs rapportées par le navigateur', screenSize: 'Taille d’écran rapportée par le navigateur', cssPixels: 'px CSS', estimatedDevicePixels: 'Dimensions estimées en pixels appareil', estimated: 'Estimation', devicePixels: 'px appareil', viewport: 'Fenêtre du navigateur', availableArea: 'Zone d’écran disponible', devicePixelRatio: 'Ratio de pixels appareil', colorDepth: 'Profondeur de couleur', bits: 'bits', orientation: 'Orientation',
  },
  es: {
    controlsHeading: 'Información de resolución de pantalla', browserReported: 'Valores informados por el navegador', screenSize: 'Tamaño de pantalla informado por el navegador', cssPixels: 'px CSS', estimatedDevicePixels: 'Dimensiones estimadas en píxeles del dispositivo', estimated: 'Estimado', devicePixels: 'px del dispositivo', viewport: 'Viewport del navegador', availableArea: 'Área de pantalla disponible', devicePixelRatio: 'Relación de píxeles del dispositivo', colorDepth: 'Profundidad de color', bits: 'bits', orientation: 'Orientación',
  },
  ru: {
    controlsHeading: 'Информация о разрешении экрана', browserReported: 'Значения, сообщаемые браузером', screenSize: 'Размер экрана по данным браузера', cssPixels: 'CSS px', estimatedDevicePixels: 'Оценочные размеры в пикселях устройства', estimated: 'Оценка', devicePixels: 'пикс. устройства', viewport: 'Область просмотра браузера', availableArea: 'Доступная область экрана', devicePixelRatio: 'Коэффициент пикселей устройства', colorDepth: 'Глубина цвета', bits: 'бит', orientation: 'Ориентация',
  },
} as const satisfies Record<Locale, ScreenResolutionRuntimeMessages>;

export const getScreenResolutionRuntimeMessages = (locale: Locale): ScreenResolutionRuntimeMessages =>
  messagesByLocale[locale];
