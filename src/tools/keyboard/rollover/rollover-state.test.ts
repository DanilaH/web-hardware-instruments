import { describe, expect, it } from 'vitest';
import {
  clearRolloverHeld,
  createKeyboardRolloverState,
  observeRolloverKeyDown,
  observeRolloverKeyUp,
  resetRolloverMaximum,
} from './rollover-state';

describe('keyboard rollover state', () => {
  it('tracks unique held codes and maximum detected together', () => {
    let state = createKeyboardRolloverState();
    state = observeRolloverKeyDown(state, 'KeyW');
    state = observeRolloverKeyDown(state, 'KeyA');
    state = observeRolloverKeyDown(state, 'KeyS');

    expect([...state.heldCodes]).toEqual(['KeyW', 'KeyA', 'KeyS']);
    expect(state.maximumDetectedTogether).toBe(3);
    expect(state.lastDetectedCode).toBe('KeyS');
  });

  it('does not count repeated keydown for an already-held code', () => {
    const first = observeRolloverKeyDown(createKeyboardRolloverState(), 'KeyW');
    const repeated = observeRolloverKeyDown(first, 'KeyW');

    expect(repeated.heldCodes.size).toBe(1);
    expect(repeated.maximumDetectedTogether).toBe(1);
  });

  it('releases and lifecycle-clears held state without erasing the maximum', () => {
    let state = createKeyboardRolloverState();
    state = observeRolloverKeyDown(state, 'KeyW');
    state = observeRolloverKeyDown(state, 'KeyA');
    state = observeRolloverKeyUp(state, 'KeyW');
    state = clearRolloverHeld(state);

    expect(state.heldCodes.size).toBe(0);
    expect(state.maximumDetectedTogether).toBe(2);
  });

  it('resets maximum to the currently held count so the result stays coherent', () => {
    let state = createKeyboardRolloverState();
    state = observeRolloverKeyDown(state, 'KeyQ');
    state = observeRolloverKeyDown(state, 'KeyW');
    state = observeRolloverKeyDown(state, 'KeyE');
    state = observeRolloverKeyUp(state, 'KeyE');

    const reset = resetRolloverMaximum(state);
    expect(reset.heldCodes.size).toBe(2);
    expect(reset.maximumDetectedTogether).toBe(2);
  });
});
