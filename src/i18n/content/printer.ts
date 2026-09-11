import type { Locale } from '../locales';
import type { HomeContent, ToolPageContent } from './types';

export interface PrinterLocaleContent {
  readonly category: string;
  readonly signal: string;
  readonly home: Pick<
    HomeContent,
    'facts' | 'boundaryAria' | 'boundaryLocal' | 'boundarySignals' | 'boundaryObserved' | 'boundaryNoUpload'
  >;
  readonly tool: ToolPageContent;
}

export const printerContentByLocale = {
  en: {
    category: 'Printer',
    signal: 'Print',
    home: {
      facts: '19 browser tools · no install · no account · local processing',
      boundaryAria: 'Hardware signals and locally rendered test patterns stay within the browser boundary',
      boundaryLocal: 'Local processing',
      boundarySignals: 'Browser APIs · local events · rendered test patterns',
      boundaryObserved: 'Observed · estimated · visual inspection',
      boundaryNoUpload: 'No raw diagnostic input upload',
    },
    tool: {
      name: 'Printer Test Page',
      shortDescription: 'Print a local color and grayscale reference page to visually check print quality.',
      seoTitle: 'Printer Test Page — Print a Color & Grayscale Test Online',
      metaDescription: 'Print a free printer test page with color patches, grayscale, fine lines, alignment marks and text to visually check print quality.',
      h1: 'Printer Test Page',
      intro: 'Generate a local A4 or Letter reference with text, fine lines, alignment marks, grayscale and color patterns, then inspect the printed result. Hardware Inspect does not read printer telemetry or upload documents.',
      sections: [
        {
          heading: 'How to use this printer test page',
          steps: [
            'Choose <strong>A4</strong> or <strong>Letter</strong> to match the paper loaded in your printer.',
            'Choose <strong>Full</strong>, <strong>Color</strong>, or <strong>Grayscale</strong> depending on what you want to inspect.',
            'Open print preview, keep portrait orientation, and use <strong>100% / Actual Size</strong> when checking physical spacing or alignment.',
          ],
        },
        {
          heading: 'What to inspect on the printed page',
          paragraphs: [
            'Look for missing color, visible banding, blurred or broken fine text, uneven density, jagged thin lines, or alignment marks that do not line up cleanly.',
            'The Full profile combines common line and alignment references with grayscale and color sections. Color and Grayscale profiles keep the shared references but focus the page on one output family.',
          ],
        },
        {
          heading: 'Browser and printer limitations',
          paragraphs: [
            'Browser, operating-system, driver, and printer color management can transform colors before they reach paper. This page is a visual reference, not certified color calibration or raw CMYK separation.',
            'Hardware Inspect generates the reference locally. It does not detect cartridges, nozzle state, printer telemetry, or a specific hardware fault, and no document is uploaded.',
          ],
        },
      ],
    },
  },
  'pt-BR': {
    category: 'Impressora',
    signal: 'Impressão',
    home: {
      facts: '19 ferramentas no navegador · sem instalação · sem conta · processamento local',
      boundaryAria: 'Sinais de hardware e padrões de teste renderizados localmente permanecem dentro do limite do navegador',
      boundaryLocal: 'Processamento local',
      boundarySignals: 'APIs do navegador · eventos locais · padrões de teste renderizados',
      boundaryObserved: 'Observado · estimado · inspeção visual',
      boundaryNoUpload: 'Sem envio de dados brutos de diagnóstico',
    },
    tool: {
      name: 'Página de teste da impressora',
      shortDescription: 'Imprima uma referência local em cores e tons de cinza para verificar visualmente a qualidade de impressão.',
      seoTitle: 'Página de teste da impressora — teste cores e tons de cinza',
      metaDescription: 'Imprima uma página de teste gratuita com cores, tons de cinza, linhas finas, marcas de alinhamento e texto para verificar visualmente a qualidade.',
      h1: 'Página de teste da impressora',
      intro: 'Gere localmente uma referência A4 ou Letter com texto, linhas finas, marcas de alinhamento, tons de cinza e padrões de cor e depois inspecione a impressão. O Hardware Inspect não lê telemetria da impressora nem envia documentos.',
      sections: [
        {
          heading: 'Como usar esta página de teste',
          steps: [
            'Escolha <strong>A4</strong> ou <strong>Letter</strong> de acordo com o papel colocado na impressora.',
            'Escolha <strong>Completo</strong>, <strong>Cor</strong> ou <strong>Tons de cinza</strong> conforme o que deseja inspecionar.',
            'Abra a visualização de impressão, mantenha a orientação retrato e use <strong>100% / Tamanho real</strong> ao verificar espaçamento físico ou alinhamento.',
          ],
        },
        {
          heading: 'O que observar na impressão',
          paragraphs: [
            'Procure cores ausentes, faixas visíveis, texto fino borrado ou interrompido, densidade irregular, linhas finas serrilhadas ou marcas de alinhamento que não coincidam corretamente.',
            'O perfil Completo reúne referências comuns de linhas e alinhamento com seções de tons de cinza e cores. Os perfis Cor e Tons de cinza mantêm as referências comuns e focam em uma família de saída.',
          ],
        },
        {
          heading: 'Limitações do navegador e da impressora',
          paragraphs: [
            'O gerenciamento de cores do navegador, sistema operacional, driver e impressora pode transformar as cores antes da impressão. Esta página é uma referência visual, não uma calibração certificada nem uma separação CMYK bruta.',
            'O Hardware Inspect gera a referência localmente. Ele não detecta cartuchos, estado dos bicos, telemetria da impressora nem uma falha específica de hardware, e nenhum documento é enviado.',
          ],
        },
      ],
    },
  },
  de: {
    category: 'Drucker',
    signal: 'Druck',
    home: {
      facts: '19 Browser-Werkzeuge · keine Installation · kein Konto · lokale Verarbeitung',
      boundaryAria: 'Hardwaresignale und lokal gerenderte Testmuster bleiben innerhalb der Browser-Grenze',
      boundaryLocal: 'Lokale Verarbeitung',
      boundarySignals: 'Browser-APIs · lokale Ereignisse · gerenderte Testmuster',
      boundaryObserved: 'Beobachtet · geschätzt · visuelle Prüfung',
      boundaryNoUpload: 'Keine Roh-Diagnosedaten werden hochgeladen',
    },
    tool: {
      name: 'Drucker-Testseite',
      shortDescription: 'Drucken Sie eine lokale Farb- und Graustufenreferenz zur visuellen Prüfung der Druckqualität.',
      seoTitle: 'Drucker-Testseite — Farbe & Graustufen online drucken',
      metaDescription: 'Drucken Sie kostenlos eine Testseite mit Farbfeldern, Graustufen, feinen Linien, Ausrichtungsmarken und Text zur visuellen Prüfung der Druckqualität.',
      h1: 'Drucker-Testseite',
      intro: 'Erzeugen Sie lokal eine A4- oder Letter-Referenz mit Text, feinen Linien, Ausrichtungsmarken, Graustufen und Farbmustern und prüfen Sie anschließend den Ausdruck. Hardware Inspect liest keine Druckertelemetrie und lädt keine Dokumente hoch.',
      sections: [
        {
          heading: 'So verwenden Sie die Drucker-Testseite',
          steps: [
            'Wählen Sie <strong>A4</strong> oder <strong>Letter</strong> passend zum eingelegten Papier.',
            'Wählen Sie <strong>Vollständig</strong>, <strong>Farbe</strong> oder <strong>Graustufen</strong>, je nachdem, was Sie prüfen möchten.',
            'Öffnen Sie die Druckvorschau, verwenden Sie Hochformat und wählen Sie <strong>100% / Tatsächliche Größe</strong>, wenn Sie Abstände oder Ausrichtung prüfen.',
          ],
        },
        {
          heading: 'Worauf Sie im Ausdruck achten sollten',
          paragraphs: [
            'Achten Sie auf fehlende Farben, sichtbare Streifen, unscharfen oder unterbrochenen feinen Text, ungleichmäßige Dichte, ausgefranste dünne Linien oder unsauber zusammenlaufende Ausrichtungsmarken.',
            'Das Profil Vollständig kombiniert gemeinsame Linien- und Ausrichtungsreferenzen mit Graustufen- und Farbbereichen. Farbe und Graustufen behalten die gemeinsamen Referenzen bei und konzentrieren sich auf eine Ausgabefamilie.',
          ],
        },
        {
          heading: 'Grenzen von Browser und Drucker',
          paragraphs: [
            'Farbmanagement von Browser, Betriebssystem, Treiber und Drucker kann Farben vor dem Druck verändern. Diese Seite ist eine visuelle Referenz, keine zertifizierte Farbkalibrierung und keine rohe CMYK-Separation.',
            'Hardware Inspect erzeugt die Referenz lokal. Es erkennt weder Patronen noch Düsenstatus oder Druckertelemetrie, diagnostiziert keinen bestimmten Hardwarefehler und lädt kein Dokument hoch.',
          ],
        },
      ],
    },
  },
  fr: {
    category: 'Imprimante',
    signal: 'Impression',
    home: {
      facts: '19 outils dans le navigateur · sans installation · sans compte · traitement local',
      boundaryAria: 'Les signaux matériels et les motifs de test rendus localement restent dans la frontière du navigateur',
      boundaryLocal: 'Traitement local',
      boundarySignals: 'API du navigateur · événements locaux · motifs de test rendus',
      boundaryObserved: 'Observé · estimé · inspection visuelle',
      boundaryNoUpload: 'Aucun envoi de données diagnostiques brutes',
    },
    tool: {
      name: 'Page de test imprimante',
      shortDescription: "Imprimez une référence locale couleur et niveaux de gris pour contrôler visuellement la qualité d'impression.",
      seoTitle: "Page de test imprimante — imprimer un test couleur et niveaux de gris",
      metaDescription: "Imprimez gratuitement une page de test avec couleurs, niveaux de gris, lignes fines, repères d'alignement et texte pour contrôler visuellement la qualité.",
      h1: 'Page de test imprimante',
      intro: "Générez localement une référence A4 ou Letter avec texte, lignes fines, repères d'alignement, niveaux de gris et motifs couleur, puis inspectez le résultat imprimé. Hardware Inspect ne lit aucune télémétrie de l'imprimante et n'envoie aucun document.",
      sections: [
        {
          heading: 'Comment utiliser cette page de test',
          steps: [
            "Choisissez <strong>A4</strong> ou <strong>Letter</strong> selon le papier chargé dans l'imprimante.",
            'Choisissez <strong>Complet</strong>, <strong>Couleur</strong> ou <strong>Niveaux de gris</strong> selon ce que vous voulez inspecter.',
            "Ouvrez l'aperçu avant impression, gardez l'orientation portrait et utilisez <strong>100% / Taille réelle</strong> pour contrôler les dimensions physiques ou l'alignement.",
          ],
        },
        {
          heading: "Ce qu'il faut observer sur la page imprimée",
          paragraphs: [
            "Recherchez les couleurs manquantes, les bandes visibles, le texte fin flou ou interrompu, une densité irrégulière, des lignes fines dentelées ou des repères d'alignement qui ne coïncident pas correctement.",
            'Le profil Complet réunit les références communes de lignes et d’alignement avec les sections niveaux de gris et couleur. Les profils Couleur et Niveaux de gris conservent les références communes tout en se concentrant sur une famille de sortie.',
          ],
        },
        {
          heading: "Limites du navigateur et de l'imprimante",
          paragraphs: [
            "La gestion des couleurs du navigateur, du système, du pilote et de l'imprimante peut transformer les couleurs avant impression. Cette page est une référence visuelle, pas une calibration certifiée ni une séparation CMJN brute.",
            "Hardware Inspect génère la référence localement. Il ne détecte ni cartouches, ni état des buses, ni télémétrie de l'imprimante, ne diagnostique pas une panne matérielle précise et n'envoie aucun document.",
          ],
        },
      ],
    },
  },
  es: {
    category: 'Impresora',
    signal: 'Impresión',
    home: {
      facts: '19 herramientas en el navegador · sin instalación · sin cuenta · procesamiento local',
      boundaryAria: 'Las señales de hardware y los patrones de prueba renderizados localmente permanecen dentro del límite del navegador',
      boundaryLocal: 'Procesamiento local',
      boundarySignals: 'API del navegador · eventos locales · patrones de prueba renderizados',
      boundaryObserved: 'Observado · estimado · inspección visual',
      boundaryNoUpload: 'No se suben datos de diagnóstico sin procesar',
    },
    tool: {
      name: 'Página de prueba de impresora',
      shortDescription: 'Imprime una referencia local en color y escala de grises para revisar visualmente la calidad de impresión.',
      seoTitle: 'Página de prueba de impresora — prueba color y escala de grises',
      metaDescription: 'Imprime gratis una página de prueba con parches de color, escala de grises, líneas finas, marcas de alineación y texto para revisar visualmente la calidad.',
      h1: 'Página de prueba de impresora',
      intro: 'Genera localmente una referencia A4 o Letter con texto, líneas finas, marcas de alineación, escala de grises y patrones de color y después inspecciona el resultado impreso. Hardware Inspect no lee telemetría de la impresora ni sube documentos.',
      sections: [
        {
          heading: 'Cómo usar esta página de prueba',
          steps: [
            'Elige <strong>A4</strong> o <strong>Letter</strong> según el papel cargado en la impresora.',
            'Elige <strong>Completo</strong>, <strong>Color</strong> o <strong>Escala de grises</strong> según lo que quieras revisar.',
            'Abre la vista previa de impresión, mantén la orientación vertical y usa <strong>100% / Tamaño real</strong> al comprobar medidas físicas o alineación.',
          ],
        },
        {
          heading: 'Qué revisar en la página impresa',
          paragraphs: [
            'Busca colores ausentes, bandas visibles, texto fino borroso o cortado, densidad desigual, líneas finas irregulares o marcas de alineación que no coincidan correctamente.',
            'El perfil Completo combina referencias comunes de líneas y alineación con secciones de escala de grises y color. Color y Escala de grises mantienen las referencias comunes y se centran en una familia de salida.',
          ],
        },
        {
          heading: 'Limitaciones del navegador y la impresora',
          paragraphs: [
            'La gestión de color del navegador, sistema operativo, controlador e impresora puede transformar los colores antes de imprimir. Esta página es una referencia visual, no una calibración certificada ni una separación CMYK sin procesar.',
            'Hardware Inspect genera la referencia localmente. No detecta cartuchos, estado de boquillas ni telemetría de la impresora, no diagnostica un fallo concreto de hardware y no sube ningún documento.',
          ],
        },
      ],
    },
  },
  ru: {
    category: 'Принтер',
    signal: 'Печать',
    home: {
      facts: '19 инструментов в браузере · без установки · без аккаунта · локальная обработка',
      boundaryAria: 'Аппаратные сигналы и локально отрисованные тестовые шаблоны остаются внутри границы браузера',
      boundaryLocal: 'Локальная обработка',
      boundarySignals: 'API браузера · локальные события · отрисованные тестовые шаблоны',
      boundaryObserved: 'Наблюдение · оценка · визуальная проверка',
      boundaryNoUpload: 'Без отправки исходных диагностических данных',
    },
    tool: {
      name: 'Тестовая страница принтера',
      shortDescription: 'Распечатайте локальный цветной и серый эталон, чтобы визуально проверить качество печати.',
      seoTitle: 'Тестовая страница принтера — цвет и градации серого онлайн',
      metaDescription: 'Распечатайте бесплатную тестовую страницу с цветами, градациями серого, тонкими линиями, метками выравнивания и текстом для визуальной проверки печати.',
      h1: 'Тестовая страница принтера',
      intro: 'Сформируйте локальный эталон A4 или Letter с текстом, тонкими линиями, метками выравнивания, градациями серого и цветными шаблонами, затем осмотрите распечатку. Hardware Inspect не читает телеметрию принтера и не загружает документы.',
      sections: [
        {
          heading: 'Как пользоваться тестовой страницей',
          steps: [
            'Выберите <strong>A4</strong> или <strong>Letter</strong> в соответствии с бумагой, загруженной в принтер.',
            'Выберите <strong>Полный</strong>, <strong>Цвет</strong> или <strong>Градации серого</strong> в зависимости от того, что хотите проверить.',
            'Откройте предпросмотр печати, оставьте книжную ориентацию и используйте <strong>100% / Фактический размер</strong> при проверке физических размеров или выравнивания.',
          ],
        },
        {
          heading: 'Что искать на распечатке',
          paragraphs: [
            'Обратите внимание на пропавшие цвета, заметные полосы, размытый или прерывающийся мелкий текст, неравномерную плотность, неровные тонкие линии и несовпадающие метки выравнивания.',
            'Полный профиль объединяет общие линии и метки выравнивания с блоками градаций серого и цвета. Профили Цвет и Градации серого сохраняют общие эталоны, но фокусируются на одном типе вывода.',
          ],
        },
        {
          heading: 'Ограничения браузера и принтера',
          paragraphs: [
            'Управление цветом в браузере, операционной системе, драйвере и принтере может изменить цвета до печати. Эта страница — визуальный эталон, а не сертифицированная калибровка цвета и не прямая проверка CMYK-каналов.',
            'Hardware Inspect формирует эталон локально. Он не определяет состояние картриджей или сопел, не читает телеметрию принтера, не ставит диагноз конкретной неисправности и не загружает документы.',
          ],
        },
      ],
    },
  },
} as const satisfies Record<Locale, PrinterLocaleContent>;
