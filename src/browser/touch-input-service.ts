export type TouchClearReason = 'blur' | 'visibility-hidden';

export interface TouchPointInputEvent {
  readonly type: 'start' | 'move' | 'end' | 'cancel';
  readonly pointerId: number;
  readonly x: number;
  readonly y: number;
  readonly insideSurface: boolean;
  readonly timestamp: number;
}

export type TouchInputEvent =
  | TouchPointInputEvent
  | { type: 'clear'; reason: TouchClearReason };

export type Unsubscribe = () => void;

export interface TouchPointerLike {
  readonly pointerId: number;
  readonly pointerType: string;
  readonly clientX: number;
  readonly clientY: number;
  readonly timeStamp: number;
  getCoalescedEvents?: () => readonly TouchPointerLike[];
}

export interface TouchSurfaceRect {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
}

type PointerListener = (event: TouchPointerLike) => void;

export interface TouchInputServiceEnvironment {
  setPointerDownListener(listener: PointerListener | null): void;
  setPointerMoveListener(listener: PointerListener | null): void;
  setPointerUpListener(listener: PointerListener | null): void;
  setPointerCancelListener(listener: PointerListener | null): void;
  setBlurListener(listener: (() => void) | null): void;
  setVisibilityListener(listener: (() => void) | null): void;
  getVisibilityState(): DocumentVisibilityState;
  getSurfaceRect(): TouchSurfaceRect;
  setPointerCapture(pointerId: number): void;
  releasePointerCapture(pointerId: number): void;
  getReportedMaxTouchPoints(): number;
}

export interface TouchInputService {
  start(): boolean;
  stop(): void;
  destroy(): void;
  subscribe(listener: (event: TouchInputEvent) => void): Unsubscribe;
  getReportedMaxTouchPoints(): number;
}

const isTouchPointer = (event: TouchPointerLike): boolean => event.pointerType === 'touch';

const isValidPointerIdentity = (event: TouchPointerLike): boolean =>
  Number.isInteger(event.pointerId) && Number.isFinite(event.timeStamp);

const isFiniteCoordinateSample = (event: TouchPointerLike): boolean =>
  Number.isFinite(event.clientX) && Number.isFinite(event.clientY);

const normalizeCoordinates = (
  event: TouchPointerLike,
  rect: TouchSurfaceRect,
): { x: number; y: number; insideSurface: boolean } => {
  const rectIsUsable =
    [rect.left, rect.top, rect.right, rect.bottom, rect.width, rect.height].every(Number.isFinite) &&
    rect.width > 0 &&
    rect.height > 0;

  if (!rectIsUsable || !isFiniteCoordinateSample(event)) {
    return { x: Number.NaN, y: Number.NaN, insideSurface: false };
  }

  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const insideSurface =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  return { x, y, insideSurface };
};

export const createBrowserTouchInputEnvironment = (
  surface: HTMLElement,
): TouchInputServiceEnvironment | null => {
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    typeof window.PointerEvent === 'undefined'
  ) {
    return null;
  }

  const wrappers = new Map<string, EventListener>();

  const setPointerListener = (type: string, listener: PointerListener | null): void => {
    const previous = wrappers.get(type);
    if (previous) {
      window.removeEventListener(type, previous, true);
      wrappers.delete(type);
    }

    if (!listener) return;
    const wrapper: EventListener = (event) => listener(event as PointerEvent);
    wrappers.set(type, wrapper);
    window.addEventListener(type, wrapper, true);
  };

  let blurListener: (() => void) | null = null;
  let visibilityListener: (() => void) | null = null;

  return {
    setPointerDownListener: (listener) => setPointerListener('pointerdown', listener),
    setPointerMoveListener: (listener) => setPointerListener('pointermove', listener),
    setPointerUpListener: (listener) => setPointerListener('pointerup', listener),
    setPointerCancelListener: (listener) => setPointerListener('pointercancel', listener),
    setBlurListener: (listener) => {
      if (blurListener) window.removeEventListener('blur', blurListener);
      blurListener = listener;
      if (blurListener) window.addEventListener('blur', blurListener);
    },
    setVisibilityListener: (listener) => {
      if (visibilityListener) document.removeEventListener('visibilitychange', visibilityListener);
      visibilityListener = listener;
      if (visibilityListener) document.addEventListener('visibilitychange', visibilityListener);
    },
    getVisibilityState: () => document.visibilityState,
    getSurfaceRect: () => surface.getBoundingClientRect(),
    setPointerCapture: (pointerId) => {
      try {
        surface.setPointerCapture(pointerId);
      } catch {
        // Global lifecycle listeners still observe the contact when capture is unavailable.
      }
    },
    releasePointerCapture: (pointerId) => {
      try {
        if (surface.hasPointerCapture(pointerId)) surface.releasePointerCapture(pointerId);
      } catch {
        // Teardown remains safe if the browser already released capture.
      }
    },
    getReportedMaxTouchPoints: () =>
      Number.isFinite(navigator.maxTouchPoints) ? Math.max(0, navigator.maxTouchPoints) : 0,
  };
};

export const createTouchInputService = (
  surface: HTMLElement | null,
  environment: TouchInputServiceEnvironment | null = surface
    ? createBrowserTouchInputEnvironment(surface)
    : null,
): TouchInputService => {
  const listeners = new Set<(event: TouchInputEvent) => void>();
  const capturedPointerIds = new Set<number>();
  let started = false;
  let destroyed = false;

  const emit = (event: TouchInputEvent): void => {
    listeners.forEach((listener) => listener(event));
  };

  const normalizeEvent = (
    type: TouchPointInputEvent['type'],
    event: TouchPointerLike,
  ): TouchPointInputEvent | null => {
    if (!environment || !isTouchPointer(event) || !isValidPointerIdentity(event)) return null;
    const coordinates = normalizeCoordinates(event, environment.getSurfaceRect());
    return {
      type,
      pointerId: event.pointerId,
      ...coordinates,
      timestamp: event.timeStamp,
    };
  };

  const clearCaptures = (): void => {
    if (!environment) return;
    capturedPointerIds.forEach((pointerId) => environment.releasePointerCapture(pointerId));
    capturedPointerIds.clear();
  };

  const clearRuntimeListeners = (): void => {
    if (!environment) return;
    environment.setPointerDownListener(null);
    environment.setPointerMoveListener(null);
    environment.setPointerUpListener(null);
    environment.setPointerCancelListener(null);
    environment.setBlurListener(null);
    environment.setVisibilityListener(null);
    clearCaptures();
  };

  const handleStart = (event: TouchPointerLike): void => {
    if (!started || destroyed) return;
    const normalized = normalizeEvent('start', event);
    if (!normalized) return;
    if (normalized.insideSurface && environment) {
      environment.setPointerCapture(normalized.pointerId);
      capturedPointerIds.add(normalized.pointerId);
    }
    emit(normalized);
  };

  const handleMove = (event: TouchPointerLike): void => {
    if (!started || destroyed || !isTouchPointer(event)) return;

    let coalesced: readonly TouchPointerLike[] = [];
    if (typeof event.getCoalescedEvents === 'function') {
      try {
        coalesced = event.getCoalescedEvents();
      } catch {
        coalesced = [];
      }
    }

    if (coalesced.length > 0) {
      for (const sample of coalesced) {
        if (!isTouchPointer(sample) || !isFiniteCoordinateSample(sample)) continue;
        const normalized = normalizeEvent('move', sample);
        if (normalized) emit(normalized);
      }
      return;
    }

    const normalized = normalizeEvent('move', event);
    if (normalized) emit(normalized);
  };

  const handleEnd = (type: 'end' | 'cancel', event: TouchPointerLike): void => {
    if (!started || destroyed) return;
    const normalized = normalizeEvent(type, event);
    if (!normalized) return;
    if (environment && capturedPointerIds.has(normalized.pointerId)) {
      environment.releasePointerCapture(normalized.pointerId);
      capturedPointerIds.delete(normalized.pointerId);
    }
    emit(normalized);
  };

  const service: TouchInputService = {
    start: () => {
      if (destroyed || !environment) return false;
      if (started) return true;
      started = true;

      environment.setPointerDownListener(handleStart);
      environment.setPointerMoveListener(handleMove);
      environment.setPointerUpListener((event) => handleEnd('end', event));
      environment.setPointerCancelListener((event) => handleEnd('cancel', event));
      environment.setBlurListener(() => {
        if (!started || destroyed) return;
        clearCaptures();
        emit({ type: 'clear', reason: 'blur' });
      });
      environment.setVisibilityListener(() => {
        if (!started || destroyed || environment.getVisibilityState() === 'visible') return;
        clearCaptures();
        emit({ type: 'clear', reason: 'visibility-hidden' });
      });
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
    getReportedMaxTouchPoints: () => environment?.getReportedMaxTouchPoints() ?? 0,
  };

  return service;
};
