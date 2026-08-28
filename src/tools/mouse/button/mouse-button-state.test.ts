import { describe, expect, it } from 'vitest';
import { createMouseButtonState, reduceMouseButtonState } from './mouse-button-state';

describe('mouse button state', () => {
  it('counts button-down and marks the semantic button detected', () => {
    const state = reduceMouseButtonState(createMouseButtonState(), { type: 'buttondown', button: 3, timestamp: 10 });
    expect(state.pressCounts[3]).toBe(1);
    expect(state.detectedButtons.has(3)).toBe(true);
    expect(state.heldButtons.has(3)).toBe(true);
  });

  it('releases held state without erasing detection or count', () => {
    const down = reduceMouseButtonState(createMouseButtonState(), { type: 'buttondown', button: 2, timestamp: 10 });
    const up = reduceMouseButtonState(down, { type: 'buttonup', button: 2, timestamp: 20 });
    expect(up.heldButtons.has(2)).toBe(false);
    expect(up.detectedButtons.has(2)).toBe(true);
    expect(up.pressCounts[2]).toBe(1);
  });

  it('clears only held state on lifecycle invalidation', () => {
    const down = reduceMouseButtonState(createMouseButtonState(), { type: 'buttondown', button: 0, timestamp: 10 });
    const cleared = reduceMouseButtonState(down, { type: 'clear', reason: 'blur' });
    expect(cleared.heldButtons.size).toBe(0);
    expect(cleared.detectedButtons.has(0)).toBe(true);
  });

  it('ignores non-button input', () => {
    const initial = createMouseButtonState();
    expect(reduceMouseButtonState(initial, { type: 'wheel', deltaX: 0, deltaY: 1, deltaMode: 0, timestamp: 1 })).toBe(initial);
  });
});
