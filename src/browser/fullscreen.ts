export type FullscreenUnsubscribe = () => void;

export interface FullscreenEnvironment {
  isEnabled(): boolean;
  getFullscreenElement(): Element | null;
  request(element: HTMLElement): Promise<void>;
  exit(): Promise<void>;
  setChangeListener(listener: (() => void) | null): void;
}

export interface FullscreenHelper {
  isSupported(): boolean;
  getActiveElement(): Element | null;
  request(element: HTMLElement): Promise<boolean>;
  exit(): Promise<boolean>;
  subscribe(listener: () => void): FullscreenUnsubscribe;
  destroy(): void;
}

export const createBrowserFullscreenEnvironment = (): FullscreenEnvironment | null => {
  if (typeof document === 'undefined') return null;

  let changeListener: (() => void) | null = null;

  return {
    isEnabled: () => Boolean(document.fullscreenEnabled),
    getFullscreenElement: () => document.fullscreenElement,
    request: async (element) => {
      if (typeof element.requestFullscreen !== 'function') throw new Error('Fullscreen unavailable');
      await element.requestFullscreen();
    },
    exit: async () => {
      if (typeof document.exitFullscreen !== 'function') throw new Error('Fullscreen unavailable');
      await document.exitFullscreen();
    },
    setChangeListener: (listener) => {
      if (changeListener) document.removeEventListener('fullscreenchange', changeListener);
      changeListener = listener;
      if (changeListener) document.addEventListener('fullscreenchange', changeListener);
    },
  };
};

export const createFullscreenHelper = (
  environment: FullscreenEnvironment | null = createBrowserFullscreenEnvironment(),
): FullscreenHelper => {
  const listeners = new Set<() => void>();
  let destroyed = false;
  let listening = false;

  const syncListener = (): void => {
    if (!environment) return;
    const shouldListen = !destroyed && listeners.size > 0;
    if (shouldListen === listening) return;
    environment.setChangeListener(shouldListen ? () => listeners.forEach((listener) => listener()) : null);
    listening = shouldListen;
  };

  const helper: FullscreenHelper = {
    isSupported: () => !destroyed && Boolean(environment?.isEnabled()),
    getActiveElement: () => environment?.getFullscreenElement() ?? null,
    request: async (element) => {
      if (destroyed || !environment?.isEnabled()) return false;
      try {
        await environment.request(element);
        return environment.getFullscreenElement() === element;
      } catch {
        return false;
      }
    },
    exit: async () => {
      if (destroyed || !environment) return false;
      if (environment.getFullscreenElement() === null) return true;
      try {
        await environment.exit();
        return environment.getFullscreenElement() === null;
      } catch {
        return false;
      }
    },
    subscribe: (listener) => {
      if (destroyed) return () => undefined;
      listeners.add(listener);
      syncListener();
      return () => {
        listeners.delete(listener);
        syncListener();
      };
    },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      listeners.clear();
      syncListener();
    },
  };

  return helper;
};
