import { describe, expect, it } from 'vitest';
import { createMouseScrollState, directionFromWheel, reduceMouseScrollState } from './mouse-scroll-state';

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
    for (let i = 0; i < 30; i += 1) state = reduceMouseScrollState(state, { type: 'wheel', deltaX: 0, deltaY: i % 2 ? 1 : -1, deltaMode: 0, timestamp: i });
    expect(state.up).toBe(15); expect(state.down).toBe(15); expect(state.recent).toHaveLength(24);
  });
});
