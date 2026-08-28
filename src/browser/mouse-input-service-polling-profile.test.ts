import { describe, expect, it } from 'vitest';
import { createMouseInputService, type MouseInputServiceEnvironment } from './mouse-input-service';

describe('MouseInputService polling profile', () => {
  it('attaches sampling and lifecycle without basic button/wheel suppression', () => {
    let buttonDownAttached = false;
    let buttonUpAttached = false;
    let wheelAttached = false;
    let basicMoveAttached = false;
    let rawListener: ((timestamps: readonly number[]) => void) | null = null;
    let contextSuppressed = false;
    let auxSuppressed = false;

    const environment: MouseInputServiceEnvironment = {
      setButtonDownListener: (listener) => { buttonDownAttached = listener !== null; },
      setButtonUpListener: (listener) => { buttonUpAttached = listener !== null; },
      setWheelListener: (listener) => { wheelAttached = listener !== null; },
      setBasicMoveListener: (listener) => { basicMoveAttached = listener !== null; },
      setRawMoveListener: (listener) => { rawListener = listener; },
      setCoalescedMoveListener: () => undefined,
      setContextMenuSuppression: (enabled) => { contextSuppressed = enabled; },
      setAuxClickSuppression: (enabled) => { auxSuppressed = enabled; },
      setBlurListener: () => undefined,
      setVisibilityListener: () => undefined,
      getVisibilityState: () => 'visible',
      supportsRawPointerUpdate: () => true,
      supportsCoalescedPointerEvents: () => true,
    };

    const service = createMouseInputService(null, 'polling', environment);
    expect(service.start()).toBe(true);
    expect(service.getPollingSource()).toBe('raw-pointer');
    expect(rawListener).not.toBeNull();
    expect({ buttonDownAttached, buttonUpAttached, wheelAttached, basicMoveAttached }).toEqual({
      buttonDownAttached: false,
      buttonUpAttached: false,
      wheelAttached: false,
      basicMoveAttached: false,
    });
    expect({ contextSuppressed, auxSuppressed }).toEqual({
      contextSuppressed: false,
      auxSuppressed: false,
    });
  });
});
