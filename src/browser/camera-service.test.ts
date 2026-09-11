import { describe, expect, it, vi } from 'vitest';

import {
  CameraServiceError,
  createCameraService,
  normalizeCameraError,
  type CameraServiceEnvironment,
} from './camera-service';

interface FakeTrack {
  readonly track: MediaStreamTrack;
  readonly stop: ReturnType<typeof vi.fn>;
  end(): void;
}

const createFakeTrack = (settings: MediaTrackSettings = {}): FakeTrack => {
  const listeners = new Set<() => void>();
  const stop = vi.fn();
  const track = {
    stop,
    getSettings: () => settings,
    addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
      if (type === 'ended' && typeof listener === 'function') listeners.add(listener as () => void);
    },
    removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
      if (type === 'ended' && typeof listener === 'function') listeners.delete(listener as () => void);
    },
  } as unknown as MediaStreamTrack;

  return {
    track,
    stop,
    end: () => listeners.forEach((listener) => listener()),
  };
};

const createFakeStream = (videoTrack: FakeTrack, extraTracks: readonly MediaStreamTrack[] = []): MediaStream => ({
  getVideoTracks: () => [videoTrack.track],
  getTracks: () => [videoTrack.track, ...extraTracks],
} as unknown as MediaStream);

const createEnvironment = (
  getUserMedia: CameraServiceEnvironment['getUserMedia'],
  devices: readonly MediaDeviceInfo[] = [],
): CameraServiceEnvironment => ({
  getUserMedia,
  enumerateDevices: async () => devices,
});

describe('CameraService', () => {
  it('requests video only and exposes browser-reported track settings', async () => {
    const fakeTrack = createFakeTrack({ width: 1280, height: 720, frameRate: 30, aspectRatio: 16 / 9 });
    const stream = createFakeStream(fakeTrack);
    const getUserMedia = vi.fn(async () => stream);
    const service = createCameraService({ environment: createEnvironment(getUserMedia) });

    await expect(service.start()).resolves.toBe(stream);
    expect(getUserMedia).toHaveBeenCalledWith({ video: true, audio: false });
    expect(service.getSettings()).toMatchObject({ width: 1280, height: 720, frameRate: 30 });

    service.stop();
    expect(fakeTrack.stop).toHaveBeenCalledTimes(1);
  });

  it('acquires a replacement before stopping the previous stream when switching devices', async () => {
    const firstTrack = createFakeTrack({ deviceId: 'first' });
    const secondTrack = createFakeTrack({ deviceId: 'second' });
    const streams = [createFakeStream(firstTrack), createFakeStream(secondTrack)];
    let callIndex = 0;
    const getUserMedia = vi.fn(async () => streams[callIndex++] as MediaStream);
    const service = createCameraService({ environment: createEnvironment(getUserMedia) });

    await service.start();
    expect(firstTrack.stop).not.toHaveBeenCalled();

    await expect(service.switchDevice('second')).resolves.toBe(streams[1]);
    expect(getUserMedia).toHaveBeenLastCalledWith({
      video: { deviceId: { exact: 'second' } },
      audio: false,
    });
    expect(firstTrack.stop).toHaveBeenCalledTimes(1);
    expect(secondTrack.stop).not.toHaveBeenCalled();

    service.destroy();
    expect(secondTrack.stop).toHaveBeenCalledTimes(1);
  });

  it('keeps the current stream alive when a device switch fails', async () => {
    const firstTrack = createFakeTrack({ deviceId: 'first' });
    const firstStream = createFakeStream(firstTrack);
    let callIndex = 0;
    const getUserMedia = vi.fn(async () => {
      callIndex += 1;
      if (callIndex === 1) return firstStream;
      throw { name: 'OverconstrainedError' };
    });
    const service = createCameraService({ environment: createEnvironment(getUserMedia) });

    await service.start();
    await expect(service.switchDevice('missing')).rejects.toMatchObject({ code: 'constraint-failed' });
    expect(firstTrack.stop).not.toHaveBeenCalled();
    expect(service.getSettings()).toMatchObject({ deviceId: 'first' });
  });

  it('cannot resurrect a stream that resolves after stop', async () => {
    const track = createFakeTrack({ deviceId: 'late' });
    const stream = createFakeStream(track);
    let resolveStream: ((stream: MediaStream) => void) | undefined;
    const getUserMedia = vi.fn(() => new Promise<MediaStream>((resolve) => {
      resolveStream = resolve;
    }));
    const service = createCameraService({ environment: createEnvironment(getUserMedia) });

    const pendingStart = service.start();
    service.stop();
    resolveStream?.(stream);

    await expect(pendingStart).rejects.toMatchObject({ code: 'request-failed' });
    expect(track.stop).toHaveBeenCalledTimes(1);
    expect(service.getSettings()).toBeNull();
  });

  it('cannot resurrect a stream that resolves after destroy', async () => {
    const track = createFakeTrack({ deviceId: 'late' });
    const stream = createFakeStream(track);
    let resolveStream: ((stream: MediaStream) => void) | undefined;
    const getUserMedia = vi.fn(() => new Promise<MediaStream>((resolve) => {
      resolveStream = resolve;
    }));
    const service = createCameraService({ environment: createEnvironment(getUserMedia) });

    const pendingStart = service.start();
    service.destroy();
    resolveStream?.(stream);

    await expect(pendingStart).rejects.toMatchObject({ code: 'request-failed' });
    expect(track.stop).toHaveBeenCalledTimes(1);
    expect(service.getSettings()).toBeNull();
  });

  it('stops every active stream track and normalizes unexpected stream ending', async () => {
    const videoTrack = createFakeTrack();
    const extraStop = vi.fn();
    const extraTrack = { stop: extraStop } as unknown as MediaStreamTrack;
    const stream = createFakeStream(videoTrack, [extraTrack]);
    const onStreamEnded = vi.fn();
    const service = createCameraService({
      environment: createEnvironment(async () => stream),
      onStreamEnded,
    });

    await service.start();
    videoTrack.end();

    expect(videoTrack.stop).toHaveBeenCalledTimes(1);
    expect(extraStop).toHaveBeenCalledTimes(1);
    expect(service.getSettings()).toBeNull();
    expect(onStreamEnded).toHaveBeenCalledWith(expect.objectContaining({ code: 'stream-ended' }));
  });

  it('allows limited enumeration and filters video inputs when enumeration is available', async () => {
    const track = createFakeTrack();
    const videoDevice = { kind: 'videoinput', deviceId: 'cam-1', label: 'Front Camera' } as MediaDeviceInfo;
    const audioDevice = { kind: 'audioinput', deviceId: 'mic-1', label: 'Microphone' } as MediaDeviceInfo;
    const service = createCameraService({
      environment: createEnvironment(async () => createFakeStream(track), [videoDevice, audioDevice]),
    });

    await expect(service.listVideoDevices()).resolves.toEqual([
      { deviceId: 'cam-1', label: 'Front Camera' },
    ]);
  });
});

describe('normalizeCameraError', () => {
  it.each([
    ['NotAllowedError', 'permission-denied'],
    ['SecurityError', 'permission-denied'],
    ['NotFoundError', 'no-camera'],
    ['NotReadableError', 'camera-unreadable'],
    ['AbortError', 'camera-unreadable'],
    ['OverconstrainedError', 'constraint-failed'],
    ['UnknownError', 'request-failed'],
  ] as const)('maps %s to %s', (name, code) => {
    expect(normalizeCameraError({ name })).toEqual(expect.objectContaining({ code }));
  });

  it('preserves normalized service errors', () => {
    const error = new CameraServiceError('api-unavailable');
    expect(normalizeCameraError(error)).toBe(error);
  });
});
