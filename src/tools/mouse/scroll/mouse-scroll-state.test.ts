import { describe, expect, it } from 'vitest';
import { createMouseScrollState, directionFromWheel, observeWheel } from './mouse-scroll-state';

describe('mouse scroll state', () => {
  it('classifies vertical and dominant horizontal wheel events', () => {
    expect(directionFromWheel(0, -2)).toBe('up');
    expect(directionFromWheel(0, 2)).toBe('down');
    expect(directionFromWheel(4, 1)).toBe('horizontal');
  });

  it('ignores zero/non-finite movement', () => {
    expect(directionFromWheel(0, 0)).toBeNull();
    expect(directionFromWheel(Number.NaN, 1)).toBeNull();
  });

  it('counts directions and bounds the recent strip to 24 events', () => {
    let state = createMouseScrollState();
    for (let index = 0; index < 30; index += 1) {
      state = observeWheel(state, 0, index % 2 ? 1 : -1);
    }

    expect(state.up).toBe(15);
    expect(state.down).toBe(15);
    expect(state.recent).toHaveLength(24);
  });
});
