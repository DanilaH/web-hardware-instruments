import { describe, expect, it, vi } from 'vitest';
import {
  createTouchInputService,
  type TouchInputServiceEnvironment,
  type TouchInputEvent,
  type TouchPointerLike,
} from './touch-input-service';

const pointer = (
  overrides: Partial<TouchPointerLike> = {},
): TouchPointerLike => ({
  pointerId: 1,
  pointerType: 'touch',
  clientX: 50,
  clientY: 25,
  timeStamp: 10,
  ...overrides,
});

const createEnvironment = () => {
  let down: ((event: TouchPointerLike) => void) | null = null;
  let move: ((event: TouchPointerLike) => void) | null = null;
  let up: ((event: TouchPointerLike) => void) | null = null;
  let cancel: ((event: TouchPointerLike) => void) | null = null;
  let blur: (() => void) | null = null;
  let visibility: (() => void) | null = null;
  let visibilityState: DocumentVisibilityState = 'visible';
  const captured: number[] = [];
  const released: number[] = [];

  const environment: TouchInputServiceEnvironment = {
    setPointerDownListener: (listener) => { down = listener; },
    setPointerMoveListener: (listener) => { move = listener; },
    setPointerUpListener: (listener) => { up = listener; },
    setPointerCancelListener: (listener) => { cancel = listener; },
    setBlurListener: (listener) => { blur = listener; },
    setVisibilityListener: (listener) => { visibility = listener; },
    getVisibilityState: () => visibilityState,
    getSurfaceRect: () => ({ left: 0, top: 0, right: 100, bottom: 50, width: 100, height: 50 }),
    setPointerCapture: (pointerId) => { captured.push(pointerId); },
    releasePointerCapture: (pointerId) => { released.push(pointerId); },
    getReportedMaxTouchPoints: () => 5,
  };

  return {
    environment,
    emitDown: (event: TouchPointerLike) => down?.(event),
    emitMove: (event: TouchPointerLike) => move?.(event),
    emitUp: (event: TouchPointerLike) => up?.(event),
    emitCancel: (event: TouchPointerLike) => cancel?.(event),
    emitBlur: () => blur?.(),
    hide: () => { visibilityState = 'hidden'; visibility?.(); },
    captured,
    released,
  };
};

describe('TouchInputService', () => {
  it('does not acquire input until start and reports the device hint', () => {
    const fake = createEnvironment();
    const service = createTouchInputService(null, fake.environment);
    const listener = vi.fn();
    service.subscribe(listener);
    fake.emitDown(pointer());
    expect(listener).not.toHaveBeenCalled();
    expect(service.getReportedMaxTouchPoints()).toBe(5);
  });

  it('accepts only touch pointers and normalizes inside coordinates', () => {
    const fake = createEnvironment();
    const events: TouchInputEvent[] = [];
    const service = createTouchInputService(null, fake.environment);
    service.subscribe((event) => events.push(event));
    service.start();

    fake.emitDown(pointer({ pointerType: 'mouse' }));
    fake.emitDown(pointer({ pointerType: 'pen' }));
    fake.emitDown(pointer({ clientX: 25, clientY: 10, timeStamp: 11 }));

    expect(events).toEqual([
      { type: 'start', pointerId: 1, x: 0.25, y: 0.2, insideSurface: true, timestamp: 11 },
    ]);
    expect(fake.captured).toEqual([1]);
  });

  it('keeps exact right/bottom boundaries inside and does not clamp outside samples', () => {
    const fake = createEnvironment();
    const events: TouchInputEvent[] = [];
    const service = createTouchInputService(null, fake.environment);
    service.subscribe((event) => events.push(event));
    service.start();

    fake.emitDown(pointer({ pointerId: 2, clientX: 100, clientY: 50 }));
    fake.emitMove(pointer({ pointerId: 2, clientX: 120, clientY: 55, timeStamp: 11 }));

    expect(events[0]).toMatchObject({ x: 1, y: 1, insideSurface: true });
    expect(events[1]).toMatchObject({ x: 1.2, y: 1.1, insideSurface: false });
  });

  it('uses real coalesced touch move samples without appending the parent event', () => {
    const fake = createEnvironment();
    const events: TouchInputEvent[] = [];
    const service = createTouchInputService(null, fake.environment);
    service.subscribe((event) => events.push(event));
    service.start();

    fake.emitMove(pointer({
      clientX: 90,
      timeStamp: 30,
      getCoalescedEvents: () => [
        pointer({ clientX: 10, clientY: 5, timeStamp: 20 }),
        pointer({ clientX: 20, clientY: 10, timeStamp: 21 }),
        pointer({ pointerType: 'pen', clientX: 30, timeStamp: 22 }),
      ],
    }));

    expect(events).toEqual([
      { type: 'move', pointerId: 1, x: 0.1, y: 0.1, insideSurface: true, timestamp: 20 },
      { type: 'move', pointerId: 1, x: 0.2, y: 0.2, insideSurface: true, timestamp: 21 },
    ]);
  });

  it('releases captured contacts on end and emits clear on blur/hidden visibility', () => {
    const fake = createEnvironment();
    const events: TouchInputEvent[] = [];
    const service = createTouchInputService(null, fake.environment);
    service.subscribe((event) => events.push(event));
    service.start();

    fake.emitDown(pointer({ pointerId: 7 }));
    fake.emitUp(pointer({ pointerId: 7, timeStamp: 12 }));
    fake.emitDown(pointer({ pointerId: 8, timeStamp: 13 }));
    fake.emitBlur();
    fake.hide();

    expect(fake.released).toEqual([7, 8]);
    expect(events).toContainEqual({ type: 'clear', reason: 'blur' });
    expect(events).toContainEqual({ type: 'clear', reason: 'visibility-hidden' });
  });

  it('stop is reusable and destroy is permanent', () => {
    const fake = createEnvironment();
    const listener = vi.fn();
    const service = createTouchInputService(null, fake.environment);
    service.subscribe(listener);
    expect(service.start()).toBe(true);
    service.stop();
    fake.emitDown(pointer());
    expect(listener).not.toHaveBeenCalled();
    expect(service.start()).toBe(true);
    service.destroy();
    expect(service.start()).toBe(false);
  });
});
