export type MouseInputProfile = 'basic' | 'polling';
export type MouseSemanticButton = 0 | 1 | 2 | 3 | 4;
export type MousePollingSource = 'raw-pointer' | 'coalesced-pointer' | 'basic-pointer';
export type MouseClearReason = 'blur' | 'visibility-hidden';

export type MouseInputServiceEvent =
  | { type: 'buttondown'; button: MouseSemanticButton; timestamp: number }
  | { type: 'buttonup'; button: MouseSemanticButton; timestamp: number }
  | { type: 'wheel'; deltaX: number; deltaY: number; deltaMode: number; timestamp: number }
  | { type: 'move'; movementX: number; movementY: number; timestamp: number }
  | { type: 'poll-samples'; source: MousePollingSource; timestamps: readonly number[] }
  | { type: 'clear'; reason: MouseClearReason };

export type Unsubscribe = () => void;

type ButtonListener = (button: number, timestamp: number) => void;
type WheelListener = (deltaX: number, deltaY: number, deltaMode: number, timestamp: number) => void;
type MoveListener = (movementX: number, movementY: number, timestamp: number) => void;
type PollingListener = (timestamps: readonly number[]) => void;

export interface MouseInputServiceEnvironment {
  setButtonDownListener(listener: ButtonListener | null): void;
  setButtonUpListener(listener: ButtonListener | null): void;
  setWheelListener(listener: WheelListener | null): void;
  setBasicMoveListener(listener: MoveListener | null): void;
  setRawMoveListener(listener: PollingListener | null): void;
  setCoalescedMoveListener(listener: PollingListener | null): void;
  setContextMenuSuppression(enabled: boolean): void;
  setAuxClickSuppression(enabled: boolean): void;
  setBlurListener(listener: (() => void) | null): void;
  setVisibilityListener(listener: (() => void) | null): void;
  getVisibilityState(): DocumentVisibilityState;
  supportsRawPointerUpdate(): boolean;
  supportsCoalescedPointerEvents(): boolean;
}

export interface MouseInputService {
  start(): boolean;
  stop(): void;
  destroy(): void;
  subscribe(listener: (event: MouseInputServiceEvent) => void): Unsubscribe;
  getPollingSource(): MousePollingSource | null;
}

const isMousePointer = (event: PointerEvent): boolean =>
  event.pointerType === '' || event.pointerType === 'mouse';

const extractCoalescedTimestamps = (event: PointerEvent): readonly number[] => {
  const samples = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [];
  const source = samples.length > 0 ? samples : [event];
  const timestamps: number[] = [];
  let previous: number | null = null;

  for (const sample of source) {
    if (!isMousePointer(sample) || !Number.isFinite(sample.timeStamp) || sample.timeStamp === previous) {
      continue;
    }
    timestamps.push(sample.timeStamp);
    previous = sample.timeStamp;
  }

  return timestamps;
};

export const isMouseSemanticButton = (button: number): button is MouseSemanticButton =>
  Number.isInteger(button) && button >= 0 && button <= 4;

export const createBrowserMouseInputEnvironment = (
  surface: HTMLElement,
): MouseInputServiceEnvironment | null => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  let downWrapper: ((event: PointerEvent | MouseEvent) => void) | null = null;
  let upWrapper: ((event: PointerEvent | MouseEvent) => void) | null = null;
  let wheelWrapper: ((event: WheelEvent) => void) | null = null;
  let basicMoveWrapper: ((event: PointerEvent | MouseEvent) => void) | null = null;
  let rawMoveWrapper: ((event: PointerEvent) => void) | null = null;
  let coalescedMoveWrapper: ((event: PointerEvent) => void) | null = null;
  let contextMenuWrapper: ((event: MouseEvent) => void) | null = null;
  let auxClickWrapper: ((event: MouseEvent) => void) | null = null;
  let blurWrapper: (() => void) | null = null;
  let visibilityWrapper: (() => void) | null = null;

  const usesPointerEvents = typeof window.PointerEvent !== 'undefined';

  const removePointerOrMouseListener = (
    target: EventTarget,
    pointerType: string,
    mouseType: string,
    listener: EventListener,
  ): void => {
    target.removeEventListener(usesPointerEvents ? pointerType : mouseType, listener);
  };

  const addPointerOrMouseListener = (
    target: EventTarget,
    pointerType: string,
    mouseType: string,
    listener: EventListener,
  ): void => {
    target.addEventListener(usesPointerEvents ? pointerType : mouseType, listener);
  };

  return {
    setButtonDownListener: (listener) => {
      if (downWrapper) {
        removePointerOrMouseListener(surface, 'pointerdown', 'mousedown', downWrapper as EventListener);
        downWrapper = null;
      }
      if (!listener) return;

      downWrapper = (event) => {
        if (usesPointerEvents && event instanceof window.PointerEvent && !isMousePointer(event)) {
          return;
        }
        if (event.button !== 0) {
          event.preventDefault();
        }
        listener(event.button, event.timeStamp);
      };
      addPointerOrMouseListener(surface, 'pointerdown', 'mousedown', downWrapper as EventListener);
    },
    setButtonUpListener: (listener) => {
      if (upWrapper) {
        removePointerOrMouseListener(window, 'pointerup', 'mouseup', upWrapper as EventListener);
        upWrapper = null;
      }
      if (!listener) return;

      upWrapper = (event) => {
        if (usesPointerEvents && event instanceof window.PointerEvent && !isMousePointer(event)) {
          return;
        }
        listener(event.button, event.timeStamp);
      };
      addPointerOrMouseListener(window, 'pointerup', 'mouseup', upWrapper as EventListener);
    },
    setWheelListener: (listener) => {
      if (wheelWrapper) {
        surface.removeEventListener('wheel', wheelWrapper);
        wheelWrapper = null;
      }
      if (!listener) return;

      wheelWrapper = (event) => {
        event.preventDefault();
        listener(event.deltaX, event.deltaY, event.deltaMode, event.timeStamp);
      };
      surface.addEventListener('wheel', wheelWrapper, { passive: false });
    },
    setBasicMoveListener: (listener) => {
      if (basicMoveWrapper) {
        removePointerOrMouseListener(surface, 'pointermove', 'mousemove', basicMoveWrapper as EventListener);
        basicMoveWrapper = null;
      }
      if (!listener) return;

      basicMoveWrapper = (event) => {
        if (usesPointerEvents && event instanceof window.PointerEvent && !isMousePointer(event)) {
          return;
        }
        listener(event.movementX, event.movementY, event.timeStamp);
      };
      addPointerOrMouseListener(surface, 'pointermove', 'mousemove', basicMoveWrapper as EventListener);
    },
    setRawMoveListener: (listener) => {
      if (rawMoveWrapper) {
        window.removeEventListener('pointerrawupdate', rawMoveWrapper as EventListener);
        rawMoveWrapper = null;
      }
      if (!listener) return;

      rawMoveWrapper = (event) => {
        if (isMousePointer(event)) {
          listener(extractCoalescedTimestamps(event));
        }
      };
      window.addEventListener('pointerrawupdate', rawMoveWrapper as EventListener);
    },
    setCoalescedMoveListener: (listener) => {
      if (coalescedMoveWrapper) {
        surface.removeEventListener('pointermove', coalescedMoveWrapper);
        coalescedMoveWrapper = null;
      }
      if (!listener) return;

      coalescedMoveWrapper = (event) => {
        if (isMousePointer(event)) {
          listener(extractCoalescedTimestamps(event));
        }
      };
      surface.addEventListener('pointermove', coalescedMoveWrapper);
    },
    setContextMenuSuppression: (enabled) => {
      if (contextMenuWrapper) {
        surface.removeEventListener('contextmenu', contextMenuWrapper);
        contextMenuWrapper = null;
      }
      if (enabled) {
        contextMenuWrapper = (event) => event.preventDefault();
        surface.addEventListener('contextmenu', contextMenuWrapper);
      }
    },
    setAuxClickSuppression: (enabled) => {
      if (auxClickWrapper) {
        surface.removeEventListener('auxclick', auxClickWrapper);
        auxClickWrapper = null;
      }
      if (enabled) {
        auxClickWrapper = (event) => {
          if (event.button >= 1 && event.button <= 4) {
            event.preventDefault();
          }
        };
        surface.addEventListener('auxclick', auxClickWrapper);
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
    supportsRawPointerUpdate: () => usesPointerEvents && 'onpointerrawupdate' in window,
    supportsCoalescedPointerEvents: () =>
      usesPointerEvents && typeof window.PointerEvent.prototype.getCoalescedEvents === 'function',
  };
};

export const createMouseInputService = (
  surface: HTMLElement | null,
  profile: MouseInputProfile = 'basic',
  environment: MouseInputServiceEnvironment | null = surface
    ? createBrowserMouseInputEnvironment(surface)
    : null,
): MouseInputService => {
  const listeners = new Set<(event: MouseInputServiceEvent) => void>();
  let started = false;
  let destroyed = false;
  let pollingSource: MousePollingSource | null = null;

  const emit = (event: MouseInputServiceEvent): void => {
    listeners.forEach((listener) => listener(event));
  };

  const clearRuntimeListeners = (): void => {
    if (!environment) return;
    environment.setButtonDownListener(null);
    environment.setButtonUpListener(null);
    environment.setWheelListener(null);
    environment.setBasicMoveListener(null);
    environment.setRawMoveListener(null);
    environment.setCoalescedMoveListener(null);
    environment.setContextMenuSuppression(false);
    environment.setAuxClickSuppression(false);
    environment.setBlurListener(null);
    environment.setVisibilityListener(null);
    pollingSource = null;
  };

  const emitButton = (type: 'buttondown' | 'buttonup', button: number, timestamp: number): void => {
    if (isMouseSemanticButton(button) && Number.isFinite(timestamp)) {
      emit({ type, button, timestamp });
    }
  };

  const attachPolling = (
    source: MousePollingSource,
    setter: (listener: PollingListener | null) => void,
  ): boolean => {
    try {
      setter((timestamps) => {
        if (!started || destroyed) return;
        const finite = timestamps.filter((timestamp) => Number.isFinite(timestamp));
        if (finite.length > 0) {
          emit({ type: 'poll-samples', source, timestamps: finite });
        }
      });
      pollingSource = source;
      return true;
    } catch {
      try {
        setter(null);
      } catch {
        // The failed source is abandoned before a measurement attempt begins.
      }
      return false;
    }
  };

  const setPollingListener = (): boolean => {
    if (!environment) return false;

    if (
      environment.supportsRawPointerUpdate() &&
      attachPolling('raw-pointer', environment.setRawMoveListener)
    ) {
      return true;
    }
    if (
      environment.supportsCoalescedPointerEvents() &&
      attachPolling('coalesced-pointer', environment.setCoalescedMoveListener)
    ) {
      return true;
    }

    pollingSource = 'basic-pointer';
    environment.setBasicMoveListener((_movementX, _movementY, timestamp) => {
      if (started && !destroyed && Number.isFinite(timestamp)) {
        emit({ type: 'poll-samples', source: 'basic-pointer', timestamps: [timestamp] });
      }
    });
    return true;
  };

  const service: MouseInputService = {
    start: () => {
      if (destroyed || environment === null) return false;
      if (started) return true;

      started = true;
      environment.setButtonDownListener((button, timestamp) => {
        if (started && !destroyed) emitButton('buttondown', button, timestamp);
      });
      environment.setButtonUpListener((button, timestamp) => {
        if (started && !destroyed) emitButton('buttonup', button, timestamp);
      });
      environment.setWheelListener((deltaX, deltaY, deltaMode, timestamp) => {
        if (
          started &&
          !destroyed &&
          [deltaX, deltaY, deltaMode, timestamp].every((value) => Number.isFinite(value))
        ) {
          emit({ type: 'wheel', deltaX, deltaY, deltaMode, timestamp });
        }
      });
      environment.setContextMenuSuppression(true);
      environment.setAuxClickSuppression(true);
      environment.setBlurListener(() => {
        if (started && !destroyed) emit({ type: 'clear', reason: 'blur' });
      });
      environment.setVisibilityListener(() => {
        if (started && !destroyed && environment.getVisibilityState() !== 'visible') {
          emit({ type: 'clear', reason: 'visibility-hidden' });
        }
      });

      if (profile === 'polling') {
        if (!setPollingListener()) {
          service.stop();
          return false;
        }
      } else {
        environment.setBasicMoveListener((movementX, movementY, timestamp) => {
          if (
            started &&
            !destroyed &&
            [movementX, movementY, timestamp].every((value) => Number.isFinite(value))
          ) {
            emit({ type: 'move', movementX, movementY, timestamp });
          }
        });
      }

      return true;
    },
    stop: () => {
      if (!started) return;
      started = false;
      clearRuntimeListeners();
    },
    destroy: () => {
      if (destroyed) return;
      service.stop();
      destroyed = true;
      listeners.clear();
    },
    subscribe: (listener) => {
      if (destroyed) return () => undefined;
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getPollingSource: () => pollingSource,
  };

  return service;
};
