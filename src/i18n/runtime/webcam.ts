import type { Locale } from '../locales';

export interface WebcamRuntimeMessages {
  readonly controlsHeading: string;
  readonly privacy: string;
  readonly start: string;
  readonly starting: string;
  readonly live: string;
  readonly switching: string;
  readonly stop: string;
  readonly cameraSelect: string;
  readonly currentCamera: string;
  readonly cameraOptionFallback: string;
  readonly streamInfo: string;
  readonly resolution: string;
  readonly frameRate: string;
  readonly aspectRatio: string;
  readonly unavailableValue: string;
  readonly errorApiUnavailable: string;
  readonly errorPermissionDenied: string;
  readonly errorNoCamera: string;
  readonly errorCameraUnreadable: string;
  readonly errorConstraintFailed: string;
  readonly errorStreamEnded: string;
  readonly errorRequestFailed: string;
}

const webcamRuntimeByLocale = {
  en: {
    controlsHeading: 'Webcam test controls',
    privacy: 'Your camera stays on this device. Hardware Inspect does not record or upload the video.',
    start: 'Start Camera',
    starting: 'Requesting camera access…',
    live: 'Camera active',
    switching: 'Switching camera…',
    stop: 'Stop Camera',
    cameraSelect: 'Camera',
    currentCamera: 'Current camera',
    cameraOptionFallback: 'Camera',
    streamInfo: 'Browser-reported stream information',
    resolution: 'Stream resolution',
    frameRate: 'Track-reported frame rate',
    aspectRatio: 'Aspect ratio',
    unavailableValue: 'Not reported',
    errorApiUnavailable: 'Camera access is unavailable in this browser or context.',
    errorPermissionDenied: 'Camera permission was denied. Allow camera access in your browser settings, then try again.',
    errorNoCamera: 'No camera was found. Connect or enable a camera, then try again.',
    errorCameraUnreadable: 'The camera could not be opened. It may be in use by another app or unavailable to the browser.',
    errorConstraintFailed: 'That camera could not be opened with the requested device selection. Choose another camera or try again.',
    errorStreamEnded: 'The camera stream ended. Start the camera again to continue.',
    errorRequestFailed: 'The camera could not be started. Check browser camera access and try again.',
  },
  'pt-BR': {
    controlsHeading: 'Controles do teste de webcam',
    privacy: 'Sua câmera permanece neste dispositivo. O Hardware Inspect não grava nem envia o vídeo.',
    start: 'Iniciar Câmera',
    starting: 'Solicitando acesso à câmera…',
    live: 'Câmera ativa',
    switching: 'Trocando câmera…',
    stop: 'Parar Câmera',
    cameraSelect: 'Câmera',
    currentCamera: 'Câmera atual',
    cameraOptionFallback: 'Câmera',
    streamInfo: 'Informações do fluxo reportadas pelo navegador',
    resolution: 'Resolução do fluxo',
    frameRate: 'Taxa de quadros reportada pela faixa',
    aspectRatio: 'Proporção',
    unavailableValue: 'Não informado',
    errorApiUnavailable: 'O acesso à câmera não está disponível neste navegador ou contexto.',
    errorPermissionDenied: 'A permissão da câmera foi negada. Autorize o acesso nas configurações do navegador e tente novamente.',
    errorNoCamera: 'Nenhuma câmera foi encontrada. Conecte ou ative uma câmera e tente novamente.',
    errorCameraUnreadable: 'Não foi possível abrir a câmera. Ela pode estar em uso por outro aplicativo ou indisponível para o navegador.',
    errorConstraintFailed: 'Não foi possível abrir a câmera selecionada. Escolha outra câmera ou tente novamente.',
    errorStreamEnded: 'O fluxo da câmera foi encerrado. Inicie a câmera novamente para continuar.',
    errorRequestFailed: 'Não foi possível iniciar a câmera. Verifique o acesso à câmera no navegador e tente novamente.',
  },
  de: {
    controlsHeading: 'Steuerung des Webcam-Tests',
    privacy: 'Deine Kamera bleibt auf diesem Gerät. Hardware Inspect zeichnet das Video weder auf noch lädt es hoch.',
    start: 'Kamera starten',
    starting: 'Kamerazugriff wird angefragt…',
    live: 'Kamera aktiv',
    switching: 'Kamera wird gewechselt…',
    stop: 'Kamera stoppen',
    cameraSelect: 'Kamera',
    currentCamera: 'Aktuelle Kamera',
    cameraOptionFallback: 'Kamera',
    streamInfo: 'Vom Browser gemeldete Stream-Informationen',
    resolution: 'Stream-Auflösung',
    frameRate: 'Vom Track gemeldete Bildrate',
    aspectRatio: 'Seitenverhältnis',
    unavailableValue: 'Nicht gemeldet',
    errorApiUnavailable: 'Der Kamerazugriff ist in diesem Browser oder Kontext nicht verfügbar.',
    errorPermissionDenied: 'Die Kameraberechtigung wurde verweigert. Erlaube den Kamerazugriff in den Browsereinstellungen und versuche es erneut.',
    errorNoCamera: 'Keine Kamera gefunden. Schließe eine Kamera an oder aktiviere sie und versuche es erneut.',
    errorCameraUnreadable: 'Die Kamera konnte nicht geöffnet werden. Sie wird möglicherweise von einer anderen App verwendet oder ist für den Browser nicht verfügbar.',
    errorConstraintFailed: 'Die ausgewählte Kamera konnte nicht geöffnet werden. Wähle eine andere Kamera oder versuche es erneut.',
    errorStreamEnded: 'Der Kamerastream wurde beendet. Starte die Kamera erneut, um fortzufahren.',
    errorRequestFailed: 'Die Kamera konnte nicht gestartet werden. Prüfe den Kamerazugriff des Browsers und versuche es erneut.',
  },
  fr: {
    controlsHeading: 'Commandes du test de webcam',
    privacy: 'Votre caméra reste sur cet appareil. Hardware Inspect n’enregistre ni ne téléverse la vidéo.',
    start: 'Démarrer la caméra',
    starting: 'Demande d’accès à la caméra…',
    live: 'Caméra active',
    switching: 'Changement de caméra…',
    stop: 'Arrêter la caméra',
    cameraSelect: 'Caméra',
    currentCamera: 'Caméra actuelle',
    cameraOptionFallback: 'Caméra',
    streamInfo: 'Informations du flux rapportées par le navigateur',
    resolution: 'Résolution du flux',
    frameRate: 'Fréquence d’images rapportée par la piste',
    aspectRatio: 'Format d’image',
    unavailableValue: 'Non rapporté',
    errorApiUnavailable: 'L’accès à la caméra n’est pas disponible dans ce navigateur ou ce contexte.',
    errorPermissionDenied: 'L’autorisation de la caméra a été refusée. Autorisez l’accès dans les réglages du navigateur puis réessayez.',
    errorNoCamera: 'Aucune caméra n’a été trouvée. Connectez ou activez une caméra puis réessayez.',
    errorCameraUnreadable: 'La caméra n’a pas pu être ouverte. Elle est peut-être utilisée par une autre application ou indisponible pour le navigateur.',
    errorConstraintFailed: 'La caméra sélectionnée n’a pas pu être ouverte. Choisissez une autre caméra ou réessayez.',
    errorStreamEnded: 'Le flux de la caméra s’est arrêté. Redémarrez la caméra pour continuer.',
    errorRequestFailed: 'La caméra n’a pas pu démarrer. Vérifiez l’accès à la caméra dans le navigateur et réessayez.',
  },
  es: {
    controlsHeading: 'Controles de la prueba de webcam',
    privacy: 'Tu cámara permanece en este dispositivo. Hardware Inspect no graba ni sube el vídeo.',
    start: 'Iniciar Cámara',
    starting: 'Solicitando acceso a la cámara…',
    live: 'Cámara activa',
    switching: 'Cambiando cámara…',
    stop: 'Detener Cámara',
    cameraSelect: 'Cámara',
    currentCamera: 'Cámara actual',
    cameraOptionFallback: 'Cámara',
    streamInfo: 'Información del flujo reportada por el navegador',
    resolution: 'Resolución del flujo',
    frameRate: 'Frecuencia de fotogramas reportada por la pista',
    aspectRatio: 'Relación de aspecto',
    unavailableValue: 'No reportado',
    errorApiUnavailable: 'El acceso a la cámara no está disponible en este navegador o contexto.',
    errorPermissionDenied: 'Se denegó el permiso de la cámara. Permite el acceso en la configuración del navegador e inténtalo de nuevo.',
    errorNoCamera: 'No se encontró ninguna cámara. Conecta o habilita una cámara e inténtalo de nuevo.',
    errorCameraUnreadable: 'No se pudo abrir la cámara. Puede estar en uso por otra aplicación o no estar disponible para el navegador.',
    errorConstraintFailed: 'No se pudo abrir la cámara seleccionada. Elige otra cámara o inténtalo de nuevo.',
    errorStreamEnded: 'El flujo de la cámara terminó. Inicia la cámara de nuevo para continuar.',
    errorRequestFailed: 'No se pudo iniciar la cámara. Revisa el acceso a la cámara en el navegador e inténtalo de nuevo.',
  },
  ru: {
    controlsHeading: 'Управление проверкой веб-камеры',
    privacy: 'Видео с камеры остаётся на этом устройстве. Hardware Inspect не записывает и не загружает его.',
    start: 'Запустить камеру',
    starting: 'Запрашиваем доступ к камере…',
    live: 'Камера работает',
    switching: 'Переключаем камеру…',
    stop: 'Остановить камеру',
    cameraSelect: 'Камера',
    currentCamera: 'Текущая камера',
    cameraOptionFallback: 'Камера',
    streamInfo: 'Данные потока, сообщаемые браузером',
    resolution: 'Разрешение потока',
    frameRate: 'Частота кадров по данным видеотрека',
    aspectRatio: 'Соотношение сторон',
    unavailableValue: 'Не сообщается',
    errorApiUnavailable: 'Доступ к камере недоступен в этом браузере или контексте.',
    errorPermissionDenied: 'Доступ к камере запрещён. Разрешите его в настройках браузера и попробуйте снова.',
    errorNoCamera: 'Камера не найдена. Подключите или включите камеру и попробуйте снова.',
    errorCameraUnreadable: 'Не удалось открыть камеру. Возможно, её использует другое приложение или браузер не может получить к ней доступ.',
    errorConstraintFailed: 'Не удалось открыть выбранную камеру. Выберите другую или попробуйте снова.',
    errorStreamEnded: 'Видеопоток камеры завершился. Запустите камеру снова, чтобы продолжить.',
    errorRequestFailed: 'Не удалось запустить камеру. Проверьте доступ к камере в браузере и попробуйте снова.',
  },
} as const satisfies Record<Locale, WebcamRuntimeMessages>;

export const getWebcamRuntimeMessages = (locale: Locale): WebcamRuntimeMessages => webcamRuntimeByLocale[locale];
