import type { Locale } from '../locales';
import type { HomeContent, ToolPageContent } from './types';

interface ScreenResolutionContentBundle {
  readonly home: Pick<HomeContent, 'facts'>;
  readonly tool: ToolPageContent;
}

export const screenResolutionContentByLocale = {
  en: {
    home: { facts: '23 browser tools · no install · no account · local processing' },
    tool: {
      name: 'Screen Resolution Checker',
      shortDescription: 'See the screen size, viewport, DPR and estimated device-pixel dimensions reported by your browser.',
      seoTitle: 'Screen Resolution Checker — What Is My Screen Resolution?',
      metaDescription: 'See the screen size, browser viewport, device pixel ratio and estimated device-pixel dimensions reported by your browser.',
      h1: 'Screen Resolution Checker',
      intro: 'See the screen and viewport values your browser reports right now, including an explicitly estimated device-pixel size.',
      sections: [
        { heading: 'What the browser reports', paragraphs: ['The checker reads <strong>screen.width/height</strong>, available screen area, browser viewport, device pixel ratio, color depth and orientation when the browser exposes it. Values update when the viewport or orientation changes.'] },
        { heading: 'Estimated device-pixel dimensions', paragraphs: ['The estimate is calculated as <strong>Math.round(CSS pixels × devicePixelRatio)</strong> for width and height. It is labelled Estimated because it is derived from browser-reported CSS size and DPR rather than read from display hardware.'] },
        { heading: 'Why this may differ from native panel resolution', paragraphs: ['Browser zoom, operating-system scaling, browser behavior and privacy protections can affect reported values. This page does not request multi-screen permissions and does not claim the exact native or physical resolution of your monitor.'] },
      ],
    },
  },
  'pt-BR': {
    home: { facts: '23 testes no navegador · sem instalação · sem conta · processamento local' },
    tool: {
      name: 'Resolução da Tela',
      shortDescription: 'Veja tamanho da tela, viewport, DPR e dimensões estimadas em pixels do dispositivo informados pelo navegador.',
      seoTitle: 'Resolução da Tela — Verifique a Resolução do Navegador',
      metaDescription: 'Veja tamanho da tela, viewport do navegador, proporção de pixels e dimensões estimadas em pixels do dispositivo.',
      h1: 'Resolução da Tela',
      intro: 'Veja agora os valores de tela e viewport informados pelo navegador, incluindo uma estimativa claramente identificada em pixels do dispositivo.',
      sections: [
        { heading: 'O que o navegador informa', paragraphs: ['A ferramenta lê <strong>screen.width/height</strong>, área disponível, viewport, proporção de pixels do dispositivo, profundidade de cor e orientação quando disponível. Os valores são atualizados ao redimensionar ou mudar a orientação.'] },
        { heading: 'Dimensões estimadas em pixels do dispositivo', paragraphs: ['A estimativa usa <strong>Math.round(pixels CSS × devicePixelRatio)</strong> para largura e altura. Ela é marcada como estimada porque deriva do tamanho CSS e do DPR informados pelo navegador, não do hardware da tela.'] },
        { heading: 'Por que pode diferir da resolução nativa', paragraphs: ['Zoom do navegador, escala do sistema operacional, comportamento do navegador e proteções de privacidade podem alterar os valores. A página não pede permissão de múltiplas telas e não afirma a resolução física ou nativa exata do monitor.'] },
      ],
    },
  },
  de: {
    home: { facts: '23 Browser-Tests · keine Installation · kein Konto · lokale Verarbeitung' },
    tool: {
      name: 'Bildschirmauflösung prüfen',
      shortDescription: 'Zeigt Bildschirmgröße, Browser-Viewport, DPR und geschätzte Gerätepixel-Abmessungen.',
      seoTitle: 'Bildschirmauflösung prüfen — Browser-Werte anzeigen',
      metaDescription: 'Zeige Bildschirmgröße, Browser-Viewport, Device Pixel Ratio und geschätzte Gerätepixel-Abmessungen aus dem Browser.',
      h1: 'Bildschirmauflösung prüfen',
      intro: 'Sieh die aktuell vom Browser gemeldeten Bildschirm- und Viewport-Werte einschließlich einer klar gekennzeichneten Gerätepixel-Schätzung.',
      sections: [
        { heading: 'Was der Browser meldet', paragraphs: ['Der Checker liest <strong>screen.width/height</strong>, verfügbaren Bildschirmbereich, Browser-Viewport, Device Pixel Ratio, Farbtiefe und – sofern verfügbar – die Ausrichtung. Bei Größen- oder Ausrichtungsänderungen werden die Werte aktualisiert.'] },
        { heading: 'Geschätzte Gerätepixel-Abmessungen', paragraphs: ['Die Schätzung verwendet <strong>Math.round(CSS-Pixel × devicePixelRatio)</strong> für Breite und Höhe. Sie bleibt als Schätzung gekennzeichnet, weil sie aus Browserwerten berechnet und nicht aus der Display-Hardware gelesen wird.'] },
        { heading: 'Warum dies von der nativen Panelauflösung abweichen kann', paragraphs: ['Browser-Zoom, Betriebssystem-Skalierung, Browser-Verhalten und Datenschutzfunktionen können die gemeldeten Werte beeinflussen. Diese Seite fordert keine Multi-Screen-Berechtigung an und behauptet nicht, die exakte native oder physische Monitorauflösung zu kennen.'] },
      ],
    },
  },
  fr: {
    home: { facts: '23 tests navigateur · sans installation · sans compte · traitement local' },
    tool: {
      name: "Résolution de l’écran",
      shortDescription: 'Affiche la taille d’écran, le viewport, le DPR et les dimensions estimées en pixels appareil rapportés par le navigateur.',
      seoTitle: "Résolution de l’écran — Vérifier les valeurs du navigateur",
      metaDescription: 'Affichez la taille d’écran, le viewport, le ratio de pixels et les dimensions estimées en pixels appareil rapportés par le navigateur.',
      h1: "Résolution de l’écran",
      intro: 'Consultez immédiatement les valeurs d’écran et de viewport rapportées par le navigateur, avec une estimation en pixels appareil clairement identifiée.',
      sections: [
        { heading: 'Ce que rapporte le navigateur', paragraphs: ['Le vérificateur lit <strong>screen.width/height</strong>, la zone disponible, le viewport, le ratio de pixels appareil, la profondeur de couleur et l’orientation lorsqu’elle est disponible. Les valeurs sont recalculées au redimensionnement ou au changement d’orientation.'] },
        { heading: 'Dimensions estimées en pixels appareil', paragraphs: ['L’estimation applique <strong>Math.round(pixels CSS × devicePixelRatio)</strong> à la largeur et à la hauteur. Elle reste marquée comme estimation car elle dérive de valeurs du navigateur et non du matériel de l’écran.'] },
        { heading: 'Pourquoi cela peut différer de la résolution native', paragraphs: ['Le zoom, la mise à l’échelle du système, le comportement du navigateur et les protections de confidentialité peuvent modifier les valeurs. Cette page ne demande aucune permission multi-écran et ne prétend pas connaître la résolution physique ou native exacte du moniteur.'] },
      ],
    },
  },
  es: {
    home: { facts: '23 pruebas en el navegador · sin instalación · sin cuenta · procesamiento local' },
    tool: {
      name: 'Resolución de Pantalla',
      shortDescription: 'Muestra tamaño de pantalla, viewport, DPR y dimensiones estimadas en píxeles del dispositivo informadas por el navegador.',
      seoTitle: 'Resolución de Pantalla — Comprueba los Valores del Navegador',
      metaDescription: 'Consulta tamaño de pantalla, viewport, relación de píxeles y dimensiones estimadas en píxeles del dispositivo informadas por tu navegador.',
      h1: 'Resolución de Pantalla',
      intro: 'Consulta al instante los valores de pantalla y viewport informados por el navegador, incluida una estimación claramente indicada en píxeles del dispositivo.',
      sections: [
        { heading: 'Qué informa el navegador', paragraphs: ['La herramienta lee <strong>screen.width/height</strong>, área disponible, viewport, relación de píxeles del dispositivo, profundidad de color y orientación cuando está disponible. Los valores se actualizan al redimensionar o cambiar la orientación.'] },
        { heading: 'Dimensiones estimadas en píxeles del dispositivo', paragraphs: ['La estimación usa <strong>Math.round(píxeles CSS × devicePixelRatio)</strong> para ancho y alto. Se muestra como estimada porque deriva del tamaño CSS y DPR del navegador, no del hardware de la pantalla.'] },
        { heading: 'Por qué puede diferir de la resolución nativa', paragraphs: ['El zoom, el escalado del sistema operativo, el comportamiento del navegador y las protecciones de privacidad pueden cambiar los valores. La página no solicita permiso de múltiples pantallas ni afirma conocer la resolución física o nativa exacta del monitor.'] },
      ],
    },
  },
  ru: {
    home: { facts: '23 браузерных теста · без установки · без аккаунта · локальная обработка' },
    tool: {
      name: 'Разрешение экрана',
      shortDescription: 'Показывает размер экрана, viewport, DPR и оценочные размеры в пикселях устройства по данным браузера.',
      seoTitle: 'Разрешение экрана — Проверка данных браузера',
      metaDescription: 'Посмотрите размер экрана, область просмотра, коэффициент пикселей и оценочные размеры в пикселях устройства по данным браузера.',
      h1: 'Разрешение экрана',
      intro: 'Сразу посмотрите значения экрана и области просмотра, которые сообщает браузер, включая явно помеченную оценку размеров в пикселях устройства.',
      sections: [
        { heading: 'Что сообщает браузер', paragraphs: ['Инструмент читает <strong>screen.width/height</strong>, доступную область экрана, viewport браузера, коэффициент пикселей устройства, глубину цвета и ориентацию, если она доступна. Значения обновляются при изменении размера окна и ориентации.'] },
        { heading: 'Оценочные размеры в пикселях устройства', paragraphs: ['Оценка вычисляется как <strong>Math.round(CSS-пиксели × devicePixelRatio)</strong> отдельно для ширины и высоты. Она помечена как оценка, потому что рассчитывается из данных браузера, а не считывается с аппаратной части дисплея.'] },
        { heading: 'Почему это может отличаться от нативного разрешения', paragraphs: ['Масштаб браузера, системное масштабирование, особенности браузера и механизмы приватности могут влиять на значения. Страница не запрашивает доступ к нескольким экранам и не заявляет точное физическое или нативное разрешение монитора.'] },
      ],
    },
  },
} as const satisfies Record<Locale, ScreenResolutionContentBundle>;
