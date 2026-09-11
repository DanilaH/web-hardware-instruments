import type { Locale } from '../locales';

export interface PrinterRuntimeMessages {
  readonly controlsHeading: string;
  readonly paperSize: string;
  readonly profile: string;
  readonly a4: string;
  readonly letter: string;
  readonly full: string;
  readonly color: string;
  readonly grayscale: string;
  readonly printButton: string;
  readonly previewLabel: string;
  readonly actualSizeNote: string;
  readonly referenceTitle: string;
  readonly textSamples: string;
  readonly lineGrid: string;
  readonly alignmentMarks: string;
  readonly grayscaleScale: string;
  readonly colorPatches: string;
  readonly paperLabel: string;
  readonly profileLabel: string;
  readonly sampleLine: string;
}

const printerRuntimeByLocale = {
  en: {
    controlsHeading: 'Printer test controls',
    paperSize: 'Paper size',
    profile: 'Test profile',
    a4: 'A4 · 210 × 297 mm',
    letter: 'Letter · 8.5 × 11 in',
    full: 'Full',
    color: 'Color',
    grayscale: 'Grayscale',
    printButton: 'Print Test Page',
    previewLabel: 'Printer test page preview',
    actualSizeNote: 'For spacing and alignment checks, use portrait and 100% / Actual Size in print preview.',
    referenceTitle: 'Hardware Inspect · Printer Reference',
    textSamples: 'Fine text samples',
    lineGrid: 'Line and grid reference',
    alignmentMarks: 'Alignment marks',
    grayscaleScale: 'Grayscale reference',
    colorPatches: 'Color reference',
    paperLabel: 'Paper',
    profileLabel: 'Profile',
    sampleLine: 'The quick brown fox jumps over 1234567890 · ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  },
  'pt-BR': {
    controlsHeading: 'Controles do teste da impressora',
    paperSize: 'Tamanho do papel',
    profile: 'Perfil de teste',
    a4: 'A4 · 210 × 297 mm',
    letter: 'Letter · 8,5 × 11 pol',
    full: 'Completo',
    color: 'Cor',
    grayscale: 'Tons de cinza',
    printButton: 'Imprimir página de teste',
    previewLabel: 'Prévia da página de teste da impressora',
    actualSizeNote: 'Para verificar espaçamento e alinhamento, use retrato e 100% / Tamanho real na visualização de impressão.',
    referenceTitle: 'Hardware Inspect · Referência de impressão',
    textSamples: 'Amostras de texto fino',
    lineGrid: 'Referência de linhas e grade',
    alignmentMarks: 'Marcas de alinhamento',
    grayscaleScale: 'Referência em tons de cinza',
    colorPatches: 'Referência de cor',
    paperLabel: 'Papel',
    profileLabel: 'Perfil',
    sampleLine: 'Texto fino 1234567890 · ABCDEFGHIJKLMNOPQRSTUVWXYZ · abcdefghijklmnopqrstuvwxyz',
  },
  de: {
    controlsHeading: 'Steuerung der Drucker-Testseite',
    paperSize: 'Papierformat',
    profile: 'Testprofil',
    a4: 'A4 · 210 × 297 mm',
    letter: 'Letter · 8,5 × 11 in',
    full: 'Vollständig',
    color: 'Farbe',
    grayscale: 'Graustufen',
    printButton: 'Testseite drucken',
    previewLabel: 'Vorschau der Drucker-Testseite',
    actualSizeNote: 'Für Abstands- und Ausrichtungsprüfungen Hochformat und 100% / Tatsächliche Größe in der Druckvorschau verwenden.',
    referenceTitle: 'Hardware Inspect · Druckreferenz',
    textSamples: 'Feine Textmuster',
    lineGrid: 'Linien- und Rasterreferenz',
    alignmentMarks: 'Ausrichtungsmarken',
    grayscaleScale: 'Graustufenreferenz',
    colorPatches: 'Farbreferenz',
    paperLabel: 'Papier',
    profileLabel: 'Profil',
    sampleLine: 'Feiner Text 1234567890 · ABCDEFGHIJKLMNOPQRSTUVWXYZ · abcdefghijklmnopqrstuvwxyz',
  },
  fr: {
    controlsHeading: "Commandes du test d'imprimante",
    paperSize: 'Format du papier',
    profile: 'Profil de test',
    a4: 'A4 · 210 × 297 mm',
    letter: 'Letter · 8,5 × 11 po',
    full: 'Complet',
    color: 'Couleur',
    grayscale: 'Niveaux de gris',
    printButton: 'Imprimer la page de test',
    previewLabel: "Aperçu de la page de test de l'imprimante",
    actualSizeNote: "Pour vérifier les dimensions et l'alignement, utilisez le mode portrait et 100% / Taille réelle dans l'aperçu avant impression.",
    referenceTitle: "Hardware Inspect · Référence d'impression",
    textSamples: 'Échantillons de texte fin',
    lineGrid: 'Référence de lignes et grille',
    alignmentMarks: "Repères d'alignement",
    grayscaleScale: 'Référence en niveaux de gris',
    colorPatches: 'Référence couleur',
    paperLabel: 'Papier',
    profileLabel: 'Profil',
    sampleLine: 'Texte fin 1234567890 · ABCDEFGHIJKLMNOPQRSTUVWXYZ · abcdefghijklmnopqrstuvwxyz',
  },
  es: {
    controlsHeading: 'Controles de la prueba de impresora',
    paperSize: 'Tamaño de papel',
    profile: 'Perfil de prueba',
    a4: 'A4 · 210 × 297 mm',
    letter: 'Letter · 8,5 × 11 pulg',
    full: 'Completo',
    color: 'Color',
    grayscale: 'Escala de grises',
    printButton: 'Imprimir página de prueba',
    previewLabel: 'Vista previa de la página de prueba de impresora',
    actualSizeNote: 'Para comprobar medidas y alineación, usa orientación vertical y 100% / Tamaño real en la vista previa de impresión.',
    referenceTitle: 'Hardware Inspect · Referencia de impresión',
    textSamples: 'Muestras de texto fino',
    lineGrid: 'Referencia de líneas y cuadrícula',
    alignmentMarks: 'Marcas de alineación',
    grayscaleScale: 'Referencia de escala de grises',
    colorPatches: 'Referencia de color',
    paperLabel: 'Papel',
    profileLabel: 'Perfil',
    sampleLine: 'Texto fino 1234567890 · ABCDEFGHIJKLMNOPQRSTUVWXYZ · abcdefghijklmnopqrstuvwxyz',
  },
  ru: {
    controlsHeading: 'Настройки тестовой страницы принтера',
    paperSize: 'Размер бумаги',
    profile: 'Профиль теста',
    a4: 'A4 · 210 × 297 мм',
    letter: 'Letter · 8,5 × 11 дюймов',
    full: 'Полный',
    color: 'Цвет',
    grayscale: 'Градации серого',
    printButton: 'Распечатать тестовую страницу',
    previewLabel: 'Предпросмотр тестовой страницы принтера',
    actualSizeNote: 'Для проверки размеров и выравнивания используйте книжную ориентацию и 100% / Фактический размер в предпросмотре печати.',
    referenceTitle: 'Hardware Inspect · Эталон печати',
    textSamples: 'Образцы мелкого текста',
    lineGrid: 'Эталон линий и сетки',
    alignmentMarks: 'Метки выравнивания',
    grayscaleScale: 'Эталон градаций серого',
    colorPatches: 'Цветовой эталон',
    paperLabel: 'Бумага',
    profileLabel: 'Профиль',
    sampleLine: 'Мелкий текст 1234567890 · АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ · abcdefghijklmnopqrstuvwxyz',
  },
} as const satisfies Record<Locale, PrinterRuntimeMessages>;

export const getPrinterRuntimeMessages = (locale: Locale): PrinterRuntimeMessages => printerRuntimeByLocale[locale];
