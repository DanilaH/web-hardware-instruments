export type Unsubscribe = () => void;

export type FrameSamplerEvent =
  | { type: 'sample'; timestamp: number }
  | { type: 'reset' };

export interface FrameSamplerEnvironment {
  requestFrame(callback: FrameRequestCallback): number;
  cancelFrame(handle: number): void;
  getVisibilityState(): DocumentVisibilityState;
  addVisibilityListener(listener: () => void): void;
  removeVisibilityListener(listener: () => void): void;
}

export interface FrameSampler {
  start(): boolean;
  stop(): void;
  destroy(): void;
  subscribe(listener: (event: FrameSamplerEvent) => void): Unsubscribe;
}

const createBrowserEnvironment = (): FrameSamplerEnvironment | null => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  if (
    typeof window.requestAnimationFrame !== 'function' ||
    typeof window.cancelAnimationFrame !== 'function'
  ) {
    return null;
  }

  return {
    requestFrame: (callback) => window.requestAnimationFrame(callback),
    cancelFrame: (handle) => window.cancelAnimationFrame(handle),
    getVisibilityState: () => document.visibilityState,
    addVisibilityListener: (listener) => document.addEventListener('visibilitychange', listener),
    removeVisibilityListener: (listener) => document.removeEventListener('visibilitychange', listener),
  };
};

export const createFrameSampler = (
  environment: FrameSamplerEnvironment | null = createBrowserEnvironment(),
): FrameSampler => {
  const listeners = new Set<(event: FrameSamplerEvent) => void>();
  let started = false;
  let destroyed = false;
  let frameHandle: number | null = null;
  let lastVisibility: DocumentVisibilityState | null = null;

  const emit = (event: FrameSamplerEvent): void => {
    listeners.forEach((listener) => listener(event));
  };

  const cancelSampling = (): void => {
    if (environment === null || frameHandle === null) {
      return;
    }

    environment.cancelFrame(frameHandle);
    frameHandle = null;
  };

  const scheduleSample = (): void => {
    if (
      environment === null ||
      !started ||
      destroyed ||
      lastVisibility !== 'visible' ||
      frameHandle !== null
    ) {
      return;
    }

    frameHandle = environment.requestFrame((timestamp) => {
      frameHandle = null;

      if (!started || destroyed) {
        return;
      }

      const visibility = environment.getVisibilityState();
      if (visibility !== 'visible') {
        const wasVisible = lastVisibility === 'visible';
        lastVisibility = visibility;
        cancelSampling();
        if (wasVisible) {
          emit({ type: 'reset' });
        }
        return;
      }

      lastVisibility = visibility;
      if (Number.isFinite(timestamp)) {
        emit({ type: 'sample', timestamp });
      }
      scheduleSample();
    });
  };

  const handleVisibilityChange = (): void => {
    if (environment === null || !started || destroyed) {
      return;
    }

    const visibility = environment.getVisibilityState();
    if (visibility === lastVisibility) {
      return;
    }

    const wasVisible = lastVisibility === 'visible';
    lastVisibility = visibility;

    if (visibility !== 'visible') {
      cancelSampling();
      if (wasVisible) {
        emit({ type: 'reset' });
      }
      return;
    }

    scheduleSample();
  };

  const sampler: FrameSampler = {
    start: () => {
      if (destroyed || started || environment === null) {
        return !destroyed && started && environment !== null;
      }

      started = true;
      lastVisibility = environment.getVisibilityState();
      environment.addVisibilityListener(handleVisibilityChange);
      scheduleSample();
      return true;
    },

    stop: () => {
      if (!started || environment === null) {
        return;
      }

      started = false;
      cancelSampling();
      environment.removeVisibilityListener(handleVisibilityChange);
      lastVisibility = null;
    },

    destroy: () => {
      if (destroyed) {
        return;
      }

      sampler.stop();
      destroyed = true;
      listeners.clear();
    },

    subscribe: (listener) => {
      if (destroyed) {
        return () => undefined;
      }

      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  return sampler;
};
