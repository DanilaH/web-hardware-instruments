import { describe, expect, it } from 'vitest';

import {
  createGamepadService,
  normalizeGamepad,
  type GamepadServiceEnvironment,
} from './gamepad-service';

const createButton = (value: number, pressed = value > 0.5): GamepadButton => ({
  pressed,
  touched: pressed,
  value,
});

const createGamepad = ({
  index = 0,
  mapping = 'standard',
  buttons = [createButton(0)],
  axes = [0, 0],
  connected = true,
}: {
  index?: number;
  mapping?: GamepadMappingType;
  buttons?: GamepadButton[];
  axes?: number[];
  connected?: boolean;
} = {}): Gamepad =>
  ({
    axes,
    buttons,
    connected,
    id: 'must-not-leak',
    index,
    mapping,
    timestamp: 0,
    vibrationActuator: null,
  }) as unknown as Gamepad;

type GamepadMappingType = Gamepad['mapping'];

const createEnvironment = (pads: Array<Gamepad | null>) => {
  const listeners = new Map<string, Set<(event: GamepadEvent) => void>>();
  const frameCallbacks = new Map<number, FrameRequestCallback>();
  const cancelledFrames: number[] = [];
  let nextFrame = 1;

  const environment: GamepadServiceEnvironment = {
    getGamepads: () => pads,
    addWindowListener: (type, listener) => {
      const bucket = listeners.get(type) ?? new Set();
      bucket.add(listener);
      listeners.set(type, bucket);
    },
    removeWindowListener: (type, listener) => {
      listeners.get(type)?.delete(listener);
    },
    requestFrame: (callback) => {
      const handle = nextFrame++;
      frameCallbacks.set(handle, callback);
      return handle;
    },
    cancelFrame: (handle) => {
      cancelledFrames.push(handle);
      frameCallbacks.delete(handle);
    },
  };

  return {
    environment,
    listeners,
    frameCallbacks,
    cancelledFrames,
    setPads(nextPads: Array<Gamepad | null>) {
      pads.splice(0, pads.length, ...nextPads);
    },
    runFrame(handle: number, timestamp = 16.7) {
      const callback = frameCallbacks.get(handle);
      if (!callback) {
        throw new Error(`Missing frame ${handle}`);
      }
      frameCallbacks.delete(handle);
      callback(timestamp);
    },
  };
};

describe('normalizeGamepad', () => {
  it('clamps browser values and never exposes the raw gamepad id', () => {
    const normalized = normalizeGamepad(
      createGamepad({
        index: 4,
        buttons: [createButton(1.4, true), createButton(Number.NaN, false)],
        axes: [-2, 0.25, Number.POSITIVE_INFINITY],
      }),
    );

    expect(normalized).toEqual({
      sourceIndex: 4,
      mapping: 'standard',
      buttons: [
        { pressed: true, value: 1 },
        { pressed: false, value: 0 },
      ],
      axes: [-1, 0.25, 0],
    });
    expect(normalized).not.toHaveProperty('id');
  });

  it('classifies every non-standard mapping as non-standard', () => {
    expect(normalizeGamepad(createGamepad({ mapping: '' })).mapping).toBe('non-standard');
  });
});

describe('GamepadService', () => {
  it('reports unsupported without installing listeners', () => {
    const environment: GamepadServiceEnvironment = {
      getGamepads: null,
      addWindowListener: () => {
        throw new Error('listener should not be installed');
      },
      removeWindowListener: () => undefined,
      requestFrame: () => 1,
      cancelFrame: () => undefined,
    };

    const service = createGamepadService(environment);
    const states: string[] = [];
    service.subscribe((state) => states.push(state.status));

    expect(service.start()).toBe(false);
    expect(states).toEqual(['unsupported']);
  });

  it('uses one polling loop for the active controller and cleans it up', () => {
    const fixture = createEnvironment([createGamepad({ index: 2 })]);
    const service = createGamepadService(fixture.environment);
    const snapshots: number[] = [];

    service.subscribe((state) => {
      if (state.status === 'ready') {
        snapshots.push(state.gamepads.length);
      }
    });

    expect(service.start()).toBe(true);
    expect(fixture.frameCallbacks.size).toBe(0);
    expect(fixture.listeners.get('gamepadconnected')?.size).toBe(1);
    expect(fixture.listeners.get('gamepaddisconnected')?.size).toBe(1);

    service.setActiveGamepad(2);
    expect(fixture.frameCallbacks.size).toBe(1);

    service.setActiveGamepad(2);
    expect(fixture.frameCallbacks.size).toBe(1);

    const firstFrame = [...fixture.frameCallbacks.keys()][0];
    expect(firstFrame).toBeDefined();
    fixture.runFrame(firstFrame!);
    expect(fixture.frameCallbacks.size).toBe(1);
    expect(snapshots.length).toBeGreaterThanOrEqual(2);

    service.stop();
    expect(fixture.frameCallbacks.size).toBe(0);
    expect(fixture.cancelledFrames.length).toBe(1);
    expect(fixture.listeners.get('gamepadconnected')?.size).toBe(0);
    expect(fixture.listeners.get('gamepaddisconnected')?.size).toBe(0);
  });

  it('refreshes visible controllers when a connection signal arrives', () => {
    const first = createGamepad({ index: 0 });
    const second = createGamepad({ index: 3 });
    const fixture = createEnvironment([first]);
    const service = createGamepadService(fixture.environment);
    const visibleIndexes: number[][] = [];

    service.subscribe((state) => {
      if (state.status === 'ready') {
        visibleIndexes.push(state.gamepads.map((gamepad) => gamepad.sourceIndex));
      }
    });

    service.start();
    fixture.setPads([first, second]);

    const connectionListener = fixture.listeners.get('gamepadconnected')?.values().next().value;
    expect(connectionListener).toBeDefined();
    connectionListener!({ gamepad: second } as GamepadEvent);

    expect(visibleIndexes.at(-1)).toEqual([0, 3]);
    expect(fixture.frameCallbacks.size).toBe(0);
  });

  it('switches the active controller without creating a second polling loop', () => {
    const fixture = createEnvironment([
      createGamepad({ index: 0 }),
      createGamepad({ index: 4 }),
    ]);
    const service = createGamepadService(fixture.environment);

    service.start();
    service.setActiveGamepad(0);

    const firstHandle = [...fixture.frameCallbacks.keys()][0];
    expect(firstHandle).toBeDefined();
    expect(fixture.frameCallbacks.size).toBe(1);

    service.setActiveGamepad(4);

    expect(fixture.frameCallbacks.size).toBe(1);
    expect([...fixture.frameCallbacks.keys()][0]).toBe(firstHandle);
  });

  it('drops a disconnected active controller and returns to an empty ready snapshot', () => {
    const fixture = createEnvironment([createGamepad({ index: 1 })]);
    const service = createGamepadService(fixture.environment);
    const lengths: number[] = [];

    service.subscribe((state) => {
      if (state.status === 'ready') {
        lengths.push(state.gamepads.length);
      }
    });

    service.start();
    service.setActiveGamepad(1);
    fixture.setPads([null]);

    const disconnectListener = fixture.listeners.get('gamepaddisconnected')?.values().next().value;
    expect(disconnectListener).toBeDefined();
    disconnectListener!({ gamepad: createGamepad({ index: 1, connected: false }) } as GamepadEvent);

    expect(lengths.at(-1)).toBe(0);
    expect(fixture.frameCallbacks.size).toBe(0);
  });

  it('can stop and restart acquisition without duplicating listeners or polling loops', () => {
    const fixture = createEnvironment([createGamepad({ index: 2 })]);
    const service = createGamepadService(fixture.environment);

    expect(service.start()).toBe(true);
    service.setActiveGamepad(2);
    expect(fixture.frameCallbacks.size).toBe(1);

    service.stop();
    expect(fixture.frameCallbacks.size).toBe(0);
    expect(fixture.listeners.get('gamepadconnected')?.size).toBe(0);
    expect(fixture.listeners.get('gamepaddisconnected')?.size).toBe(0);

    expect(service.start()).toBe(true);
    expect(fixture.frameCallbacks.size).toBe(1);
    expect(fixture.listeners.get('gamepadconnected')?.size).toBe(1);
    expect(fixture.listeners.get('gamepaddisconnected')?.size).toBe(1);
  });

  it('refreshes hardware state after a stopped period before resuming acquisition', () => {
    const fixture = createEnvironment([]);
    const service = createGamepadService(fixture.environment);
    const visibleIndexes: number[][] = [];

    service.subscribe((state) => {
      if (state.status === 'ready') {
        visibleIndexes.push(state.gamepads.map((gamepad) => gamepad.sourceIndex));
      }
    });

    expect(service.start()).toBe(true);
    expect(visibleIndexes.at(-1)).toEqual([]);

    service.stop();
    fixture.setPads([createGamepad({ index: 5 })]);

    expect(service.start()).toBe(true);
    expect(visibleIndexes.at(-1)).toEqual([5]);
    expect(fixture.listeners.get('gamepadconnected')?.size).toBe(1);
    expect(fixture.listeners.get('gamepaddisconnected')?.size).toBe(1);
  });

  it('destroy is idempotent and prevents restarting acquisition', () => {
    const fixture = createEnvironment([createGamepad()]);
    const service = createGamepadService(fixture.environment);

    service.start();
    service.destroy();
    service.destroy();

    expect(service.start()).toBe(false);
    expect(fixture.listeners.get('gamepadconnected')?.size).toBe(0);
  });
});
