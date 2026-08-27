export type Unsubscribe = () => void;

export type GamepadMapping = 'standard' | 'non-standard';

export interface GamepadButtonSnapshot {
  pressed: boolean;
  value: number;
}

export interface GamepadSnapshot {
  /** Browser gamepad slot used internally for selection. Never render this value. */
  sourceIndex: number;
  mapping: GamepadMapping;
  buttons: readonly GamepadButtonSnapshot[];
  axes: readonly number[];
}

export type GamepadServiceState =
  | { status: 'idle'; gamepads: readonly [] }
  | { status: 'unsupported'; gamepads: readonly [] }
  | { status: 'error'; gamepads: readonly [] }
  | { status: 'ready'; gamepads: readonly GamepadSnapshot[] };

export interface GamepadServiceEnvironment {
  getGamepads: (() => readonly (Gamepad | null)[]) | null;
  addWindowListener: (
    type: 'gamepadconnected' | 'gamepaddisconnected',
    listener: (event: GamepadEvent) => void,
  ) => void;
  removeWindowListener: (
    type: 'gamepadconnected' | 'gamepaddisconnected',
    listener: (event: GamepadEvent) => void,
  ) => void;
  requestFrame: (callback: FrameRequestCallback) => number;
  cancelFrame: (handle: number) => void;
}

export interface GamepadService {
  isSupported(): boolean;
  start(): boolean;
  stop(): void;
  destroy(): void;
  getState(): GamepadServiceState;
  setActiveGamepad(sourceIndex: number | null): void;
  subscribe(listener: (state: GamepadServiceState) => void): Unsubscribe;
}

const clamp = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(max, Math.max(min, value));
};

export const normalizeGamepad = (gamepad: Gamepad): GamepadSnapshot => ({
  sourceIndex: gamepad.index,
  mapping: gamepad.mapping === 'standard' ? 'standard' : 'non-standard',
  buttons: gamepad.buttons.map((button) => ({
    pressed: button.pressed,
    value: clamp(button.value, 0, 1),
  })),
  axes: gamepad.axes.map((axis) => clamp(axis, -1, 1)),
});

const createBrowserEnvironment = (): GamepadServiceEnvironment => {
  const hasWindow = typeof window !== 'undefined';
  const hasNavigator = typeof navigator !== 'undefined';
  const getGamepads =
    hasNavigator && typeof navigator.getGamepads === 'function'
      ? () => navigator.getGamepads()
      : null;

  return {
    getGamepads,
    addWindowListener: (type, listener) => {
      if (hasWindow) {
        window.addEventListener(type, listener);
      }
    },
    removeWindowListener: (type, listener) => {
      if (hasWindow) {
        window.removeEventListener(type, listener);
      }
    },
    requestFrame: (callback) => (hasWindow ? window.requestAnimationFrame(callback) : -1),
    cancelFrame: (handle) => {
      if (hasWindow && handle >= 0) {
        window.cancelAnimationFrame(handle);
      }
    },
  };
};

export const createGamepadService = (
  environment: GamepadServiceEnvironment = createBrowserEnvironment(),
): GamepadService => {
  const listeners = new Set<(state: GamepadServiceState) => void>();
  let state: GamepadServiceState = { status: 'idle', gamepads: [] };
  let started = false;
  let destroyed = false;
  let activeSourceIndex: number | null = null;
  let frameHandle: number | null = null;

  const emit = (nextState: GamepadServiceState): void => {
    state = nextState;
    listeners.forEach((listener) => listener(state));
  };

  const cancelPolling = (): void => {
    if (frameHandle === null) {
      return;
    }

    environment.cancelFrame(frameHandle);
    frameHandle = null;
  };

  const readVisibleGamepads = (): readonly GamepadSnapshot[] | null => {
    if (environment.getGamepads === null) {
      return null;
    }

    try {
      return environment
        .getGamepads()
        .filter((gamepad): gamepad is Gamepad => gamepad !== null && gamepad.connected)
        .map(normalizeGamepad);
    } catch {
      return null;
    }
  };

  const refresh = (): boolean => {
    if (environment.getGamepads === null) {
      emit({ status: 'unsupported', gamepads: [] });
      return false;
    }

    const gamepads = readVisibleGamepads();
    if (gamepads === null) {
      activeSourceIndex = null;
      cancelPolling();
      emit({ status: 'error', gamepads: [] });
      return false;
    }

    if (
      activeSourceIndex !== null &&
      !gamepads.some((gamepad) => gamepad.sourceIndex === activeSourceIndex)
    ) {
      activeSourceIndex = null;
      cancelPolling();
    }

    emit({ status: 'ready', gamepads });
    return true;
  };

  const schedulePolling = (): void => {
    if (!started || destroyed || activeSourceIndex === null || frameHandle !== null) {
      return;
    }

    frameHandle = environment.requestFrame(() => {
      frameHandle = null;
      const canContinue = refresh();
      if (canContinue && activeSourceIndex !== null) {
        schedulePolling();
      }
    });
  };

  const handleConnectionSignal = (): void => {
    if (!started || destroyed) {
      return;
    }

    const canContinue = refresh();
    if (canContinue && activeSourceIndex !== null) {
      schedulePolling();
    }
  };

  const service: GamepadService = {
    isSupported: () => environment.getGamepads !== null,

    start: () => {
      if (destroyed || started) {
        return !destroyed && state.status === 'ready';
      }

      if (environment.getGamepads === null) {
        emit({ status: 'unsupported', gamepads: [] });
        return false;
      }

      started = true;
      environment.addWindowListener('gamepadconnected', handleConnectionSignal);
      environment.addWindowListener('gamepaddisconnected', handleConnectionSignal);

      const ready = refresh();
      if (ready && activeSourceIndex !== null) {
        schedulePolling();
      }

      return ready;
    },

    stop: () => {
      if (!started) {
        return;
      }

      started = false;
      cancelPolling();
      environment.removeWindowListener('gamepadconnected', handleConnectionSignal);
      environment.removeWindowListener('gamepaddisconnected', handleConnectionSignal);
    },

    destroy: () => {
      if (destroyed) {
        return;
      }

      service.stop();
      destroyed = true;
      activeSourceIndex = null;
      listeners.clear();
    },

    getState: () => state,

    setActiveGamepad: (sourceIndex) => {
      if (destroyed || activeSourceIndex === sourceIndex) {
        return;
      }

      activeSourceIndex = sourceIndex;
      if (sourceIndex === null) {
        cancelPolling();
        return;
      }

      if (started) {
        refresh();
        schedulePolling();
      }
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
