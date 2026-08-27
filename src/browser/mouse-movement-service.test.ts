import { describe, expect, it } from 'vitest';

import {
  createMouseMovementService,
  type MouseMovementServiceEnvironment,
  type MouseMovementServiceEvent,
} from './mouse-movement-service';

const createEnvironment = (lockOutcomes: boolean[]) => {
  let lockedTarget: HTMLElement | null = null;
  let visibility: DocumentVisibilityState = 'visible';
  let mouseMoveListener: ((movementX: number, movementY: number) => void) | null = null;
  let pointerLockChangeListener: (() => void) | null = null;
  let blurListener: (() => void) | null = null;
  let visibilityListener: (() => void) | null = null;
  let keydownListener: ((key: string) => void) | null = null;
  const lockRequests: boolean[] = [];
  let exitCount = 0;

  const environment: MouseMovementServiceEnvironment = {
    requestPointerLock: async (target, raw) => {
      lockRequests.push(raw);
      const locked = lockOutcomes.shift() ?? false;
      if (locked) {
        lockedTarget = target;
      }
      return locked;
    },
    exitPointerLock: () => {
      exitCount += 1;
      lockedTarget = null;
    },
    isPointerLockedTo: (target) => lockedTarget === target,
    getVisibilityState: () => visibility,
    setMouseMoveListener: (listener) => {
      mouseMoveListener = listener;
    },
    setPointerLockChangeListener: (listener) => {
      pointerLockChangeListener = listener;
    },
    setBlurListener: (listener) => {
      blurListener = listener;
    },
    setVisibilityListener: (listener) => {
      visibilityListener = listener;
    },
    setKeydownListener: (listener) => {
      keydownListener = listener;
    },
  };

  return {
    environment,
    lockRequests,
    get exitCount() {
      return exitCount;
    },
    move(movementX: number, movementY = 0) {
      mouseMoveListener?.(movementX, movementY);
    },
    losePointerLock() {
      lockedTarget = null;
      pointerLockChangeListener?.();
    },
    blur() {
      blurListener?.();
    },
    hide() {
      visibility = 'hidden';
      visibilityListener?.();
    },
    press(key: string) {
      keydownListener?.(key);
    },
    hasRuntimeListeners() {
      return [
        mouseMoveListener,
        pointerLockChangeListener,
        blurListener,
        visibilityListener,
        keydownListener,
      ].some((listener) => listener !== null);
    },
  };
};

const target = {} as HTMLElement;

describe('MouseMovementService', () => {
  it('prefers raw Pointer Lock and emits finite movement only after capture is active', async () => {
    const fixture = createEnvironment([true]);
    const service = createMouseMovementService(fixture.environment);
    const events: MouseMovementServiceEvent[] = [];
    service.subscribe((event) => events.push(event));

    expect(await service.start(target)).toBe('raw-pointer-lock');
    expect(fixture.lockRequests).toEqual([true]);

    fixture.move(12, -3);
    fixture.move(Number.NaN, 2);

    expect(events).toEqual([{ type: 'movement', movementX: 12, movementY: -3 }]);
  });

  it('falls back from raw to regular Pointer Lock', async () => {
    const fixture = createEnvironment([false, true]);
    const service = createMouseMovementService(fixture.environment);

    expect(await service.start(target)).toBe('pointer-lock');
    expect(fixture.lockRequests).toEqual([true, false]);
  });

  it('falls back to unlocked page movement when Pointer Lock is unavailable', async () => {
    const fixture = createEnvironment([false, false]);
    const service = createMouseMovementService(fixture.environment);
    const events: MouseMovementServiceEvent[] = [];
    service.subscribe((event) => events.push(event));

    expect(await service.start(target)).toBe('unlocked');
    fixture.move(-25, Number.NaN);

    expect(events).toEqual([{ type: 'movement', movementX: -25, movementY: 0 }]);
  });

  it('cancels cleanly when Pointer Lock is lost', async () => {
    const fixture = createEnvironment([true]);
    const service = createMouseMovementService(fixture.environment);
    const events: MouseMovementServiceEvent[] = [];
    service.subscribe((event) => events.push(event));

    await service.start(target);
    fixture.losePointerLock();
    fixture.move(10);

    expect(events).toEqual([{ type: 'cancel', reason: 'pointer-lock-lost' }]);
    expect(fixture.hasRuntimeListeners()).toBe(false);
  });

  it('cancels unlocked capture on Escape, blur, or visibility loss', async () => {
    const escapeFixture = createEnvironment([false, false]);
    const escapeService = createMouseMovementService(escapeFixture.environment);
    const escapeEvents: MouseMovementServiceEvent[] = [];
    escapeService.subscribe((event) => escapeEvents.push(event));
    await escapeService.start(target);
    escapeFixture.press('Escape');
    expect(escapeEvents).toEqual([{ type: 'cancel', reason: 'escape' }]);

    const blurFixture = createEnvironment([false, false]);
    const blurService = createMouseMovementService(blurFixture.environment);
    const blurEvents: MouseMovementServiceEvent[] = [];
    blurService.subscribe((event) => blurEvents.push(event));
    await blurService.start(target);
    blurFixture.blur();
    expect(blurEvents).toEqual([{ type: 'cancel', reason: 'blur' }]);

    const hiddenFixture = createEnvironment([false, false]);
    const hiddenService = createMouseMovementService(hiddenFixture.environment);
    const hiddenEvents: MouseMovementServiceEvent[] = [];
    hiddenService.subscribe((event) => hiddenEvents.push(event));
    await hiddenService.start(target);
    hiddenFixture.hide();
    expect(hiddenEvents).toEqual([{ type: 'cancel', reason: 'visibility-hidden' }]);
  });

  it('keeps stop reusable and makes destroy permanent', async () => {
    const fixture = createEnvironment([true, false, false]);
    const service = createMouseMovementService(fixture.environment);

    expect(await service.start(target)).toBe('raw-pointer-lock');
    service.stop();
    expect(fixture.exitCount).toBe(1);
    expect(fixture.hasRuntimeListeners()).toBe(false);

    expect(await service.start(target)).toBe('unlocked');
    service.destroy();
    service.destroy();

    expect(fixture.hasRuntimeListeners()).toBe(false);
    expect(await service.start(target)).toBeNull();
  });
});
