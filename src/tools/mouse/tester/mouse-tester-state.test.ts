import { describe, expect, it } from 'vitest';
import { createMouseTesterState, reduceMouseTesterState } from './mouse-tester-state';

describe('Mouse Tester state', () => {
  it('counts button-down events and tracks held state independently', () => {
    let state = createMouseTesterState();
    state = reduceMouseTesterState(state, { type: 'buttondown', button: 0, timestamp: 1 });
    state = reduceMouseTesterState(state, { type: 'buttondown', button: 0, timestamp: 2 });

    expect(state.pressCounts[0]).toBe(2);
    expect(state.heldButtons.has(0)).toBe(true);

    state = reduceMouseTesterState(state, { type: 'buttonup', button: 0, timestamp: 3 });
    expect(state.heldButtons.has(0)).toBe(false);
    expect(state.pressCounts[0]).toBe(2);
  });

  it('clears held state on lifecycle invalidation without losing useful counts', () => {
    let state = createMouseTesterState();
    state = reduceMouseTesterState(state, { type: 'buttondown', button: 3, timestamp: 1 });
    state = reduceMouseTesterState(state, { type: 'clear', reason: 'blur' });

    expect(state.heldButtons.size).toBe(0);
    expect(state.pressCounts[3]).toBe(1);
  });

  it('uses the dominant wheel axis for direction', () => {
    let state = createMouseTesterState();
    state = reduceMouseTesterState(state, {
      type: 'wheel', deltaX: 2, deltaY: -10, deltaMode: 0, timestamp: 1,
    });
    expect(state.wheelDirection).toBe('up');

    state = reduceMouseTesterState(state, {
      type: 'wheel', deltaX: -12, deltaY: 3, deltaMode: 0, timestamp: 2,
    });
    expect(state.wheelDirection).toBe('horizontal');
  });

  it('marks movement only for a non-zero movement event', () => {
    let state = createMouseTesterState();
    state = reduceMouseTesterState(state, { type: 'move', movementX: 0, movementY: 0, timestamp: 1 });
    expect(state.movementDetected).toBe(false);

    state = reduceMouseTesterState(state, { type: 'move', movementX: 1, movementY: 0, timestamp: 2 });
    expect(state.movementDetected).toBe(true);
    expect(state.anyInputDetected).toBe(true);
  });
});
