import type { Locale } from '../locales';
import type { HomeContent, ToolPageContent } from './types';

interface WebcamContentBundle {
  readonly category: string;
  readonly signal: string;
  readonly home: Pick<HomeContent, 'facts' | 'metaDescription' | 'intro'>;
  readonly privacyParagraphs: readonly [string, string];
  readonly tool: ToolPageContent;
}

export const webcamContentByLocale = {
  en: {
    category: 'Camera',
    signal: 'Camera',
    home: {
      facts: '24 browser tools · no install · no account · local processing',
      metaDescription: 'Focused browser hardware tests for controllers, mice, keyboards, displays, touchscreens, webcams, and printable printer references. No install or account required.',
      intro: 'Focused diagnostics for controllers, mice, keyboards, displays, touchscreens, webcams, and print output — built to show what the browser can actually detect, estimate, render, or open locally.',
    },
    privacyParagraphs: [
      'Controller, keyboard, mouse, touch, frame-timing, and camera data are processed locally in your browser.',
      'Camera video is not uploaded, recorded, or stored by Hardware Inspect.',
    ],
    tool: {
      name: 'Webcam Test',
      shortDescription: 'Open your webcam locally to confirm the browser receives a live video stream.',
      seoTitle: 'Webcam Test — Check Your Camera Online',
      metaDescription: 'Test your webcam directly in the browser with a live camera preview and browser-reported stream information. No recording or upload.',
      h1: 'Webcam Test',
      intro: 'Open your webcam directly in the browser to confirm a live camera stream and inspect browser-reported stream information. Video stays on this device.',
      sections: [
        { heading: 'How to test your webcam', steps: ['Select <strong>Start Camera</strong>. The browser asks for camera permission only after this action.', 'Confirm that the live preview appears. If more than one video input is available after permission, choose another camera to switch.', 'Review the browser-reported stream resolution, track-reported frame rate when available, and aspect ratio. Select <strong>Stop Camera</strong> when finished.'] },
        { heading: 'What the stream information means', paragraphs: ['The values come from the active browser media track. They describe the stream the browser reports for this session, not a universal camera-quality score or a guarantee of the sensor’s maximum hardware capability.', 'Camera availability, selected resolution and reported frame rate can vary with browser, operating system, driver, camera settings, lighting, and other applications using the device.'] },
        { heading: 'Privacy and browser limitations', paragraphs: ['Hardware Inspect requests video only — never microphone audio. The live camera stream is not uploaded, recorded, stored, or captured as a snapshot by this tool.', 'Stopping the camera, switching away from the page, or ending the session releases active camera tracks. Permission and device-selection behavior remain controlled by your browser and operating system.'] },
      ],
    },
  },
  'pt-BR': {
    category: 'Câmera',
    signal: 'Câmera',
    home: {
      facts: '24 testes no navegador · sem instalação · sem conta · processamento local',
      metaDescription: 'Testes de hardware no navegador para controles, mouse, teclado, telas, touchscreens, webcams e referências imprimíveis. Sem instalação nem conta.',
      intro: 'Diagnósticos focados para controles, mouse, teclado, telas, touchscreens, webcams e saída de impressão — mostrando o que o navegador consegue detectar, estimar, renderizar ou abrir localmente.',
    },
    privacyParagraphs: ['Dados de controle, teclado, mouse, toque, temporização de quadros e câmera são processados localmente no navegador.', 'O vídeo da câmera não é enviado, gravado nem armazenado pelo Hardware Inspect.'],
    tool: {
      name: 'Teste de Webcam',
      shortDescription: 'Abra sua webcam localmente para confirmar que o navegador recebe um fluxo de vídeo ao vivo.',
      seoTitle: 'Teste de Webcam — Verifique Sua Câmera Online',
      metaDescription: 'Teste sua webcam diretamente no navegador com visualização ao vivo e informações do fluxo reportadas pelo navegador. Sem gravação ou envio.',
      h1: 'Teste de Webcam',
      intro: 'Abra sua webcam diretamente no navegador para confirmar o vídeo ao vivo e consultar informações do fluxo reportadas pelo navegador. O vídeo permanece neste dispositivo.',
      sections: [
        { heading: 'Como testar sua webcam', steps: ['Selecione <strong>Iniciar Câmera</strong>. O navegador pede permissão somente depois desta ação.', 'Confirme que a visualização ao vivo aparece. Se houver mais de uma entrada de vídeo após a permissão, escolha outra câmera para alternar.', 'Confira a resolução do fluxo, a taxa de quadros reportada pela faixa quando disponível e a proporção. Selecione <strong>Parar Câmera</strong> ao terminar.'] },
        { heading: 'O que significam as informações do fluxo', paragraphs: ['Os valores vêm da faixa de mídia ativa do navegador. Eles descrevem o fluxo reportado nesta sessão, não uma pontuação universal de qualidade nem a capacidade máxima garantida do sensor.', 'Disponibilidade, resolução selecionada e taxa de quadros podem variar conforme navegador, sistema, driver, configurações, iluminação e outros aplicativos usando a câmera.'] },
        { heading: 'Privacidade e limitações do navegador', paragraphs: ['O Hardware Inspect solicita apenas vídeo — nunca áudio do microfone. O fluxo ao vivo não é enviado, gravado, armazenado nem capturado como imagem por esta ferramenta.', 'Parar a câmera ou sair da página libera as faixas ativas. Permissões e seleção de dispositivo continuam sob controle do navegador e do sistema operacional.'] },
      ],
    },
  },
  de: {
    category: 'Kamera',
    signal: 'Kamera',
    home: {
      facts: '24 Browser-Tests · keine Installation · kein Konto · lokale Verarbeitung',
      metaDescription: 'Gezielte Browser-Hardwaretests für Controller, Mäuse, Tastaturen, Displays, Touchscreens, Webcams und druckbare Referenzen. Keine Installation, kein Konto.',
      intro: 'Gezielte Diagnosen für Controller, Mäuse, Tastaturen, Displays, Touchscreens, Webcams und Druckausgabe — sie zeigen, was der Browser tatsächlich lokal erkennen, schätzen, rendern oder öffnen kann.',
    },
    privacyParagraphs: ['Controller-, Tastatur-, Maus-, Touch-, Frame-Timing- und Kameradaten werden lokal im Browser verarbeitet.', 'Kameravideo wird von Hardware Inspect weder hochgeladen noch aufgezeichnet oder gespeichert.'],
    tool: {
      name: 'Webcam-Test',
      shortDescription: 'Öffne deine Webcam lokal und prüfe, ob der Browser einen Live-Videostream empfängt.',
      seoTitle: 'Webcam-Test — Kamera Online Prüfen',
      metaDescription: 'Teste deine Webcam direkt im Browser mit Live-Vorschau und vom Browser gemeldeten Stream-Informationen. Keine Aufnahme, kein Upload.',
      h1: 'Webcam-Test',
      intro: 'Öffne deine Webcam direkt im Browser, um einen Live-Kamerastream und die vom Browser gemeldeten Stream-Informationen zu prüfen. Das Video bleibt auf diesem Gerät.',
      sections: [
        { heading: 'So testest du deine Webcam', steps: ['Wähle <strong>Kamera starten</strong>. Erst nach dieser Aktion fragt der Browser nach der Kameraberechtigung.', 'Prüfe, ob die Live-Vorschau erscheint. Sind nach der Freigabe mehrere Videoeingänge verfügbar, kannst du zu einer anderen Kamera wechseln.', 'Prüfe Stream-Auflösung, die vom Track gemeldete Bildrate (falls vorhanden) und das Seitenverhältnis. Wähle danach <strong>Kamera stoppen</strong>.'] },
        { heading: 'Was die Stream-Informationen bedeuten', paragraphs: ['Die Werte stammen vom aktiven Browser-Medientrack. Sie beschreiben den für diese Sitzung gemeldeten Stream, nicht einen allgemeinen Kamera-Qualitätswert oder garantiert die maximale Sensorleistung.', 'Verfügbarkeit, gewählte Auflösung und gemeldete Bildrate können je nach Browser, Betriebssystem, Treiber, Kameraeinstellungen, Licht und anderen Anwendungen variieren.'] },
        { heading: 'Datenschutz und Browsergrenzen', paragraphs: ['Hardware Inspect fordert nur Video an — niemals Mikrofon-Audio. Der Live-Stream wird von diesem Tool nicht hochgeladen, aufgezeichnet, gespeichert oder als Schnappschuss erfasst.', 'Beim Stoppen der Kamera oder Verlassen der Seite werden aktive Kameratracks freigegeben. Berechtigungen und Geräteauswahl bleiben unter Kontrolle von Browser und Betriebssystem.'] },
      ],
    },
  },
  fr: {
    category: 'Caméra',
    signal: 'Caméra',
    home: {
      facts: '24 tests navigateur · sans installation · sans compte · traitement local',
      metaDescription: 'Tests matériels ciblés dans le navigateur pour manettes, souris, claviers, écrans, écrans tactiles, webcams et références imprimables. Sans installation ni compte.',
      intro: 'Des diagnostics ciblés pour manettes, souris, claviers, écrans, écrans tactiles, webcams et impression — pour montrer ce que le navigateur peut réellement détecter, estimer, rendre ou ouvrir localement.',
    },
    privacyParagraphs: ['Les données de manette, clavier, souris, tactile, cadence d’images et caméra sont traitées localement dans le navigateur.', 'La vidéo de la caméra n’est ni téléversée, ni enregistrée, ni stockée par Hardware Inspect.'],
    tool: {
      name: 'Test de webcam',
      shortDescription: 'Ouvrez votre webcam localement pour confirmer que le navigateur reçoit un flux vidéo en direct.',
      seoTitle: 'Test de Webcam — Vérifier Votre Caméra en Ligne',
      metaDescription: 'Testez votre webcam directement dans le navigateur avec aperçu vidéo et informations de flux rapportées par le navigateur. Sans enregistrement ni téléversement.',
      h1: 'Test de webcam',
      intro: 'Ouvrez votre webcam directement dans le navigateur pour confirmer le flux en direct et consulter les informations rapportées par le navigateur. La vidéo reste sur cet appareil.',
      sections: [
        { heading: 'Comment tester votre webcam', steps: ['Sélectionnez <strong>Démarrer la caméra</strong>. Le navigateur demande l’autorisation uniquement après cette action.', 'Vérifiez que l’aperçu en direct apparaît. Si plusieurs entrées vidéo sont disponibles après autorisation, choisissez une autre caméra pour basculer.', 'Consultez la résolution du flux, la fréquence d’images rapportée par la piste lorsqu’elle est disponible et le format d’image. Sélectionnez <strong>Arrêter la caméra</strong> à la fin.'] },
        { heading: 'Ce que signifient les informations du flux', paragraphs: ['Les valeurs proviennent de la piste média active du navigateur. Elles décrivent le flux rapporté pour cette session, pas une note universelle de qualité ni la capacité matérielle maximale garantie du capteur.', 'Disponibilité, résolution sélectionnée et fréquence d’images peuvent varier selon le navigateur, le système, le pilote, les réglages, la lumière et les autres applications utilisant la caméra.'] },
        { heading: 'Confidentialité et limites du navigateur', paragraphs: ['Hardware Inspect demande uniquement la vidéo — jamais le son du microphone. Le flux en direct n’est ni téléversé, ni enregistré, ni stocké, ni capturé en image par cet outil.', 'Arrêter la caméra ou quitter la page libère les pistes actives. Les autorisations et le choix du périphérique restent contrôlés par le navigateur et le système d’exploitation.'] },
      ],
    },
  },
  es: {
    category: 'Cámara',
    signal: 'Cámara',
    home: {
      facts: '24 tests en el navegador · sin instalación · sin cuenta · procesamiento local',
      metaDescription: 'Tests de hardware en el navegador para gamepads, mouse, teclados, pantallas, pantallas táctiles, webcams y referencias imprimibles. Sin instalación ni cuenta.',
      intro: 'Diagnósticos específicos para gamepads, mouse, teclados, pantallas, pantallas táctiles, webcams e impresión, mostrando lo que el navegador puede detectar, estimar, renderizar o abrir localmente.',
    },
    privacyParagraphs: ['Los datos de gamepad, teclado, mouse, táctil, temporización de frames y cámara se procesan localmente en el navegador.', 'Hardware Inspect no sube, graba ni almacena el vídeo de la cámara.'],
    tool: {
      name: 'Prueba de Webcam',
      shortDescription: 'Abre tu webcam localmente para confirmar que el navegador recibe vídeo en directo.',
      seoTitle: 'Prueba de Webcam — Comprueba Tu Cámara Online',
      metaDescription: 'Prueba tu webcam directamente en el navegador con vista en directo e información del flujo reportada por el navegador. Sin grabación ni subida.',
      h1: 'Prueba de Webcam',
      intro: 'Abre tu webcam directamente en el navegador para confirmar el vídeo en directo y revisar información del flujo reportada por el navegador. El vídeo permanece en este dispositivo.',
      sections: [
        { heading: 'Cómo probar tu webcam', steps: ['Selecciona <strong>Iniciar Cámara</strong>. El navegador solicita permiso solo después de esta acción.', 'Comprueba que aparece la vista en directo. Si hay varias entradas de vídeo disponibles después del permiso, elige otra cámara para cambiar.', 'Revisa la resolución del flujo, la frecuencia de fotogramas reportada por la pista cuando esté disponible y la relación de aspecto. Selecciona <strong>Detener Cámara</strong> al terminar.'] },
        { heading: 'Qué significa la información del flujo', paragraphs: ['Los valores provienen de la pista multimedia activa del navegador. Describen el flujo reportado para esta sesión, no una puntuación universal de calidad ni la capacidad máxima garantizada del sensor.', 'La disponibilidad, resolución seleccionada y frecuencia reportada pueden variar según navegador, sistema, controlador, ajustes, iluminación y otras aplicaciones que usen la cámara.'] },
        { heading: 'Privacidad y límites del navegador', paragraphs: ['Hardware Inspect solicita solo vídeo, nunca audio del micrófono. Esta herramienta no sube, graba, almacena ni captura instantáneas del flujo en directo.', 'Detener la cámara o salir de la página libera las pistas activas. Los permisos y la selección del dispositivo siguen bajo control del navegador y del sistema operativo.'] },
      ],
    },
  },
  ru: {
    category: 'Камера',
    signal: 'Камера',
    home: {
      facts: '24 теста в браузере · без установки · без аккаунта · локальная обработка',
      metaDescription: 'Аппаратные тесты в браузере для геймпадов, мышей, клавиатур, экранов, сенсорных дисплеев, веб-камер и печатных эталонов. Без установки и аккаунта.',
      intro: 'Диагностика геймпадов, мышей, клавиатур, экранов, сенсорных дисплеев, веб-камер и печати — с честным показом того, что браузер может локально обнаружить, оценить, отрисовать или открыть.',
    },
    privacyParagraphs: ['Данные геймпада, клавиатуры, мыши, касаний, таймингов кадров и камеры обрабатываются локально в браузере.', 'Hardware Inspect не загружает, не записывает и не хранит видео с камеры.'],
    tool: {
      name: 'Проверка веб-камеры онлайн',
      shortDescription: 'Откройте веб-камеру локально и проверьте, получает ли браузер живой видеопоток.',
      seoTitle: 'Проверка веб-камеры онлайн — Тест камеры в браузере',
      metaDescription: 'Проверьте веб-камеру прямо в браузере: живое видео и данные потока, сообщаемые браузером. Без записи и загрузки.',
      h1: 'Проверка веб-камеры онлайн',
      intro: 'Откройте веб-камеру прямо в браузере, чтобы проверить живой видеопоток и посмотреть данные, сообщаемые браузером. Видео остаётся на этом устройстве.',
      sections: [
        { heading: 'Как проверить веб-камеру', steps: ['Нажмите <strong>Запустить камеру</strong>. Браузер запросит разрешение на камеру только после этого действия.', 'Убедитесь, что появилось живое изображение. Если после разрешения доступны несколько видеоустройств, можно переключиться на другую камеру.', 'Посмотрите разрешение потока, частоту кадров по данным видеотрека (если она сообщается) и соотношение сторон. После проверки нажмите <strong>Остановить камеру</strong>.'] },
        { heading: 'Что означают данные потока', paragraphs: ['Значения получены из активного медиатрека браузера. Они описывают поток этой сессии, а не дают универсальную оценку качества камеры и не гарантируют максимальные возможности сенсора.', 'Доступность камеры, выбранное разрешение и сообщаемая частота кадров могут зависеть от браузера, ОС, драйвера, настроек, освещения и других приложений, использующих камеру.'] },
        { heading: 'Приватность и ограничения браузера', paragraphs: ['Hardware Inspect запрашивает только видео — доступ к микрофону не нужен. Инструмент не загружает, не записывает, не хранит видеопоток и не делает снимки.', 'Остановка камеры или уход со страницы освобождает активные видеотреки. Разрешения и выбор устройства контролируются браузером и операционной системой.'] },
      ],
    },
  },
} as const satisfies Record<Locale, WebcamContentBundle>;
