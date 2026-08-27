export type Unsubscribe = () => void;

export type KeyboardInputServiceEvent =
  | { type: 'keydown'; code: string; key: string; repeat: boolean }
  | { type: 'keyup'; code: string; key: string }
  | { type: 'clear'; reason: 'blur' | 'visibility-hidden' };

export interface KeyboardInputServiceEnvironment {
  setKeydownListener(
    listener: ((code: string, key: string, repeat: boolean) => void) | null,
  ): void;
  setKeyupListener(listener: ((code: string, key: string) => void) | null): void;
  setBlurListener(listener: (() => void) | null): void;
  setVisibilityListener(listener: (() => void) | null): void;
  getVisibilityState(): DocumentVisibilityState;
}

export interface KeyboardInputService {
  start(): boolean;
  stop(): void;
  destroy(): void;
  subscribe(listener: (event: KeyboardInputServiceEvent) => void): Unsubscribe;
}

const createBrowserEnvironment = (): KeyboardInputServiceEnvironment | null => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  let keydownWrapper: ((event: KeyboardEvent) => void) | null = null;
  let keyupWrapper: ((event: KeyboardEvent) => void) | null = null;
  let blurWrapper: (() => void) | null = null;
  let visibilityWrapper: (() => void) | null = null;

  return {
    setKeydownListener: (listener) => {
      if (keydownWrapper) {
        window.removeEventListener('keydown', keydownWrapper);
        keydownWrapper = null;
      }
      if (listener) {
        keydownWrapper = (event) => listener(event.code, event.key, event.repeat);
        window.addEventListener('keydown', keydownWrapper);
      }
    },
    setKeyupListener: (listener) => {
      if (keyupWrapper) {
        window.removeEventListener('keyup', keyupWrapper);
        keyupWrapper = null;
      }
      if (listener) {
        keyupWrapper = (event) => listener(event.code, event.key);
        window.addEventListener('keyup', keyupWrapper);
      }
    },
    setBlurListener: (listener) => {
      if (blurWrapper) {
        window.removeEventListener('blur', blurWrapper);
        blurWrapper = null;
      }
      if (listener) {
        blurWrapper = listener;
        window.addEventListener('blur', blurWrapper);
      }
    },
    setVisibilityListener: (listener) => {
      if (visibilityWrapper) {
        document.removeEventListener('visibilitychange', visibilityWrapper);
        visibilityWrapper = null;
      }
      if (listener) {
        visibilityWrapper = listener;
        document.addEventListener('visibilitychange', visibilityWrapper);
      }
    },
    getVisibilityState: () => document.visibilityState,
  };
};

export const createKeyboardInputService = (
  environment: KeyboardInputServiceEnvironment | null = createBrowserEnvironment(),
): KeyboardInputService => {
  const listeners = new Set<(event: KeyboardInputServiceEvent) => void>();
  let started = false;
  let destroyed = false;

  const emit = (event: KeyboardInputServiceEvent): void => {
    listeners.forEach((listener) => listener(event));
  };

  const clearRuntimeListeners = (): void => {
    if (!environment) {
      return;
    }
    environment.setKeydownListener(null);
    environment.setKeyupListener(null);
    environment.setBlurListener(null);
    environment.setVisibilityListener(null);
  };

  const service: KeyboardInputService = {
    start: () => {
      if (destroyed || environment === null) {
        return false;
      }
      if (started) {
        return true;
      }

      started = true;
      environment.setKeydownListener((code, key, repeat) => {
        if (started && !destroyed) {
          emit({ type: 'keydown', code, key, repeat });
        }
      });
      environment.setKeyupListener((code, key) => {
        if (started && !destroyed) {
          emit({ type: 'keyup', code, key });
        }
      });
      environment.setBlurListener(() => {
        if (started && !destroyed) {
          emit({ type: 'clear', reason: 'blur' });
        }
      });
      environment.setVisibilityListener(() => {
        if (
          started &&
          !destroyed &&
          environment.getVisibilityState() !== 'visible'
        ) {
          emit({ type: 'clear', reason: 'visibility-hidden' });
        }
      });
      return true;
    },

    stop: () => {
      if (!started) {
        return;
      }
      started = false;
      clearRuntimeListeners();
    },

    destroy: () => {
      if (destroyed) {
        return;
      }
      service.stop();
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

  return service;
};
