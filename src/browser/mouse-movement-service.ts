export type Unsubscribe = () => void;

export type MouseCaptureMode = 'raw-pointer-lock' | 'pointer-lock' | 'unlocked';
export type MouseCaptureCancelReason =
  | 'pointer-lock-lost'
  | 'blur'
  | 'visibility-hidden'
  | 'escape';

export type MouseMovementServiceEvent =
  | { type: 'movement'; movementX: number; movementY: number }
  | { type: 'cancel'; reason: MouseCaptureCancelReason };

export interface MouseMovementServiceEnvironment {
  requestPointerLock(target: HTMLElement, raw: boolean): Promise<boolean>;
  exitPointerLock(): void;
  isPointerLockedTo(target: HTMLElement): boolean;
  getVisibilityState(): DocumentVisibilityState;
  setMouseMoveListener(listener: ((movementX: number, movementY: number) => void) | null): void;
  setPointerLockChangeListener(listener: (() => void) | null): void;
  setBlurListener(listener: (() => void) | null): void;
  setVisibilityListener(listener: (() => void) | null): void;
  setKeydownListener(listener: ((key: string) => void) | null): void;
}

export interface MouseMovementService {
  start(target: HTMLElement): Promise<MouseCaptureMode | null>;
  stop(): void;
  destroy(): void;
  subscribe(listener: (event: MouseMovementServiceEvent) => void): Unsubscribe;
}

type PointerLockCapableElement = HTMLElement & {
  requestPointerLock(options?: { unadjustedMovement?: boolean }): Promise<void> | void;
};

const POINTER_LOCK_SETTLE_MS = 600;

const createBrowserEnvironment = (): MouseMovementServiceEnvironment | null => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  let mouseMoveWrapper: ((event: MouseEvent) => void) | null = null;
  let pointerLockChangeWrapper: (() => void) | null = null;
  let blurWrapper: (() => void) | null = null;
  let visibilityWrapper: (() => void) | null = null;
  let keydownWrapper: ((event: KeyboardEvent) => void) | null = null;

  return {
    requestPointerLock: async (target, raw) => {
      const request = (target as PointerLockCapableElement).requestPointerLock;
      if (typeof request !== 'function') {
        return false;
      }

      return new Promise<boolean>((resolve) => {
        let settled = false;
        const finish = (locked: boolean): void => {
          if (settled) {
            return;
          }
          settled = true;
          window.clearTimeout(timeoutHandle);
          document.removeEventListener('pointerlockchange', handleChange);
          document.removeEventListener('pointerlockerror', handleError);
          resolve(locked);
        };
        const handleChange = (): void => finish(document.pointerLockElement === target);
        const handleError = (): void => finish(false);
        const timeoutHandle = window.setTimeout(
          () => finish(document.pointerLockElement === target),
          POINTER_LOCK_SETTLE_MS,
        );

        document.addEventListener('pointerlockchange', handleChange);
        document.addEventListener('pointerlockerror', handleError);

        try {
          const result = raw
            ? request.call(target, { unadjustedMovement: true })
            : request.call(target);

          if (result && typeof (result as Promise<void>).then === 'function') {
            void Promise.resolve(result)
              .then(() => {
                if (document.pointerLockElement === target) {
                  finish(true);
                }
              })
              .catch(() => finish(false));
          } else if (document.pointerLockElement === target) {
            finish(true);
          }
        } catch {
          finish(false);
        }
      });
    },
    exitPointerLock: () => {
      if (document.pointerLockElement !== null && typeof document.exitPointerLock === 'function') {
        document.exitPointerLock();
      }
    },
    isPointerLockedTo: (target) => document.pointerLockElement === target,
    getVisibilityState: () => document.visibilityState,
    setMouseMoveListener: (listener) => {
      if (mouseMoveWrapper) {
        document.removeEventListener('mousemove', mouseMoveWrapper);
        mouseMoveWrapper = null;
      }
      if (listener) {
        mouseMoveWrapper = (event) => listener(event.movementX, event.movementY);
        document.addEventListener('mousemove', mouseMoveWrapper);
      }
    },
    setPointerLockChangeListener: (listener) => {
      if (pointerLockChangeWrapper) {
        document.removeEventListener('pointerlockchange', pointerLockChangeWrapper);
        pointerLockChangeWrapper = null;
      }
      if (listener) {
        pointerLockChangeWrapper = listener;
        document.addEventListener('pointerlockchange', pointerLockChangeWrapper);
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
    setKeydownListener: (listener) => {
      if (keydownWrapper) {
        document.removeEventListener('keydown', keydownWrapper);
        keydownWrapper = null;
      }
      if (listener) {
        keydownWrapper = (event) => listener(event.key);
        document.addEventListener('keydown', keydownWrapper);
      }
    },
  };
};

export const createMouseMovementService = (
  environment: MouseMovementServiceEnvironment | null = createBrowserEnvironment(),
): MouseMovementService => {
  const listeners = new Set<(event: MouseMovementServiceEvent) => void>();
  let destroyed = false;
  let starting = false;
  let lifecycleVersion = 0;
  let activeTarget: HTMLElement | null = null;
  let activeMode: MouseCaptureMode | null = null;

  const emit = (event: MouseMovementServiceEvent): void => {
    listeners.forEach((listener) => listener(event));
  };

  const clearRuntimeListeners = (): void => {
    if (!environment) {
      return;
    }
    environment.setMouseMoveListener(null);
    environment.setPointerLockChangeListener(null);
    environment.setBlurListener(null);
    environment.setVisibilityListener(null);
    environment.setKeydownListener(null);
  };

  const deactivate = (exitLock: boolean): void => {
    if (!environment) {
      activeTarget = null;
      activeMode = null;
      return;
    }

    const target = activeTarget;
    const mode = activeMode;
    clearRuntimeListeners();
    activeTarget = null;
    activeMode = null;

    if (
      exitLock &&
      target &&
      mode !== null &&
      mode !== 'unlocked' &&
      environment.isPointerLockedTo(target)
    ) {
      environment.exitPointerLock();
    }
  };

  const cancelActive = (reason: MouseCaptureCancelReason): void => {
    if (activeMode === null) {
      return;
    }
    deactivate(true);
    emit({ type: 'cancel', reason });
  };

  const attachRuntimeListeners = (): void => {
    if (!environment || activeMode === null || activeTarget === null) {
      return;
    }

    environment.setMouseMoveListener((movementX, movementY) => {
      if (activeMode === null || !Number.isFinite(movementX)) {
        return;
      }
      emit({
        type: 'movement',
        movementX,
        movementY: Number.isFinite(movementY) ? movementY : 0,
      });
    });

    environment.setBlurListener(() => cancelActive('blur'));
    environment.setVisibilityListener(() => {
      if (environment.getVisibilityState() !== 'visible') {
        cancelActive('visibility-hidden');
      }
    });
    environment.setKeydownListener((key) => {
      if (key === 'Escape') {
        cancelActive('escape');
      }
    });

    if (activeMode !== 'unlocked') {
      environment.setPointerLockChangeListener(() => {
        if (activeTarget && !environment.isPointerLockedTo(activeTarget)) {
          cancelActive('pointer-lock-lost');
        }
      });
    }
  };

  const service: MouseMovementService = {
    start: async (target) => {
      if (destroyed || environment === null) {
        return null;
      }
      if (activeMode !== null) {
        return activeMode;
      }
      if (starting) {
        return null;
      }

      starting = true;
      const version = lifecycleVersion;

      try {
        let nextMode: MouseCaptureMode = 'unlocked';
        const rawLocked = await environment.requestPointerLock(target, true);
        if (rawLocked) {
          nextMode = 'raw-pointer-lock';
        } else {
          const regularLocked = await environment.requestPointerLock(target, false);
          if (regularLocked) {
            nextMode = 'pointer-lock';
          }
        }

        if (destroyed || version !== lifecycleVersion) {
          if (environment.isPointerLockedTo(target)) {
            environment.exitPointerLock();
          }
          return null;
        }

        activeTarget = target;
        activeMode = nextMode;
        attachRuntimeListeners();
        return activeMode;
      } finally {
        starting = false;
      }
    },

    stop: () => {
      lifecycleVersion += 1;
      deactivate(true);
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
