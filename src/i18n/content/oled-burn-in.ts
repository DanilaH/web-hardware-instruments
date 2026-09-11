import type { Locale } from '../locales';
import type { HomeContent, ToolPageContent } from './types';

interface OledBurnInContentBundle {
  readonly home: Pick<HomeContent, 'facts'>;
  readonly tool: ToolPageContent;
}

export const oledBurnInContentByLocale = {
  en: {
    home: { facts: '22 browser tools · no install · no account · local processing' },
    tool: {
      name: 'OLED Burn-In Test',
      shortDescription: 'Use solid colors and gray fields to visually check for persistent image shapes or image retention.',
      seoTitle: 'OLED Burn-In Test — Check Screen Burn-In & Image Retention',
      metaDescription: 'Use fullscreen solid colors and gray fields to visually check for persistent image shapes, screen burn-in and image retention on OLED displays.',
      h1: 'OLED Burn-In Test',
      intro: 'Compare controlled solid colors and gray fields to make persistent image shapes or temporary retention easier to notice by eye.',
      sections: [
        {
          heading: 'How to run the OLED burn-in test',
          steps: [
            'Select <strong>Start OLED Burn-In Test</strong>. Fullscreen is used when available; otherwise the same patterns remain large inside the page.',
            'Move through every solid and gray field manually. Look for the same outline, logo, bar, keyboard shape, or other image residue across several different fields.',
            'Hide the controls when they cover an area you want to inspect. Compare anything suspicious with normal content before drawing a conclusion.',
          ],
        },
        {
          heading: 'Burn-in, retention and panel uniformity',
          paragraphs: [
            'Persistent shapes visible across several neutral or solid fields may be worth investigating. A similar-looking artifact can also come from temporary image retention, panel non-uniformity, tint or mura.',
            'OLED burn-in is generally used for permanent differential aging, while image retention can be temporary. A browser pattern cannot establish which cause is present or whether an artifact is permanent.',
          ],
        },
        {
          heading: 'What this test does not do',
          paragraphs: [
            'This is an inspection tool, not a repair or pixel-fixer routine. It does not flash the panel, run long high-brightness cycles, calculate a burn-in percentage, or certify display health.',
            'Gray percentage labels are encoded sRGB reference values, not measured physical panel luminance. If a persistent artifact matters for use or warranty decisions, confirm it with real content and the display manufacturer’s guidance.',
          ],
        },
      ],
    },
  },
  'pt-BR': {
    home: { facts: '22 testes no navegador · sem instalação · sem conta · processamento local' },
    tool: {
      name: 'Teste de Burn-In OLED',
      shortDescription: 'Use cores sólidas e campos cinza para verificar visualmente formas persistentes ou retenção de imagem.',
      seoTitle: 'Teste de Burn-In OLED — Verifique Burn-In e Retenção de Imagem',
      metaDescription: 'Use cores sólidas e campos cinza em tela cheia para verificar visualmente formas persistentes, burn-in e retenção de imagem em telas OLED.',
      h1: 'Teste de Burn-In OLED',
      intro: 'Compare cores sólidas controladas e campos cinza para facilitar a percepção visual de formas persistentes ou retenção temporária.',
      sections: [
        { heading: 'Como fazer o teste de burn-in OLED', steps: ['Selecione <strong>Iniciar Teste de Burn-In OLED</strong>. A tela cheia é usada quando disponível; caso contrário, os mesmos padrões permanecem grandes na página.', 'Passe manualmente por todos os campos sólidos e cinza. Procure o mesmo contorno, logotipo, barra, teclado ou outro resíduo de imagem em vários campos diferentes.', 'Oculte os controles se cobrirem uma área que você quer observar. Compare qualquer sinal suspeito com conteúdo normal antes de tirar conclusões.'] },
        { heading: 'Burn-in, retenção e uniformidade do painel', paragraphs: ['Formas persistentes visíveis em vários campos neutros ou sólidos podem merecer investigação. Um artefato parecido também pode vir de retenção temporária, não uniformidade do painel, variação de tonalidade ou mura.', 'Burn-in OLED normalmente descreve envelhecimento diferencial permanente, enquanto a retenção de imagem pode ser temporária. Um padrão no navegador não determina qual causa está presente nem se o artefato é permanente.'] },
        { heading: 'O que este teste não faz', paragraphs: ['Esta é uma ferramenta de inspeção, não um modo de reparo ou pixel fixer. Ela não pisca o painel, não executa ciclos longos de alta luminosidade, não calcula porcentagem de burn-in e não certifica a saúde da tela.', 'Os percentuais de cinza são valores de referência sRGB codificados, não medições da luminância física do painel. Se um artefato persistente afetar o uso ou uma decisão de garantia, confirme com conteúdo real e as orientações do fabricante.'] },
      ],
    },
  },
  de: {
    home: { facts: '22 Browser-Tests · keine Installation · kein Konto · lokale Verarbeitung' },
    tool: {
      name: 'OLED-Burn-in-Test',
      shortDescription: 'Prüfe mit Vollfarben und Graufeldern visuell auf bleibende Bildformen oder Bildretention.',
      seoTitle: 'OLED-Burn-in-Test — Burn-in & Bildretention prüfen',
      metaDescription: 'Prüfe mit Vollfarben und Graufeldern im Vollbild visuell auf bleibende Bildformen, OLED-Burn-in und Bildretention.',
      h1: 'OLED-Burn-in-Test',
      intro: 'Vergleiche kontrollierte Vollfarben und Graufelder, damit bleibende Bildformen oder vorübergehende Retention leichter auffallen.',
      sections: [
        { heading: 'So führst du den OLED-Burn-in-Test aus', steps: ['Wähle <strong>OLED-Burn-in-Test starten</strong>. Wenn möglich, wird Vollbild verwendet; sonst bleiben dieselben Muster groß auf der Seite.', 'Gehe manuell durch alle Vollfarben und Graufelder. Achte auf dieselbe Kontur, ein Logo, eine Leiste, Tastaturform oder andere Bildreste über mehrere unterschiedliche Felder hinweg.', 'Blende die Steuerung aus, wenn sie einen Prüfbereich verdeckt. Vergleiche Auffälligkeiten mit normalen Inhalten, bevor du Schlüsse ziehst.'] },
        { heading: 'Burn-in, Bildretention und Panel-Gleichmäßigkeit', paragraphs: ['Bleibende Formen, die auf mehreren neutralen oder einfarbigen Feldern sichtbar sind, können eine nähere Prüfung wert sein. Ähnliche Artefakte können auch durch vorübergehende Bildretention, ungleichmäßige Paneldarstellung, Farbstiche oder Mura entstehen.', 'OLED-Burn-in bezeichnet üblicherweise dauerhafte unterschiedliche Alterung, während Bildretention vorübergehend sein kann. Ein Browsermuster kann weder die Ursache noch die Dauerhaftigkeit sicher bestimmen.'] },
        { heading: 'Was dieser Test nicht macht', paragraphs: ['Dies ist eine Sichtprüfung, kein Reparatur- oder Pixel-Fixer-Modus. Der Test lässt das Panel nicht blinken, führt keine langen Hochhelligkeitszyklen aus, berechnet keinen Burn-in-Prozentsatz und zertifiziert nicht den Displayzustand.', 'Grauprozentangaben sind kodierte sRGB-Referenzwerte und keine Messung der physikalischen Panel-Leuchtdichte. Wenn ein bleibendes Artefakt für Nutzung oder Garantie relevant ist, bestätige es mit realen Inhalten und den Herstellerhinweisen.'] },
      ],
    },
  },
  fr: {
    home: { facts: '22 tests navigateur · sans installation · sans compte · traitement local' },
    tool: {
      name: 'Test de Burn-In OLED',
      shortDescription: 'Utilisez des couleurs unies et des champs gris pour repérer visuellement des formes persistantes ou une rétention d’image.',
      seoTitle: 'Test de Burn-In OLED — Vérifier Burn-In et Rétention d’Image',
      metaDescription: 'Utilisez des couleurs unies et champs gris en plein écran pour inspecter visuellement le burn-in OLED, les formes persistantes et la rétention d’image.',
      h1: 'Test de Burn-In OLED',
      intro: 'Comparez des couleurs unies contrôlées et des champs gris pour rendre plus visibles les formes persistantes ou la rétention temporaire.',
      sections: [
        { heading: 'Comment lancer le test de burn-in OLED', steps: ['Sélectionnez <strong>Démarrer le test de burn-in OLED</strong>. Le plein écran est utilisé s’il est disponible ; sinon les mêmes motifs restent grands dans la page.', 'Parcourez manuellement tous les aplats et champs gris. Cherchez le même contour, logo, barre, forme de clavier ou autre résidu sur plusieurs champs différents.', 'Masquez les commandes si elles couvrent une zone à inspecter. Comparez toute anomalie suspecte avec du contenu normal avant de conclure.'] },
        { heading: 'Burn-in, rétention et uniformité de la dalle', paragraphs: ['Des formes persistantes visibles sur plusieurs champs neutres ou unis peuvent mériter une vérification. Un artefact similaire peut aussi venir d’une rétention temporaire, d’une non-uniformité de dalle, d’une dominante de teinte ou de mura.', 'Le burn-in OLED désigne généralement un vieillissement différentiel permanent, tandis que la rétention d’image peut être temporaire. Un motif de navigateur ne peut pas déterminer la cause ni confirmer qu’un artefact est permanent.'] },
        { heading: 'Ce que ce test ne fait pas', paragraphs: ['Il s’agit d’un outil d’inspection, pas d’un mode de réparation ou pixel fixer. Il ne fait pas clignoter la dalle, ne lance pas de longs cycles à forte luminosité, ne calcule pas de pourcentage de burn-in et ne certifie pas l’état de l’écran.', 'Les pourcentages de gris sont des valeurs de référence sRGB codées, pas des mesures de luminance physique de la dalle. Si un artefact persistant compte pour l’usage ou la garantie, confirmez-le avec du contenu réel et les recommandations du fabricant.'] },
      ],
    },
  },
  es: {
    home: { facts: '22 tests en el navegador · sin instalación · sin cuenta · procesamiento local' },
    tool: {
      name: 'Prueba de Burn-In OLED',
      shortDescription: 'Usa colores sólidos y campos grises para revisar visualmente formas persistentes o retención de imagen.',
      seoTitle: 'Prueba de Burn-In OLED — Comprueba Burn-In y Retención de Imagen',
      metaDescription: 'Usa colores sólidos y campos grises a pantalla completa para revisar visualmente formas persistentes, burn-in y retención de imagen en pantallas OLED.',
      h1: 'Prueba de Burn-In OLED',
      intro: 'Compara colores sólidos controlados y campos grises para que las formas persistentes o la retención temporal sean más fáciles de detectar.',
      sections: [
        { heading: 'Cómo hacer la prueba de burn-in OLED', steps: ['Selecciona <strong>Iniciar Prueba de Burn-In OLED</strong>. Se usa pantalla completa cuando está disponible; si no, los mismos patrones permanecen grandes dentro de la página.', 'Recorre manualmente todos los campos sólidos y grises. Busca el mismo contorno, logotipo, barra, forma de teclado u otro residuo de imagen en varios campos diferentes.', 'Oculta los controles si tapan una zona que quieras observar. Compara cualquier señal sospechosa con contenido normal antes de sacar conclusiones.'] },
        { heading: 'Burn-in, retención y uniformidad del panel', paragraphs: ['Las formas persistentes visibles en varios campos neutros o sólidos pueden merecer una revisión. Un artefacto parecido también puede deberse a retención temporal, falta de uniformidad del panel, cambios de tono o mura.', 'El burn-in OLED suele referirse a envejecimiento diferencial permanente, mientras que la retención de imagen puede ser temporal. Un patrón del navegador no puede determinar la causa ni confirmar que un artefacto sea permanente.'] },
        { heading: 'Qué no hace esta prueba', paragraphs: ['Es una herramienta de inspección, no un modo de reparación ni pixel fixer. No hace parpadear el panel, no ejecuta ciclos largos de alto brillo, no calcula un porcentaje de burn-in ni certifica el estado de la pantalla.', 'Los porcentajes de gris son valores de referencia sRGB codificados, no mediciones de luminancia física del panel. Si un artefacto persistente importa para el uso o la garantía, confírmalo con contenido real y las indicaciones del fabricante.'] },
      ],
    },
  },
  ru: {
    home: { facts: '22 теста в браузере · без установки · без аккаунта · локальная обработка' },
    tool: {
      name: 'Тест OLED на выгорание',
      shortDescription: 'Используйте сплошные цвета и серые поля, чтобы визуально проверить устойчивые контуры и остаточное изображение.',
      seoTitle: 'Тест OLED на выгорание — Проверка Burn-In и остаточного изображения',
      metaDescription: 'Используйте полноэкранные сплошные цвета и серые поля для визуальной проверки устойчивых контуров, выгорания OLED и остаточного изображения.',
      h1: 'Тест OLED на выгорание',
      intro: 'Сравните контролируемые сплошные цвета и серые поля, чтобы устойчивые контуры или временное остаточное изображение было легче заметить глазами.',
      sections: [
        { heading: 'Как пройти тест OLED на выгорание', steps: ['Нажмите <strong>Начать тест OLED на выгорание</strong>. Если доступен полноэкранный режим, тест использует его; иначе те же шаблоны останутся крупными на странице.', 'Вручную просмотрите все сплошные и серые поля. Ищите один и тот же контур, логотип, панель, форму клавиатуры или другой след изображения на нескольких разных полях.', 'Скройте управление, если оно закрывает нужную область. Сравните подозрительный артефакт с обычным контентом, прежде чем делать вывод.'] },
        { heading: 'Выгорание, остаточное изображение и неравномерность панели', paragraphs: ['Устойчивые формы, видимые на нескольких нейтральных или сплошных полях, стоит проверить внимательнее. Похожий артефакт также может быть временным остаточным изображением, неравномерностью панели, изменением оттенка или mura.', 'Под выгоранием OLED обычно понимают постоянное неравномерное старение, тогда как остаточное изображение может быть временным. Браузерный шаблон не способен установить причину или подтвердить, что артефакт постоянный.'] },
        { heading: 'Чего этот тест не делает', paragraphs: ['Это инструмент визуальной проверки, а не режим ремонта или pixel fixer. Он не мигает экраном, не запускает длительные циклы на высокой яркости, не рассчитывает процент выгорания и не сертифицирует состояние дисплея.', 'Проценты серого — это кодированные эталонные значения sRGB, а не измерение физической яркости панели. Если устойчивый артефакт важен для использования или гарантии, подтвердите его на реальном контенте и сверяйтесь с рекомендациями производителя.'] },
      ],
    },
  },
} as const satisfies Record<Locale, OledBurnInContentBundle>;
