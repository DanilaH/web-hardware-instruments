import { describe, expect, it, vi } from 'vitest';
import {
  createMouseInputService,
  type MouseInputServiceEnvironment,
  type MouseInputServiceEvent,
} from './mouse-input-service';

const createEnvironment = (options?: { raw?: boolean; coalesced?: boolean }) => {
  let buttonDown: ((button: number, timestamp: number) => void) | null = null;
  let buttonUp: ((button: number, timestamp: number) => void) | null = null;
  let auxClick: ((button: number, timestamp: number) => void) | null = null;
  let wheel: ((dx: number, dy: number, mode: number, timestamp: number) => void) | null = null;
  let basicMove: ((dx: number, dy: number, timestamp: number) => void) | null = null;
  let rawMove: ((timestamps: readonly number[]) => void) | null = null;
  let coalescedMove: ((timestamps: readonly number[]) => void) | null = null;
  let blur: (() => void) | null = null;
  let visibility: (() => void) | null = null;
  let visibilityState: DocumentVisibilityState = 'visible';
  let contextSuppressed = false;
  let auxSuppressed = false;

  const environment: MouseInputServiceEnvironment = {
    setButtonDownListener: (listener) => { buttonDown = listener; },
    setButtonUpListener: (listener) => { buttonUp = listener; },
    setAuxClickListener: (listener) => { auxClick = listener; },
    setWheelListener: (listener) => { wheel = listener; },
    setBasicMoveListener: (listener) => { basicMove = listener; },
    setRawMoveListener: (listener) => { rawMove = listener; },
    setCoalescedMoveListener: (listener) => { coalescedMove = listener; },
    setContextMenuSuppression: (enabled) => { contextSuppressed = enabled; },
    setAuxClickSuppression: (enabled) => { auxSuppressed = enabled; },
    setBlurListener: (listener) => { blur = listener; },
    setVisibilityListener: (listener) => { visibility = listener; },
    getVisibilityState: () => visibilityState,
    supportsRawPointerUpdate: () => options?.raw ?? false,
    supportsCoalescedPointerEvents: () => options?.coalesced ?? false,
  };

  return {
    environment,
    emitButtonDown: (button: number, timestamp = 1) => buttonDown?.(button, timestamp),
    emitButtonUp: (button: number, timestamp = 2) => buttonUp?.(button, timestamp),
    emitAuxClick: (button: number, timestamp = 2) => auxClick?.(button, timestamp),
    emitWheel: (dx: number, dy: number, mode = 0, timestamp = 3) => wheel?.(dx, dy, mode, timestamp),
    emitBasicMove: (dx: number, dy: number, timestamp = 4) => basicMove?.(dx, dy, timestamp),
    emitRaw: (timestamps: readonly number[]) => rawMove?.(timestamps),
    emitCoalesced: (timestamps: readonly number[]) => coalescedMove?.(timestamps),
    emitBlur: () => blur?.(),
    hide: () => { visibilityState = 'hidden'; visibility?.(); },
    getSuppression: () => ({ contextSuppressed, auxSuppressed }),
    hasAuxClick: () => auxClick !== null,
    hasRaw: () => rawMove !== null,
    hasCoalesced: () => coalescedMove !== null,
    hasBasic: () => basicMove !== null,
  };
};

describe('MouseInputService', () => {
  it('does not acquire input until start', () => {
    const fake = createEnvironment();
    const service = createMouseInputService(null, 'basic', fake.environment);
    const listener = vi.fn();
    service.subscribe(listener);

    fake.emitButtonDown(0);
    expect(listener).not.toHaveBeenCalled();
    expect(fake.getSuppression()).toEqual({ contextSuppressed: false, auxSuppressed: false });
  });

  it('normalizes supported button down/up events and ignores other button codes', () => {
    const fake = createEnvironment();
    const service = createMouseInputService(null, 'basic', fake.environment);
    const events: MouseInputServiceEvent[] = [];
    service.subscribe((event) => events.push(event));
    expect(service.start()).toBe(true);

    fake.emitButtonDown(0, 10);
    fake.emitButtonDown(4, 11);
    fake.emitButtonDown(5, 12);
    fake.emitButtonUp(4, 13);

    expect(events).toEqual([
      { type: 'buttondown', button: 0, timestamp: 10 },
      { type: 'buttondown', button: 4, timestamp: 11 },
      { type: 'buttonup', button: 4, timestamp: 13 },
    ]);
  });

  it('uses auxclick as an X1/X2 fallback and consumes only the matching native release', () => {
    const fake = createEnvironment();
    const service = createMouseInputService(null, 'basic', fake.environment);
    const events: MouseInputServiceEvent[] = [];
    service.subscribe((event) => events.push(event));
    service.start();

    fake.emitAuxClick(4, 100);
    fake.emitButtonDown(3, 200);
    fake.emitButtonUp(3, 220);
    fake.emitAuxClick(3, 230);
    fake.emitAuxClick(3, 240);
    fake.emitButtonDown(4, 400);
    fake.emitButtonUp(4, 420);
    fake.emitAuxClick(4, 550);
    fake.emitAuxClick(2, 600);

    expect(events).toEqual([
      { type: 'buttondown', button: 4, timestamp: 100 },
      { type: 'buttonup', button: 4, timestamp: 100 },
      { type: 'buttondown', button: 3, timestamp: 200 },
      { type: 'buttonup', button: 3, timestamp: 220 },
      { type: 'buttondown', button: 3, timestamp: 240 },
      { type: 'buttonup', button: 3, timestamp: 240 },
      { type: 'buttondown', button: 4, timestamp: 400 },
      { type: 'buttonup', button: 4, timestamp: 420 },
      { type: 'buttondown', button: 4, timestamp: 550 },
      { type: 'buttonup', button: 4, timestamp: 550 },
    ]);
  });

  it('emits wheel and ordinary movement only in the basic profile', () => {
    const fake = createEnvironment();
    const service = createMouseInputService(null, 'basic', fake.environment);
    const events: MouseInputServiceEvent[] = [];
    service.subscribe((event) => events.push(event));
    service.start();

    fake.emitWheel(0, -100, 0, 20);
    fake.emitBasicMove(3, -2, 21);

    expect(events).toContainEqual({ type: 'wheel', deltaX: 0, deltaY: -100, deltaMode: 0, timestamp: 20 });
    expect(events).toContainEqual({ type: 'move', movementX: 3, movementY: -2, timestamp: 21 });
    expect(fake.getSuppression()).toEqual({ contextSuppressed: true, auxSuppressed: true });
    expect(fake.hasAuxClick()).toBe(true);
  });

  it('emits clear signals for blur and hidden visibility', () => {
    const fake = createEnvironment();
    const service = createMouseInputService(null, 'basic', fake.environment);
    const events: MouseInputServiceEvent[] = [];
    service.subscribe((event) => events.push(event));
    service.start();

    fake.emitBlur();
    fake.hide();

    expect(events).toContainEqual({ type: 'clear', reason: 'blur' });
    expect(events).toContainEqual({ type: 'clear', reason: 'visibility-hidden' });
  });

  it('selects raw pointer samples first and does not attach competing movement sources', () => {
    const fake = createEnvironment({ raw: true, coalesced: true });
    const service = createMouseInputService(null, 'polling', fake.environment);
    const events: MouseInputServiceEvent[] = [];
    service.subscribe((event) => events.push(event));

    expect(service.start()).toBe(true);
    expect(service.getPollingSource()).toBe('raw-pointer');
    expect(fake.hasRaw()).toBe(true);
    expect(fake.hasCoalesced()).toBe(false);
    expect(fake.hasBasic()).toBe(false);
    expect(fake.hasAuxClick()).toBe(false);

    fake.emitRaw([1, 2, Number.NaN, 3]);
    expect(events).toContainEqual({ type: 'poll-samples', source: 'raw-pointer', timestamps: [1, 2, 3] });
  });

  it('uses coalesced pointer samples when raw pointer updates are unavailable', () => {
    const fake = createEnvironment({ raw: false, coalesced: true });
    const service = createMouseInputService(null, 'polling', fake.environment);
    service.start();

    expect(service.getPollingSource()).toBe('coalesced-pointer');
    expect(fake.hasRaw()).toBe(false);
    expect(fake.hasCoalesced()).toBe(true);
    expect(fake.hasBasic()).toBe(false);
  });

  it('falls back to ordinary pointer timestamps before the measurement attempt begins', () => {
    const fake = createEnvironment();
    const service = createMouseInputService(null, 'polling', fake.environment);
    const events: MouseInputServiceEvent[] = [];
    service.subscribe((event) => events.push(event));
    service.start();

    expect(service.getPollingSource()).toBe('basic-pointer');
    expect(fake.hasBasic()).toBe(true);
    fake.emitBasicMove(1, 1, 55);
    expect(events).toContainEqual({ type: 'poll-samples', source: 'basic-pointer', timestamps: [55] });
  });

  it('stop removes acquisition and can be started again', () => {
    const fake = createEnvironment();
    const service = createMouseInputService(null, 'basic', fake.environment);
    const listener = vi.fn();
    service.subscribe(listener);
    service.start();
    service.stop();

    expect(fake.getSuppression()).toEqual({ contextSuppressed: false, auxSuppressed: false });
    expect(fake.hasAuxClick()).toBe(false);
    fake.emitButtonDown(0);
    expect(listener).not.toHaveBeenCalled();

    expect(service.start()).toBe(true);
    fake.emitButtonDown(0, 7);
    expect(listener).toHaveBeenCalledWith({ type: 'buttondown', button: 0, timestamp: 7 });
  });

  it('destroy is idempotent and permanent', () => {
    const fake = createEnvironment();
    const service = createMouseInputService(null, 'basic', fake.environment);
    service.start();
    service.destroy();
    service.destroy();

    expect(service.start()).toBe(false);
    expect(fake.getSuppression()).toEqual({ contextSuppressed: false, auxSuppressed: false });
  });
});
