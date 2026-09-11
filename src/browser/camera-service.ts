export type CameraErrorCode =
  | 'api-unavailable'
  | 'permission-denied'
  | 'no-camera'
  | 'camera-unreadable'
  | 'constraint-failed'
  | 'stream-ended'
  | 'request-failed';

export class CameraServiceError extends Error {
  readonly code: CameraErrorCode;

  constructor(code: CameraErrorCode) {
    super(code);
    this.name = 'CameraServiceError';
    this.code = code;
  }
}

export interface CameraDevice {
  readonly deviceId: string;
  readonly label: string;
}

export interface CameraServiceEnvironment {
  getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
  enumerateDevices(): Promise<readonly MediaDeviceInfo[]>;
}

export interface CameraServiceOptions {
  readonly environment?: CameraServiceEnvironment | null;
  readonly onStreamEnded?: (error: CameraServiceError) => void;
}

export interface CameraService {
  start(deviceId?: string): Promise<MediaStream>;
  listVideoDevices(): Promise<readonly CameraDevice[]>;
  switchDevice(deviceId: string): Promise<MediaStream>;
  getSettings(): MediaTrackSettings | null;
  stop(): void;
  destroy(): void;
}

interface NamedErrorLike {
  readonly name?: unknown;
}

const errorName = (error: unknown): string => {
  if (!error || typeof error !== 'object') return '';
  const name = (error as NamedErrorLike).name;
  return typeof name === 'string' ? name : '';
};

export const normalizeCameraError = (error: unknown): CameraServiceError => {
  if (error instanceof CameraServiceError) return error;

  switch (errorName(error)) {
    case 'NotAllowedError':
    case 'SecurityError':
      return new CameraServiceError('permission-denied');
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return new CameraServiceError('no-camera');
    case 'NotReadableError':
    case 'TrackStartError':
    case 'AbortError':
      return new CameraServiceError('camera-unreadable');
    case 'OverconstrainedError':
    case 'ConstraintNotSatisfiedError':
      return new CameraServiceError('constraint-failed');
    default:
      return new CameraServiceError('request-failed');
  }
};

export const createBrowserCameraEnvironment = (): CameraServiceEnvironment | null => {
  if (
    typeof navigator === 'undefined' ||
    !navigator.mediaDevices ||
    typeof navigator.mediaDevices.getUserMedia !== 'function'
  ) {
    return null;
  }

  return {
    getUserMedia: (constraints) => navigator.mediaDevices.getUserMedia(constraints),
    enumerateDevices: () =>
      typeof navigator.mediaDevices.enumerateDevices === 'function'
        ? navigator.mediaDevices.enumerateDevices()
        : Promise.resolve([]),
  };
};

const stopStreamTracks = (stream: MediaStream | null): void => {
  stream?.getTracks().forEach((track) => track.stop());
};

export const createCameraService = (options: CameraServiceOptions = {}): CameraService => {
  const environment = options.environment === undefined
    ? createBrowserCameraEnvironment()
    : options.environment;

  let activeStream: MediaStream | null = null;
  let activeTrack: MediaStreamTrack | null = null;
  let operationVersion = 0;
  let destroyed = false;

  const handleTrackEnded = (): void => {
    if (!activeStream || !activeTrack) return;
    operationVersion += 1;
    const endedStream = activeStream;
    activeTrack.removeEventListener('ended', handleTrackEnded);
    activeStream = null;
    activeTrack = null;
    stopStreamTracks(endedStream);
    options.onStreamEnded?.(new CameraServiceError('stream-ended'));
  };

  const replaceActiveStream = (stream: MediaStream, track: MediaStreamTrack): void => {
    const previousStream = activeStream;
    const previousTrack = activeTrack;

    activeStream = stream;
    activeTrack = track;
    activeTrack.addEventListener('ended', handleTrackEnded);

    previousTrack?.removeEventListener('ended', handleTrackEnded);
    stopStreamTracks(previousStream);
  };

  const acquire = async (deviceId?: string): Promise<MediaStream> => {
    if (destroyed || !environment) throw new CameraServiceError('api-unavailable');

    const requestVersion = ++operationVersion;
    const video: boolean | MediaTrackConstraints = deviceId
      ? { deviceId: { exact: deviceId } }
      : true;

    let stream: MediaStream;
    try {
      stream = await environment.getUserMedia({ video, audio: false });
    } catch (error) {
      throw normalizeCameraError(error);
    }

    if (destroyed || requestVersion !== operationVersion) {
      stopStreamTracks(stream);
      throw new CameraServiceError('request-failed');
    }

    const track = stream.getVideoTracks()[0];
    if (!track) {
      stopStreamTracks(stream);
      throw new CameraServiceError('no-camera');
    }

    replaceActiveStream(stream, track);
    return stream;
  };

  const service: CameraService = {
    start: (deviceId) => acquire(deviceId),
    listVideoDevices: async () => {
      if (destroyed || !environment) return [];
      try {
        const devices = await environment.enumerateDevices();
        return devices
          .filter((device) => device.kind === 'videoinput')
          .map((device) => ({ deviceId: device.deviceId, label: device.label }));
      } catch {
        // Enumeration is optional after a successful one-camera flow.
        return [];
      }
    },
    switchDevice: (deviceId) => acquire(deviceId),
    getSettings: () => activeTrack?.getSettings() ?? null,
    stop: () => {
      operationVersion += 1;
      activeTrack?.removeEventListener('ended', handleTrackEnded);
      const stream = activeStream;
      activeStream = null;
      activeTrack = null;
      stopStreamTracks(stream);
    },
    destroy: () => {
      if (destroyed) return;
      service.stop();
      destroyed = true;
    },
  };

  return service;
};
