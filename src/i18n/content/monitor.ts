import type { Locale } from '../locales';
import type { HomeContent, ToolPageContent } from './types';

interface MonitorContentBundle {
  readonly home: Pick<HomeContent, 'facts'>;
  readonly tool: ToolPageContent;
}

export const monitorContentByLocale = {
  en: {
    home: { facts: '20 browser tools · no install · no account · local processing' },
    tool: {
      name: 'Monitor Test',
      shortDescription: 'Run solid colors, gradients, level references, and a grid for guided visual screen inspection.',
      seoTitle: 'Monitor Test — Test Your Screen & Display Online',
      metaDescription: 'Run a guided fullscreen monitor test with solid colors, gray fields, gradients and basic display patterns to visually inspect common screen issues.',
      h1: 'Monitor Test',
      intro: 'Run a manual screen test with static color fields, gradients, level references, and a sharpness grid for a quick visual first pass.',
      sections: [
        {
          heading: 'How to run the monitor test',
          steps: [
            'Select <strong>Start Monitor Test</strong>. Fullscreen is used when available; otherwise the same patterns stay large inside the page.',
            'Inspect each static field without rushing. Use click/tap, Space, or the Right Arrow to move forward and the Left Arrow to go back.',
            'Hide the controls when they cover an area you want to inspect. Press Esc to leave browser fullscreen.',
          ],
        },
        {
          heading: 'What the patterns can help you inspect',
          paragraphs: [
            'Solid colors and gray fields can make obvious pixel-like points, tint differences, uneven fields, leakage, or clouding easier to notice by eye.',
            'Gradients, black/white level references, and the sharpness grid can reveal visible banding, crushed or merged steps, and obvious geometry or sharpness differences.',
          ],
        },
        {
          heading: 'Visual inspection limits',
          paragraphs: [
            'This is a visual screen test, not a colorimeter, response-time measurement, contrast-ratio measurement, or automatic display-health verdict.',
            'The 5% and 50% Gray fields are encoded sRGB reference values. They do not mean measured physical panel luminance percentages.',
          ],
        },
      ],
    },
  },
  'pt-BR': {
    home: { facts: '20 testes no navegador · sem instalação · sem conta · processamento local' },
    tool: {
      name: 'Teste de Monitor',
      shortDescription: 'Use cores sólidas, gradientes, referências de nível e uma grade para inspeção visual guiada da tela.',
      seoTitle: 'Teste de Monitor Online — Verifique a Tela e as Cores',
      metaDescription: 'Execute um teste de monitor em tela cheia com cores sólidas, campos de cinza, gradientes e padrões básicos para inspeção visual da tela.',
      h1: 'Teste de Monitor',
      intro: 'Faça um teste manual da tela com campos de cor estáticos, gradientes, referências de nível e uma grade de nitidez para uma primeira inspeção visual.',
      sections: [
        { heading: 'Como fazer o teste de monitor', steps: ['Selecione <strong>Iniciar Teste de Monitor</strong>. A tela cheia é usada quando disponível; caso contrário, os padrões continuam grandes dentro da página.', 'Observe cada campo estático com calma. Use clique/toque, Espaço ou a seta para a direita para avançar e a seta para a esquerda para voltar.', 'Oculte os controles se cobrirem uma área que você quer observar. Pressione Esc para sair da tela cheia do navegador.'] },
        { heading: 'O que os padrões ajudam a observar', paragraphs: ['Cores sólidas e campos de cinza podem facilitar a percepção visual de pontos semelhantes a pixels defeituosos, diferenças de tonalidade, áreas desiguais, vazamento de luz ou manchas.', 'Gradientes, referências de nível de preto/branco e a grade de nitidez podem mostrar banding visível, etapas que se misturam e diferenças óbvias de geometria ou nitidez.'] },
        { heading: 'Limites da inspeção visual', paragraphs: ['Este é um teste visual da tela, não um colorímetro, medição de tempo de resposta, medição de contraste ou diagnóstico automático do monitor.', 'Os campos Cinza 5% e 50% são valores de referência sRGB codificados. Eles não representam porcentagens medidas da luminância física do painel.'] },
      ],
    },
  },
  de: {
    home: { facts: '20 Browser-Tests · keine Installation · kein Konto · lokale Verarbeitung' },
    tool: {
      name: 'Monitor-Test',
      shortDescription: 'Prüfe den Bildschirm mit Vollfarben, Verläufen, Pegelreferenzen und einem Raster visuell.',
      seoTitle: 'Monitor-Test Online — Bildschirm & Display prüfen',
      metaDescription: 'Geführter Monitor-Test mit Vollfarben, Graufeldern, Verläufen und einfachen Displaymustern zur visuellen Prüfung häufiger Bildschirmauffälligkeiten.',
      h1: 'Monitor-Test',
      intro: 'Führe einen manuellen Bildschirmtest mit statischen Farbfeldern, Verläufen, Pegelreferenzen und einem Schärferaster für eine schnelle visuelle Erstprüfung durch.',
      sections: [
        { heading: 'So führst du den Monitor-Test aus', steps: ['Wähle <strong>Monitor-Test starten</strong>. Wenn möglich, wird Vollbild verwendet; sonst bleiben die Muster groß in der Seite.', 'Prüfe jedes statische Feld in Ruhe. Mit Klick/Tippen, Leertaste oder Pfeil rechts gehst du weiter, mit Pfeil links zurück.', 'Blende die Steuerung aus, wenn sie einen Prüfbereich verdeckt. Mit Esc verlässt du den Browser-Vollbildmodus.'] },
        { heading: 'Was die Muster sichtbar machen können', paragraphs: ['Vollfarben und Graufelder können auffällige pixelartige Punkte, Farbstiche, ungleichmäßige Flächen, Lichtaustritt oder Clouding leichter sichtbar machen.', 'Verläufe, Schwarz-/Weißpegelreferenzen und das Schärferaster können sichtbares Banding, zusammenlaufende Stufen sowie deutliche Geometrie- oder Schärfeunterschiede zeigen.'] },
        { heading: 'Grenzen der Sichtprüfung', paragraphs: ['Dies ist ein visueller Bildschirmtest, kein Colorimeter, keine Reaktionszeit- oder Kontrastmessung und kein automatisches Gesundheitsurteil über das Display.', 'Die Felder 5 % und 50 % Grau sind kodierte sRGB-Referenzwerte. Sie sind keine gemessenen Prozentwerte der physikalischen Panel-Leuchtdichte.'] },
      ],
    },
  },
  fr: {
    home: { facts: '20 tests navigateur · sans installation · sans compte · traitement local' },
    tool: {
      name: 'Test d’écran',
      shortDescription: 'Inspectez visuellement l’écran avec des couleurs unies, dégradés, références de niveaux et une grille.',
      seoTitle: 'Test d’écran en ligne — Tester le moniteur et l’affichage',
      metaDescription: 'Lancez un test d’écran guidé avec couleurs unies, champs gris, dégradés et motifs simples pour inspecter visuellement les problèmes courants.',
      h1: 'Test d’écran',
      intro: 'Effectuez un test manuel avec des champs de couleur statiques, des dégradés, des références de niveaux et une grille de netteté pour une première inspection visuelle.',
      sections: [
        { heading: 'Comment lancer le test d’écran', steps: ['Sélectionnez <strong>Démarrer le test d’écran</strong>. Le plein écran est utilisé s’il est disponible ; sinon les motifs restent grands dans la page.', 'Examinez chaque champ statique sans vous presser. Utilisez clic/toucher, Espace ou Flèche droite pour avancer et Flèche gauche pour revenir.', 'Masquez les commandes si elles couvrent une zone à inspecter. Appuyez sur Échap pour quitter le plein écran du navigateur.'] },
        { heading: 'Ce que les motifs peuvent aider à observer', paragraphs: ['Les couleurs unies et champs gris peuvent rendre plus visibles des points ressemblant à des pixels défectueux, des différences de teinte, des zones inégales, des fuites lumineuses ou du clouding.', 'Les dégradés, références de niveaux noir/blanc et la grille de netteté peuvent révéler un banding visible, des niveaux qui se confondent et des différences évidentes de géométrie ou de netteté.'] },
        { heading: 'Limites de l’inspection visuelle', paragraphs: ['Il s’agit d’un test visuel, pas d’un colorimètre, d’une mesure du temps de réponse ou du contraste, ni d’un verdict automatique sur l’état de l’écran.', 'Les champs Gris 5 % et 50 % sont des valeurs de référence sRGB codées. Ils ne correspondent pas à des pourcentages mesurés de luminance physique de la dalle.'] },
      ],
    },
  },
  es: {
    home: { facts: '20 tests en el navegador · sin instalación · sin cuenta · procesamiento local' },
    tool: {
      name: 'Prueba de Monitor',
      shortDescription: 'Inspecciona visualmente la pantalla con colores sólidos, gradientes, referencias de nivel y una cuadrícula.',
      seoTitle: 'Prueba de Monitor Online — Test de Pantalla y Display',
      metaDescription: 'Ejecuta una prueba guiada de monitor con colores sólidos, campos grises, gradientes y patrones básicos para inspeccionar visualmente la pantalla.',
      h1: 'Prueba de Monitor',
      intro: 'Haz una prueba manual de pantalla con campos de color estáticos, gradientes, referencias de nivel y una cuadrícula de nitidez para una primera inspección visual.',
      sections: [
        { heading: 'Cómo hacer la prueba de monitor', steps: ['Selecciona <strong>Iniciar Prueba de Monitor</strong>. Se usa pantalla completa cuando está disponible; si no, los patrones permanecen grandes dentro de la página.', 'Revisa cada campo estático con calma. Usa clic/toque, Espacio o Flecha derecha para avanzar y Flecha izquierda para volver.', 'Oculta los controles si tapan una zona que quieras observar. Pulsa Esc para salir de la pantalla completa del navegador.'] },
        { heading: 'Qué pueden ayudar a observar los patrones', paragraphs: ['Los colores sólidos y campos grises pueden hacer más visibles puntos parecidos a píxeles defectuosos, diferencias de tono, zonas desiguales, fugas de luz o clouding.', 'Los gradientes, referencias de nivel de negro/blanco y la cuadrícula de nitidez pueden mostrar banding visible, niveles que se mezclan y diferencias evidentes de geometría o nitidez.'] },
        { heading: 'Límites de la inspección visual', paragraphs: ['Esta es una prueba visual de pantalla, no un colorímetro, una medición del tiempo de respuesta o contraste ni un diagnóstico automático del estado del monitor.', 'Los campos Gris 5 % y 50 % son valores de referencia sRGB codificados. No representan porcentajes medidos de luminancia física del panel.'] },
      ],
    },
  },
  ru: {
    home: { facts: '20 тестов в браузере · без установки · без аккаунта · локальная обработка' },
    tool: {
      name: 'Тест монитора',
      shortDescription: 'Проверьте экран по сплошным цветам, градиентам, шкалам уровней и сетке для визуальной оценки.',
      seoTitle: 'Тест монитора онлайн — Проверка экрана и дисплея',
      metaDescription: 'Запустите пошаговый тест монитора со сплошными цветами, серыми полями, градиентами и базовыми шаблонами для визуальной проверки экрана.',
      h1: 'Тест монитора',
      intro: 'Пройдите ручную проверку экрана со статичными цветными полями, градиентами, шкалами уровней и сеткой резкости для быстрой первичной оценки.',
      sections: [
        { heading: 'Как пройти тест монитора', steps: ['Нажмите <strong>Начать тест монитора</strong>. Если доступен полноэкранный режим, тест использует его; иначе шаблоны останутся крупными прямо на странице.', 'Спокойно осмотрите каждый статичный шаблон. Клик/касание, Пробел или стрелка вправо переходят дальше, стрелка влево — назад.', 'Скройте управление, если оно закрывает нужную область. Нажмите Esc, чтобы выйти из полноэкранного режима браузера.'] },
        { heading: 'Что помогают заметить шаблоны', paragraphs: ['Сплошные цвета и серые поля помогают визуально заметить похожие на дефектные пиксели точки, различия оттенка, неравномерные области, засветы или облачность.', 'Градиенты, шкалы чёрного/белого и сетка резкости могут показать заметный бэндинг, сливающиеся ступени и очевидные различия геометрии или резкости.'] },
        { heading: 'Ограничения визуальной проверки', paragraphs: ['Это визуальный тест экрана, а не колориметр, измерение времени отклика или контрастности и не автоматический вердикт о состоянии дисплея.', 'Поля «Серый 5%» и «Серый 50%» — кодированные эталонные значения sRGB. Они не означают измеренные проценты физической яркости панели.'] },
      ],
    },
  },
} as const satisfies Record<Locale, MonitorContentBundle>;
