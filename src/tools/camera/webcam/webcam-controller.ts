import {
  CameraServiceError,
  createCameraService,
  type CameraDevice,
  type CameraErrorCode,
  type CameraService,
} from '../../../browser/camera-service';
import type { WebcamRuntimeMessages } from '../../../i18n/runtime/webcam';

export interface WebcamController {
  stop(): void;
  destroy(): void;
}

const query = <T extends Element>(root: HTMLElement, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing webcam test element: ${selector}`);
  return element;
};

const errorMessage = (messages: WebcamRuntimeMessages, code: CameraErrorCode): string => {
  switch (code) {
    case 'api-unavailable': return messages.errorApiUnavailable;
    case 'permission-denied': return messages.errorPermissionDenied;
    case 'no-camera': return messages.errorNoCamera;
    case 'camera-unreadable': return messages.errorCameraUnreadable;
    case 'constraint-failed': return messages.errorConstraintFailed;
    case 'stream-ended': return messages.errorStreamEnded;
    case 'request-failed': return messages.errorRequestFailed;
  }
};

const normalizeControllerErrorCode = (error: unknown): CameraErrorCode =>
  error instanceof CameraServiceError ? error.code : 'request-failed';

const formatDimension = (width: number | undefined, height: number | undefined, fallback: string): string =>
  Number.isFinite(width) && Number.isFinite(height) && (width ?? 0) > 0 && (height ?? 0) > 0
    ? `${Math.round(width as number)} × ${Math.round(height as number)} px`
    : fallback;

const formatFrameRate = (frameRate: number | undefined, fallback: string): string =>
  Number.isFinite(frameRate) && (frameRate ?? 0) > 0
    ? `${Number((frameRate as number).toFixed(2))} fps`
    : fallback;

const formatAspectRatio = (
  aspectRatio: number | undefined,
  width: number | undefined,
  height: number | undefined,
  fallback: string,
): string => {
  const reported = Number.isFinite(aspectRatio) && (aspectRatio ?? 0) > 0 ? aspectRatio : undefined;
  const derived = !reported && Number.isFinite(width) && Number.isFinite(height) && (height ?? 0) > 0
    ? (width as number) / (height as number)
    : undefined;
  const ratio = reported ?? derived;
  return ratio && Number.isFinite(ratio) ? `${Number(ratio.toFixed(3))}:1` : fallback;
};

export const mountWebcamTest = (
  root: HTMLElement,
  messages: WebcamRuntimeMessages,
  serviceFactory: (onStreamEnded: (error: CameraServiceError) => void) => CameraService = (onStreamEnded) =>
    createCameraService({ onStreamEnded }),
): WebcamController => {
  const video = query<HTMLVideoElement>(root, '[data-webcam-video]');
  const startButton = query<HTMLButtonElement>(root, '[data-webcam-start]');
  const stopButton = query<HTMLButtonElement>(root, '[data-webcam-stop]');
  const status = query<HTMLElement>(root, '[data-webcam-status]');
  const preview = query<HTMLElement>(root, '[data-webcam-preview]');
  const details = query<HTMLElement>(root, '[data-webcam-details]');
  const cameraName = query<HTMLElement>(root, '[data-webcam-camera-name]');
  const cameraSelectRow = query<HTMLElement>(root, '[data-webcam-select-row]');
  const cameraSelect = query<HTMLSelectElement>(root, '[data-webcam-select]');
  const resolution = query<HTMLElement>(root, '[data-webcam-resolution]');
  const frameRate = query<HTMLElement>(root, '[data-webcam-frame-rate]');
  const aspectRatio = query<HTMLElement>(root, '[data-webcam-aspect-ratio]');

  let active = false;
  let busy = false;
  let destroyed = false;
  let operationVersion = 0;
  let devices: readonly CameraDevice[] = [];

  const beginOperation = (): number => {
    operationVersion += 1;
    return operationVersion;
  };

  const isCurrentOperation = (version: number): boolean =>
    !destroyed && operationVersion === version;

  const setStatus = (text: string, state: 'idle' | 'working' | 'live' | 'error'): void => {
    status.textContent = text;
    root.dataset.state = state;
  };

  const setControls = (): void => {
    startButton.hidden = active || busy;
    stopButton.hidden = !active;
    stopButton.disabled = false;
    cameraSelect.disabled = busy;
  };

  const clearStreamUi = (): void => {
    video.pause();
    video.srcObject = null;
    preview.hidden = true;
    details.hidden = true;
    cameraSelectRow.hidden = true;
    cameraSelect.replaceChildren();
    devices = [];
    cameraName.textContent = messages.currentCamera;
    resolution.textContent = messages.unavailableValue;
    frameRate.textContent = messages.unavailableValue;
    aspectRatio.textContent = messages.unavailableValue;
  };

  const currentDeviceLabel = (settings: MediaTrackSettings): string => {
    if (!settings.deviceId) return messages.currentCamera;
    const device = devices.find((candidate) => candidate.deviceId === settings.deviceId);
    return device?.label || messages.currentCamera;
  };

  const renderSettings = (service: CameraService): void => {
    const settings = service.getSettings();
    if (!settings) return;
    cameraName.textContent = currentDeviceLabel(settings);
    resolution.textContent = formatDimension(settings.width, settings.height, messages.unavailableValue);
    frameRate.textContent = formatFrameRate(settings.frameRate, messages.unavailableValue);
    aspectRatio.textContent = formatAspectRatio(
      settings.aspectRatio,
      settings.width,
      settings.height,
      messages.unavailableValue,
    );
    details.hidden = false;
  };

  const renderDeviceOptions = (settings: MediaTrackSettings | null): void => {
    cameraSelect.replaceChildren();
    devices.forEach((device, index) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.textContent = device.label || `${messages.cameraOptionFallback} ${index + 1}`;
      if (settings?.deviceId && settings.deviceId === device.deviceId) option.selected = true;
      cameraSelect.append(option);
    });
    cameraSelectRow.hidden = devices.length <= 1;
  };

  const attachStream = (stream: MediaStream): void => {
    video.srcObject = stream;
    preview.hidden = false;
    void video.play().catch(() => {
      // The stream is still valid if autoplay policy delays playback; the element remains available.
    });
  };

  const handleStreamEnded = (error: CameraServiceError): void => {
    if (destroyed) return;
    beginOperation();
    active = false;
    busy = false;
    clearStreamUi();
    setStatus(errorMessage(messages, error.code), 'error');
    setControls();
  };

  const service = serviceFactory(handleStreamEnded);

  const refreshDeviceOptions = async (version: number): Promise<void> => {
    const nextDevices = await service.listVideoDevices();
    if (!isCurrentOperation(version) || !active) return;

    devices = nextDevices;
    const settings = service.getSettings();
    renderDeviceOptions(settings);
    renderSettings(service);
  };

  const showLiveStream = (stream: MediaStream): void => {
    attachStream(stream);
    renderSettings(service);
  };

  const handleStart = async (): Promise<void> => {
    if (destroyed || busy || active) return;
    const version = beginOperation();
    busy = true;
    setStatus(messages.starting, 'working');
    setControls();

    try {
      const stream = await service.start();
      if (!isCurrentOperation(version)) return;

      active = true;
      busy = false;
      showLiveStream(stream);
      setStatus(messages.live, 'live');
      setControls();
      void refreshDeviceOptions(version);
    } catch (error) {
      if (!isCurrentOperation(version)) return;
      active = false;
      busy = false;
      clearStreamUi();
      setStatus(errorMessage(messages, normalizeControllerErrorCode(error)), 'error');
      setControls();
    }
  };

  const handleStop = (): void => {
    if (destroyed) return;
    beginOperation();
    service.stop();
    active = false;
    busy = false;
    clearStreamUi();
    setStatus(messages.privacy, 'idle');
    setControls();
  };

  const handleDeviceChange = async (): Promise<void> => {
    const deviceId = cameraSelect.value;
    if (destroyed || busy || !active || !deviceId) return;
    const version = beginOperation();
    busy = true;
    setStatus(messages.switching, 'working');
    setControls();

    try {
      const stream = await service.switchDevice(deviceId);
      if (!isCurrentOperation(version)) return;

      busy = false;
      showLiveStream(stream);
      setStatus(messages.live, 'live');
      setControls();
      void refreshDeviceOptions(version);
    } catch (error) {
      if (!isCurrentOperation(version)) return;
      busy = false;
      // CameraService keeps the previous stream alive when replacement acquisition fails.
      renderDeviceOptions(service.getSettings());
      renderSettings(service);
      setStatus(errorMessage(messages, normalizeControllerErrorCode(error)), 'error');
      setControls();
    }
  };

  const onStart = (): void => { void handleStart(); };
  const onDeviceChange = (): void => { void handleDeviceChange(); };

  startButton.addEventListener('click', onStart);
  stopButton.addEventListener('click', handleStop);
  cameraSelect.addEventListener('change', onDeviceChange);
  clearStreamUi();
  setStatus(messages.privacy, 'idle');
  setControls();

  return {
    stop: handleStop,
    destroy: () => {
      if (destroyed) return;
      operationVersion += 1;
      destroyed = true;
      startButton.removeEventListener('click', onStart);
      stopButton.removeEventListener('click', handleStop);
      cameraSelect.removeEventListener('change', onDeviceChange);
      service.destroy();
      video.pause();
      video.srcObject = null;
    },
  };
};
