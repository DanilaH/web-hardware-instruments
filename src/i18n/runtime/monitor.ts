import type { Locale } from '../locales';

export interface MonitorRuntimeMessages {
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

const monitorRuntimeByLocale = {
  en: {
    controlsHeading: 'Monitor test controls',
    visualInspection: 'Guided visual inspection',
    instruction: 'Inspect each static pattern for obvious screen differences. The test does not score or certify your display.',
    start: 'Start Monitor Test',
    sequenceAria: 'Monitor test pattern sequence',
    patterns: ['White', 'Black', 'Red', 'Green', 'Blue', '50% Gray', '5% Gray', 'Grayscale gradient', 'Color gradient', 'Black-level reference', 'White-level reference', 'Sharpness / grid reference'],
    stageAria: 'Monitor visual inspection pattern',
    nextHint: 'Click/tap, Space or → next · ← previous',
    previous: 'Previous',
    next: 'Next',
    hideControls: 'Hide controls',
    exit: 'Exit test',
    fullScreenUnavailable: 'Fullscreen is unavailable here. Continue with the large in-page pattern.',
  },
  'pt-BR': {
    controlsHeading: 'Controles do teste de monitor',
    visualInspection: 'Inspeção visual guiada',
    instruction: 'Observe cada padrão estático e procure diferenças visíveis na tela. O teste não dá nota nem certifica o monitor.',
    start: 'Iniciar Teste de Monitor',
    sequenceAria: 'Sequência de padrões do teste de monitor',
    patterns: ['Branco', 'Preto', 'Vermelho', 'Verde', 'Azul', 'Cinza 50%', 'Cinza 5%', 'Gradiente de cinza', 'Gradiente de cores', 'Referência de nível de preto', 'Referência de nível de branco', 'Referência de nitidez / grade'],
    stageAria: 'Padrão de inspeção visual do monitor',
    nextHint: 'Clique/toque, Espaço ou → avança · ← volta',
    previous: 'Anterior',
    next: 'Próximo',
    hideControls: 'Ocultar controles',
    exit: 'Sair do teste',
    fullScreenUnavailable: 'A tela cheia não está disponível aqui. Continue com o padrão grande na página.',
  },
  de: {
    controlsHeading: 'Steuerung des Monitor-Tests',
    visualInspection: 'Geführte Sichtprüfung',
    instruction: 'Prüfe jedes statische Muster auf deutlich sichtbare Unterschiede. Der Test bewertet oder zertifiziert das Display nicht.',
    start: 'Monitor-Test starten',
    sequenceAria: 'Musterfolge des Monitor-Tests',
    patterns: ['Weiß', 'Schwarz', 'Rot', 'Grün', 'Blau', '50 % Grau', '5 % Grau', 'Graustufenverlauf', 'Farbverlauf', 'Schwarzpegel-Referenz', 'Weißpegel-Referenz', 'Schärfe- / Rasterreferenz'],
    stageAria: 'Muster zur visuellen Monitorprüfung',
    nextHint: 'Klick/Tippen, Leertaste oder → weiter · ← zurück',
    previous: 'Zurück',
    next: 'Weiter',
    hideControls: 'Steuerung ausblenden',
    exit: 'Test beenden',
    fullScreenUnavailable: 'Vollbild ist hier nicht verfügbar. Nutze das große Muster direkt auf der Seite.',
  },
  fr: {
    controlsHeading: 'Commandes du test d’écran',
    visualInspection: 'Inspection visuelle guidée',
    instruction: 'Examinez chaque motif statique pour repérer des différences visibles. Le test ne note ni ne certifie l’écran.',
    start: 'Démarrer le test d’écran',
    sequenceAria: 'Séquence des motifs du test d’écran',
    patterns: ['Blanc', 'Noir', 'Rouge', 'Vert', 'Bleu', 'Gris 50 %', 'Gris 5 %', 'Dégradé de gris', 'Dégradé de couleurs', 'Référence de niveau de noir', 'Référence de niveau de blanc', 'Référence de netteté / grille'],
    stageAria: 'Motif d’inspection visuelle de l’écran',
    nextHint: 'Clic/toucher, Espace ou → suivant · ← précédent',
    previous: 'Précédent',
    next: 'Suivant',
    hideControls: 'Masquer les commandes',
    exit: 'Quitter le test',
    fullScreenUnavailable: 'Le plein écran n’est pas disponible ici. Continuez avec le grand motif dans la page.',
  },
  es: {
    controlsHeading: 'Controles de la prueba de monitor',
    visualInspection: 'Inspección visual guiada',
    instruction: 'Revisa cada patrón estático para detectar diferencias visibles en la pantalla. La prueba no puntúa ni certifica el monitor.',
    start: 'Iniciar Prueba de Monitor',
    sequenceAria: 'Secuencia de patrones de la prueba de monitor',
    patterns: ['Blanco', 'Negro', 'Rojo', 'Verde', 'Azul', 'Gris 50 %', 'Gris 5 %', 'Gradiente de grises', 'Gradiente de color', 'Referencia de nivel de negro', 'Referencia de nivel de blanco', 'Referencia de nitidez / cuadrícula'],
    stageAria: 'Patrón de inspección visual del monitor',
    nextHint: 'Clic/toque, Espacio o → siguiente · ← anterior',
    previous: 'Anterior',
    next: 'Siguiente',
    hideControls: 'Ocultar controles',
    exit: 'Salir de la prueba',
    fullScreenUnavailable: 'La pantalla completa no está disponible aquí. Continúa con el patrón grande dentro de la página.',
  },
  ru: {
    controlsHeading: 'Управление тестом монитора',
    visualInspection: 'Пошаговая визуальная проверка',
    instruction: 'Просматривайте статичные шаблоны и отмечайте заметные различия на экране. Тест не выставляет оценку и не сертифицирует дисплей.',
    start: 'Начать тест монитора',
    sequenceAria: 'Последовательность шаблонов теста монитора',
    patterns: ['Белый', 'Чёрный', 'Красный', 'Зелёный', 'Синий', 'Серый 50%', 'Серый 5%', 'Градиент серого', 'Цветовой градиент', 'Шкала уровня чёрного', 'Шкала уровня белого', 'Шаблон резкости / сетки'],
    stageAria: 'Шаблон визуальной проверки монитора',
    nextHint: 'Клик/касание, Пробел или → дальше · ← назад',
    previous: 'Назад',
    next: 'Дальше',
    hideControls: 'Скрыть управление',
    exit: 'Выйти из теста',
    fullScreenUnavailable: 'Полноэкранный режим здесь недоступен. Продолжайте с большим шаблоном на странице.',
  },
} as const satisfies Record<Locale, MonitorRuntimeMessages>;

export const getMonitorRuntimeMessages = (locale: Locale): MonitorRuntimeMessages => monitorRuntimeByLocale[locale];
