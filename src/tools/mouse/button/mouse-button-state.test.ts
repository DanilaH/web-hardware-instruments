import { describe, expect, it } from 'vitest';
import { createMouseButtonState, reduceMouseButtonState } from './mouse-button-state';

describe('mouse button state', () => {
  it('counts a down action and marks the semantic button detected', () => {
    const state = reduceMouseButtonState(createMouseButtonState(), { type: 'down', button: 3 });
    expect(state.pressCounts[3]).toBe(1);
    expect(state.detectedButtons.has(3)).toBe(true);
    expect(state.heldButtons.has(3)).toBe(true);
  });

  it('releases held state without erasing detection or count', () => {
    const down = reduceMouseButtonState(createMouseButtonState(), { type: 'down', button: 2 });
    const up = reduceMouseButtonState(down, { type: 'up', button: 2 });
    expect(up.heldButtons.has(2)).toBe(false);
    expect(up.detectedButtons.has(2)).toBe(true);
    expect(up.pressCounts[2]).toBe(1);
  });

  it('clears only held state on lifecycle invalidation', () => {
    const down = reduceMouseButtonState(createMouseButtonState(), { type: 'down', button: 0 });
    const cleared = reduceMouseButtonState(down, { type: 'clear-held' });
    expect(cleared.heldButtons.size).toBe(0);
    expect(cleared.detectedButtons.has(0)).toBe(true);
  });
});
