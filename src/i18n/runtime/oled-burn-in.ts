import type { Locale } from '../locales';

export interface OledBurnInRuntimeMessages {
  readonly controlsHeading: string;
  readonly visualInspection: string;
  readonly instruction: string;
  readonly start: string;
  readonly sequenceAria: string;
  readonly patterns: readonly string[];
  readonly stageAria: string;
  readonly nextHint: string;
  readonly previous: string;
  readonly next: string;
  readonly hideControls: string;
  readonly exit: string;
  readonly fullScreenUnavailable: string;
}

const oledBurnInRuntimeByLocale = {
  en: {
    controlsHeading: 'OLED burn-in test controls',
    visualInspection: 'Manual image-retention inspection',
    instruction: 'Compare several solid and gray fields for persistent shapes. This visual test cannot tell whether an artifact is permanent burn-in, temporary retention, or another uniformity issue.',
    start: 'Start OLED Burn-In Test',
    sequenceAria: 'OLED burn-in test pattern sequence',
    patterns: ['Red', 'Green', 'Blue', 'White', '50% Gray', '25% Gray', '75% Gray', 'Black'],
    stageAria: 'OLED burn-in visual inspection pattern',
    nextHint: 'Click/tap, Space or → next · ← previous',
    previous: 'Previous',
    next: 'Next',
    hideControls: 'Hide controls',
    exit: 'Exit test',
    fullScreenUnavailable: 'Fullscreen is unavailable here. Continue with the large in-page pattern.',
  },
  'pt-BR': {
    controlsHeading: 'Controles do teste de burn-in OLED',
    visualInspection: 'Inspeção manual de retenção de imagem',
    instruction: 'Compare vários campos sólidos e cinza em busca de formas persistentes. Este teste visual não determina se um artefato é burn-in permanente, retenção temporária ou outro problema de uniformidade.',
    start: 'Iniciar Teste de Burn-In OLED',
    sequenceAria: 'Sequência de padrões do teste de burn-in OLED',
    patterns: ['Vermelho', 'Verde', 'Azul', 'Branco', 'Cinza 50%', 'Cinza 25%', 'Cinza 75%', 'Preto'],
    stageAria: 'Padrão de inspeção visual de burn-in OLED',
    nextHint: 'Clique/toque, Espaço ou → avança · ← volta',
    previous: 'Anterior',
    next: 'Próximo',
    hideControls: 'Ocultar controles',
    exit: 'Sair do teste',
    fullScreenUnavailable: 'A tela cheia não está disponível aqui. Continue com o padrão grande na página.',
  },
  de: {
    controlsHeading: 'Steuerung des OLED-Burn-in-Tests',
    visualInspection: 'Manuelle Prüfung auf Bildretention',
    instruction: 'Vergleiche mehrere Vollfarben und Graufelder auf bleibende Formen. Dieser visuelle Test kann nicht bestimmen, ob ein Artefakt dauerhaftes Burn-in, vorübergehende Bildretention oder eine andere Gleichmäßigkeitsabweichung ist.',
    start: 'OLED-Burn-in-Test starten',
    sequenceAria: 'Musterfolge des OLED-Burn-in-Tests',
    patterns: ['Rot', 'Grün', 'Blau', 'Weiß', '50 % Grau', '25 % Grau', '75 % Grau', 'Schwarz'],
    stageAria: 'Muster zur visuellen OLED-Burn-in-Prüfung',
    nextHint: 'Klick/Tippen, Leertaste oder → weiter · ← zurück',
    previous: 'Zurück',
    next: 'Weiter',
    hideControls: 'Steuerung ausblenden',
    exit: 'Test beenden',
    fullScreenUnavailable: 'Vollbild ist hier nicht verfügbar. Nutze das große Muster direkt auf der Seite.',
  },
  fr: {
    controlsHeading: 'Commandes du test de burn-in OLED',
    visualInspection: 'Inspection manuelle de la rétention d’image',
    instruction: 'Comparez plusieurs aplats et champs gris pour repérer des formes persistantes. Ce test visuel ne peut pas déterminer s’il s’agit d’un burn-in permanent, d’une rétention temporaire ou d’un autre problème d’uniformité.',
    start: 'Démarrer le test de burn-in OLED',
    sequenceAria: 'Séquence des motifs du test de burn-in OLED',
    patterns: ['Rouge', 'Vert', 'Bleu', 'Blanc', 'Gris 50 %', 'Gris 25 %', 'Gris 75 %', 'Noir'],
    stageAria: 'Motif d’inspection visuelle du burn-in OLED',
    nextHint: 'Clic/toucher, Espace ou → suivant · ← précédent',
    previous: 'Précédent',
    next: 'Suivant',
    hideControls: 'Masquer les commandes',
    exit: 'Quitter le test',
    fullScreenUnavailable: 'Le plein écran n’est pas disponible ici. Continuez avec le grand motif dans la page.',
  },
  es: {
    controlsHeading: 'Controles de la prueba de burn-in OLED',
    visualInspection: 'Inspección manual de retención de imagen',
    instruction: 'Compara varios campos sólidos y grises para detectar formas persistentes. Esta prueba visual no puede determinar si un artefacto es burn-in permanente, retención temporal u otro problema de uniformidad.',
    start: 'Iniciar Prueba de Burn-In OLED',
    sequenceAria: 'Secuencia de patrones de la prueba de burn-in OLED',
    patterns: ['Rojo', 'Verde', 'Azul', 'Blanco', 'Gris 50%', 'Gris 25%', 'Gris 75%', 'Negro'],
    stageAria: 'Patrón de inspección visual de burn-in OLED',
    nextHint: 'Clic/toque, Espacio o → siguiente · ← anterior',
    previous: 'Anterior',
    next: 'Siguiente',
    hideControls: 'Ocultar controles',
    exit: 'Salir de la prueba',
    fullScreenUnavailable: 'La pantalla completa no está disponible aquí. Continúa con el patrón grande dentro de la página.',
  },
  ru: {
    controlsHeading: 'Управление тестом OLED на выгорание',
    visualInspection: 'Ручная проверка остаточного изображения',
    instruction: 'Сравните несколько сплошных и серых полей и ищите устойчивые контуры. Этот визуальный тест не определяет, является ли артефакт постоянным выгоранием, временным остаточным изображением или другой неравномерностью панели.',
    start: 'Начать тест OLED на выгорание',
    sequenceAria: 'Последовательность шаблонов теста OLED на выгорание',
    patterns: ['Красный', 'Зелёный', 'Синий', 'Белый', 'Серый 50%', 'Серый 25%', 'Серый 75%', 'Чёрный'],
    stageAria: 'Шаблон визуальной проверки OLED на выгорание',
    nextHint: 'Клик/касание, Пробел или → дальше · ← назад',
    previous: 'Назад',
    next: 'Дальше',
    hideControls: 'Скрыть управление',
    exit: 'Выйти из теста',
    fullScreenUnavailable: 'Полноэкранный режим здесь недоступен. Продолжайте с большим шаблоном на странице.',
  },
} as const satisfies Record<Locale, OledBurnInRuntimeMessages>;

export const getOledBurnInRuntimeMessages = (locale: Locale): OledBurnInRuntimeMessages => oledBurnInRuntimeByLocale[locale];
