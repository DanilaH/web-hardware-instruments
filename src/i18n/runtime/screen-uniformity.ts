import type { Locale } from '../locales';

export interface ScreenUniformityRuntimeMessages {
  readonly controlsHeading: string;
  readonly visualInspection: string;
  readonly instruction: string;
  readonly start: string;
  readonly sequenceAria: string;
  readonly stageAria: string;
  readonly nextHint: string;
  readonly previous: string;
  readonly next: string;
  readonly hideControls: string;
  readonly exit: string;
  readonly fullScreenUnavailable: string;
  readonly patterns: readonly string[];
}

const screenUniformityRuntimeByLocale = {
  en: {
    controlsHeading: 'Screen uniformity test controls',
    visualInspection: 'Gray uniformity inspection',
    instruction: 'Compare several flat gray fields from your normal viewing position. Look for uneven brightness, tint, banding, clouding or DSE-like patches.',
    start: 'Start Uniformity Test',
    sequenceAria: 'Screen uniformity reference sequence',
    stageAria: 'Screen uniformity inspection stage',
    nextHint: 'Click/tap, Space or → for next · ← for previous',
    previous: 'Previous',
    next: 'Next',
    hideControls: 'Hide controls',
    exit: 'Exit test',
    fullScreenUnavailable: 'Fullscreen is unavailable here. Continue with the large pattern on the page.',
    patterns: ['5% Gray', '10% Gray', '25% Gray', '50% Gray', '75% Gray', '100% White'],
  },
  'pt-BR': {
    controlsHeading: 'Controles do teste de uniformidade da tela',
    visualInspection: 'Inspeção de uniformidade em cinza',
    instruction: 'Compare vários campos de cinza uniforme na sua posição normal de visualização. Procure brilho desigual, tonalidade, faixas, manchas ou áreas semelhantes a DSE.',
    start: 'Iniciar teste de uniformidade',
    sequenceAria: 'Sequência de referência de uniformidade da tela',
    stageAria: 'Área de inspeção de uniformidade da tela',
    nextHint: 'Clique/toque, Espaço ou → para avançar · ← para voltar',
    previous: 'Anterior',
    next: 'Próximo',
    hideControls: 'Ocultar controles',
    exit: 'Sair do teste',
    fullScreenUnavailable: 'A tela cheia não está disponível aqui. Continue com o padrão grande na página.',
    patterns: ['Cinza 5%', 'Cinza 10%', 'Cinza 25%', 'Cinza 50%', 'Cinza 75%', 'Branco 100%'],
  },
  de: {
    controlsHeading: 'Steuerung des Bildschirm-Gleichmäßigkeitstests',
    visualInspection: 'Grau-Gleichmäßigkeit prüfen',
    instruction: 'Vergleichen Sie mehrere gleichmäßige Grauflächen aus Ihrer normalen Betrachtungsposition. Achten Sie auf ungleichmäßige Helligkeit, Farbstich, Streifen, Wolken oder DSE-ähnliche Flecken.',
    start: 'Gleichmäßigkeitstest starten',
    sequenceAria: 'Referenzfolge für die Bildschirmgleichmäßigkeit',
    stageAria: 'Prüffläche für die Bildschirmgleichmäßigkeit',
    nextHint: 'Klick/Tippen, Leertaste oder → weiter · ← zurück',
    previous: 'Zurück',
    next: 'Weiter',
    hideControls: 'Steuerung ausblenden',
    exit: 'Test beenden',
    fullScreenUnavailable: 'Vollbild ist hier nicht verfügbar. Fahren Sie mit der großen Prüffläche auf der Seite fort.',
    patterns: ['5% Grau', '10% Grau', '25% Grau', '50% Grau', '75% Grau', '100% Weiß'],
  },
  fr: {
    controlsHeading: "Commandes du test d'uniformité de l'écran",
    visualInspection: "Inspection de l'uniformité des gris",
    instruction: "Comparez plusieurs aplats gris depuis votre position de visionnage habituelle. Recherchez des différences de luminosité, de teinte, des bandes, des zones nuageuses ou des taches de type DSE.",
    start: "Démarrer le test d'uniformité",
    sequenceAria: "Séquence de référence d'uniformité de l'écran",
    stageAria: "Zone d'inspection de l'uniformité de l'écran",
    nextHint: 'Clic/toucher, Espace ou → pour avancer · ← pour revenir',
    previous: 'Précédent',
    next: 'Suivant',
    hideControls: 'Masquer les commandes',
    exit: 'Quitter le test',
    fullScreenUnavailable: "Le plein écran n'est pas disponible ici. Continuez avec le grand motif affiché dans la page.",
    patterns: ['Gris 5%', 'Gris 10%', 'Gris 25%', 'Gris 50%', 'Gris 75%', 'Blanc 100%'],
  },
  es: {
    controlsHeading: 'Controles de la prueba de uniformidad de pantalla',
    visualInspection: 'Inspección de uniformidad de grises',
    instruction: 'Compara varios campos grises uniformes desde tu posición de visualización habitual. Busca brillo desigual, tintes, bandas, nubes o manchas similares al DSE.',
    start: 'Iniciar prueba de uniformidad',
    sequenceAria: 'Secuencia de referencia de uniformidad de pantalla',
    stageAria: 'Área de inspección de uniformidad de pantalla',
    nextHint: 'Clic/toque, Espacio o → para avanzar · ← para volver',
    previous: 'Anterior',
    next: 'Siguiente',
    hideControls: 'Ocultar controles',
    exit: 'Salir de la prueba',
    fullScreenUnavailable: 'La pantalla completa no está disponible aquí. Continúa con el patrón grande dentro de la página.',
    patterns: ['Gris 5%', 'Gris 10%', 'Gris 25%', 'Gris 50%', 'Gris 75%', 'Blanco 100%'],
  },
  ru: {
    controlsHeading: 'Управление тестом равномерности экрана',
    visualInspection: 'Проверка равномерности серого поля',
    instruction: 'Сравните несколько ровных серых полей из обычного положения просмотра. Ищите неравномерную яркость, оттенок, полосы, облачность или пятна, похожие на DSE.',
    start: 'Начать тест равномерности',
    sequenceAria: 'Последовательность эталонных полей равномерности экрана',
    stageAria: 'Область проверки равномерности экрана',
    nextHint: 'Клик/касание, Пробел или → — дальше · ← — назад',
    previous: 'Назад',
    next: 'Дальше',
    hideControls: 'Скрыть управление',
    exit: 'Выйти из теста',
    fullScreenUnavailable: 'Полноэкранный режим здесь недоступен. Продолжайте с большим полем на странице.',
    patterns: ['Серый 5%', 'Серый 10%', 'Серый 25%', 'Серый 50%', 'Серый 75%', 'Белый 100%'],
  },
} as const satisfies Record<Locale, ScreenUniformityRuntimeMessages>;

export const getScreenUniformityRuntimeMessages = (locale: Locale): ScreenUniformityRuntimeMessages =>
  screenUniformityRuntimeByLocale[locale];
