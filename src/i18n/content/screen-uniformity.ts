import type { Locale } from '../locales';
import type { ToolPageContent } from './types';

interface ScreenUniformityLocaleContent {
  readonly home: { readonly facts: string };
  readonly tool: ToolPageContent;
}

export const screenUniformityContentByLocale = {
  en: {
    home: { facts: '21 browser tools · no install · no account · local processing' },
    tool: {
      name: 'Screen Uniformity Test',
      shortDescription: 'Inspect gray fields for uneven brightness, tint, banding or DSE-like patches.',
      seoTitle: 'Screen Uniformity Test — Check Gray Uniformity & DSE',
      metaDescription: 'Use fullscreen gray fields to visually inspect screen uniformity, dirty screen effect, banding, tint and uneven brightness on OLED or LCD displays.',
      h1: 'Screen Uniformity Test',
      intro: 'Compare controlled gray fields to visually inspect screen uniformity, dirty screen effect (DSE), banding, tint and uneven brightness.',
      sections: [
        { heading: 'How to check screen uniformity', steps: ['Use your normal viewing brightness and reduce distracting reflections.', 'Start the test and compare several gray levels from your normal viewing position.', 'If you notice a patch or tint, check whether it also appears in ordinary real content before drawing a conclusion.'] },
        { heading: 'What to look for', paragraphs: ['Uneven areas may appear as brighter or darker patches, tint shifts, bands, clouding, mura-like variation or dirty-screen-effect-like texture. Comparing several gray levels can make different kinds of variation easier to notice.'] },
        { heading: 'What this test cannot measure', paragraphs: ['These are deterministic encoded sRGB reference fields, not luminance measurements. The browser cannot calculate a uniformity percentage, panel-variance score or color delta without external measurement hardware.', 'Visible variation is not automatically proof of a defect. Viewing conditions, reflections, content and panel characteristics can affect what you see.'] },
      ],
    },
  },
  'pt-BR': {
    home: { facts: '21 testes no navegador · sem instalação · sem conta · processamento local' },
    tool: {
      name: 'Teste de uniformidade da tela', shortDescription: 'Inspecione campos de cinza para brilho desigual, tonalidade, faixas ou manchas semelhantes a DSE.', seoTitle: 'Teste de uniformidade da tela — Verifique uniformidade de cinza e DSE', metaDescription: 'Use campos de cinza em tela cheia para inspecionar visualmente uniformidade, efeito de tela suja, faixas, tonalidade e brilho desigual em telas OLED ou LCD.', h1: 'Teste de uniformidade da tela', intro: 'Compare campos de cinza controlados para inspecionar visualmente uniformidade, efeito de tela suja (DSE), faixas, tonalidade e brilho desigual.',
      sections: [
        { heading: 'Como verificar a uniformidade da tela', steps: ['Use o brilho normal de visualização e reduza reflexos que distraiam.', 'Inicie o teste e compare vários níveis de cinza na sua posição normal de visualização.', 'Se notar uma mancha ou tonalidade, verifique se ela também aparece em conteúdo real comum antes de tirar uma conclusão.'] },
        { heading: 'O que observar', paragraphs: ['Áreas irregulares podem aparecer como manchas mais claras ou escuras, mudanças de tonalidade, faixas, aspecto nublado, variação tipo mura ou textura semelhante a efeito de tela suja. Comparar vários níveis de cinza pode facilitar a percepção de diferentes variações.'] },
        { heading: 'O que este teste não mede', paragraphs: ['Estes são campos de referência sRGB codificados e determinísticos, não medições de luminância. Sem hardware externo, o navegador não calcula porcentagem de uniformidade, variação do painel ou delta de cor.', 'Variação visível não prova automaticamente um defeito. Condições de visualização, reflexos, conteúdo e características do painel podem influenciar o que você vê.'] },
      ],
    },
  },
  de: {
    home: { facts: '21 Browser-Tests · keine Installation · kein Konto · lokale Verarbeitung' },
    tool: {
      name: 'Bildschirm-Gleichmäßigkeitstest', shortDescription: 'Grauflächen auf ungleichmäßige Helligkeit, Farbstich, Streifen oder DSE-ähnliche Flecken prüfen.', seoTitle: 'Bildschirm-Gleichmäßigkeitstest — Grau-Gleichmäßigkeit & DSE prüfen', metaDescription: 'Prüfen Sie mit Grauflächen im Vollbild visuell Bildschirmgleichmäßigkeit, Dirty Screen Effect, Streifen, Farbstich und ungleichmäßige Helligkeit bei OLED- oder LCD-Displays.', h1: 'Bildschirm-Gleichmäßigkeitstest', intro: 'Vergleichen Sie kontrollierte Grauflächen, um Gleichmäßigkeit, Dirty Screen Effect (DSE), Streifen, Farbstich und ungleichmäßige Helligkeit visuell zu prüfen.',
      sections: [
        { heading: 'So prüfen Sie die Bildschirmgleichmäßigkeit', steps: ['Verwenden Sie Ihre normale Betrachtungshelligkeit und reduzieren Sie störende Reflexionen.', 'Starten Sie den Test und vergleichen Sie mehrere Graustufen aus Ihrer normalen Betrachtungsposition.', 'Wenn Sie Flecken oder Farbstiche sehen, prüfen Sie vor einer Schlussfolgerung, ob diese auch in normalen Inhalten sichtbar sind.'] },
        { heading: 'Worauf Sie achten können', paragraphs: ['Ungleichmäßigkeiten können als hellere oder dunklere Flecken, Farbstiche, Streifen, Wolken, mura-artige Abweichungen oder DSE-ähnliche Strukturen erscheinen. Mehrere Graustufen können unterschiedliche Abweichungen sichtbarer machen.'] },
        { heading: 'Was dieser Test nicht misst', paragraphs: ['Dies sind deterministische codierte sRGB-Referenzflächen und keine Luminanzmessungen. Ohne externe Messtechnik kann der Browser weder einen Gleichmäßigkeitswert noch Panel-Varianz oder Farb-Delta berechnen.', 'Sichtbare Abweichungen sind nicht automatisch ein Defektnachweis. Betrachtungsbedingungen, Reflexionen, Inhalte und Panel-Eigenschaften können den Eindruck beeinflussen.'] },
      ],
    },
  },
  fr: {
    home: { facts: '21 tests navigateur · sans installation · sans compte · traitement local' },
    tool: {
      name: "Test d'uniformité de l'écran", shortDescription: 'Inspectez des aplats gris pour repérer luminosité inégale, teinte, bandes ou zones de type DSE.', seoTitle: "Test d'uniformité de l'écran — Vérifier l'uniformité des gris et le DSE", metaDescription: "Utilisez des aplats gris en plein écran pour inspecter visuellement l'uniformité, le dirty screen effect, les bandes, les teintes et la luminosité inégale des écrans OLED ou LCD.", h1: "Test d'uniformité de l'écran", intro: "Comparez des aplats gris contrôlés pour inspecter visuellement l'uniformité, le dirty screen effect (DSE), les bandes, les teintes et les différences de luminosité.",
      sections: [
        { heading: "Comment vérifier l'uniformité de l'écran", steps: ['Utilisez votre luminosité de visionnage habituelle et réduisez les reflets gênants.', 'Démarrez le test et comparez plusieurs niveaux de gris depuis votre position habituelle.', "Si vous remarquez une zone ou une teinte, vérifiez si elle apparaît aussi dans du contenu réel avant d'en tirer une conclusion."] },
        { heading: 'Ce que vous pouvez observer', paragraphs: ['Les variations peuvent prendre la forme de zones plus claires ou plus sombres, de teintes, de bandes, de nuages, de variations de type mura ou de textures rappelant le dirty screen effect. Plusieurs niveaux de gris peuvent révéler des variations différentes.'] },
        { heading: 'Ce que ce test ne mesure pas', paragraphs: ["Ces aplats sont des références sRGB codées et déterministes, pas des mesures de luminance. Sans matériel de mesure externe, le navigateur ne peut pas calculer un pourcentage d'uniformité, un score de variance ou un delta de couleur.", "Une variation visible ne prouve pas automatiquement un défaut. Les conditions d'observation, les reflets, le contenu et les caractéristiques de la dalle peuvent influencer ce que vous voyez."] },
      ],
    },
  },
  es: {
    home: { facts: '21 tests en el navegador · sin instalación · sin cuenta · procesamiento local' },
    tool: {
      name: 'Prueba de uniformidad de pantalla', shortDescription: 'Inspecciona campos grises para detectar brillo desigual, tintes, bandas o manchas similares al DSE.', seoTitle: 'Prueba de uniformidad de pantalla — Comprueba uniformidad de grises y DSE', metaDescription: 'Usa campos grises a pantalla completa para inspeccionar visualmente uniformidad, efecto de pantalla sucia, bandas, tintes y brillo desigual en pantallas OLED o LCD.', h1: 'Prueba de uniformidad de pantalla', intro: 'Compara campos grises controlados para inspeccionar visualmente uniformidad, efecto de pantalla sucia (DSE), bandas, tintes y brillo desigual.',
      sections: [
        { heading: 'Cómo comprobar la uniformidad de pantalla', steps: ['Usa tu brillo normal de visualización y reduce los reflejos que distraigan.', 'Inicia la prueba y compara varios niveles de gris desde tu posición habitual.', 'Si observas una mancha o un tinte, comprueba si también aparece en contenido real antes de sacar una conclusión.'] },
        { heading: 'Qué puedes observar', paragraphs: ['Las variaciones pueden verse como zonas más claras u oscuras, cambios de tinte, bandas, nubes, variación tipo mura o textura similar al efecto de pantalla sucia. Comparar varios niveles de gris puede hacer visibles distintos tipos de variación.'] },
        { heading: 'Qué no mide esta prueba', paragraphs: ['Estos son campos de referencia sRGB codificados y deterministas, no mediciones de luminancia. Sin hardware externo, el navegador no puede calcular un porcentaje de uniformidad, una puntuación de variación del panel ni un delta de color.', 'Una variación visible no demuestra automáticamente un defecto. Las condiciones de visualización, los reflejos, el contenido y las características del panel pueden influir en lo que ves.'] },
      ],
    },
  },
  ru: {
    home: { facts: '21 тест в браузере · без установки · без аккаунта · локальная обработка' },
    tool: {
      name: 'Тест равномерности экрана', shortDescription: 'Проверьте серые поля на неравномерную яркость, оттенок, полосы и пятна, похожие на DSE.', seoTitle: 'Тест равномерности экрана — Проверка серого поля и DSE', metaDescription: 'Используйте серые поля на весь экран, чтобы визуально проверить равномерность, эффект грязного экрана, полосы, оттенок и неравномерную яркость OLED- или LCD-дисплея.', h1: 'Тест равномерности экрана', intro: 'Сравните контролируемые серые поля, чтобы визуально проверить равномерность экрана, эффект грязного экрана (DSE), полосы, оттенки и различия яркости.',
      sections: [
        { heading: 'Как проверить равномерность экрана', steps: ['Используйте обычную для просмотра яркость и уменьшите мешающие отражения.', 'Запустите тест и сравните несколько уровней серого из обычного положения просмотра.', 'Если заметили пятно или оттенок, проверьте, видно ли его и на обычном реальном контенте, прежде чем делать вывод.'] },
        { heading: 'На что смотреть', paragraphs: ['Неравномерность может выглядеть как более светлые или тёмные пятна, изменение оттенка, полосы, облачность, mura-подобные зоны или фактура, похожая на эффект грязного экрана. Сравнение нескольких уровней серого помогает заметить разные виды отклонений.'] },
        { heading: 'Что этот тест не измеряет', paragraphs: ['Это детерминированные кодированные эталонные поля sRGB, а не измерение яркости. Без внешнего измерительного оборудования браузер не может рассчитать процент равномерности, оценку разброса панели или цветовую дельту.', 'Видимая неоднородность сама по себе не доказывает дефект. На восприятие влияют условия просмотра, отражения, контент и особенности панели.'] },
      ],
    },
  },
} as const satisfies Record<Locale, ScreenUniformityLocaleContent>;
