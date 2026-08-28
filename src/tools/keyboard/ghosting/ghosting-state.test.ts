import { describe, expect, it } from 'vitest';
import {
  clearGhostingHeld,
  createKeyboardGhostingObservationState,
  getKeyboardGhostingObservationResult,
  observeGhostingKeyDown,
  observeGhostingKeyUp,
} from './ghosting-state';

describe('keyboard ghosting observation state', () => {
  it('retains the snapshot with the greatest expected-key match count', () => {
    let state = createKeyboardGhostingObservationState(['KeyW', 'KeyA', 'KeyS', 'KeyD']);
    state = observeGhostingKeyDown(state, 'KeyW');
    state = observeGhostingKeyDown(state, 'KeyA');
    state = observeGhostingKeyUp(state, 'KeyA');
    state = observeGhostingKeyDown(state, 'KeyS');
    state = observeGhostingKeyDown(state, 'KeyD');

    const result = getKeyboardGhostingObservationResult(state);
    expect(result.matchedCount).toBe(3);
    expect(result.missingCodes).toEqual(['KeyA']);
  });

  it('does not union equal best snapshots that never existed together', () => {
    let state = createKeyboardGhostingObservationState(['KeyQ', 'KeyW', 'KeyE']);
    state = observeGhostingKeyDown(state, 'KeyQ');
    state = observeGhostingKeyDown(state, 'KeyW');
    state = observeGhostingKeyUp(state, 'KeyW');
    state = observeGhostingKeyDown(state, 'KeyE');

    const result = getKeyboardGhostingObservationResult(state);
    expect(result.matchedCount).toBe(2);
    expect(result.missingCodes).toEqual(['KeyE']);
  });

  it('records unexpected codes without counting them toward the expected match', () => {
    let state = createKeyboardGhostingObservationState(['KeyW', 'KeyA']);
    state = observeGhostingKeyDown(state, 'KeyW');
    state = observeGhostingKeyDown(state, 'KeyE');

    const result = getKeyboardGhostingObservationResult(state);
    expect(result.matchedCount).toBe(1);
    expect(result.additionalDetectedCodes).toEqual(['KeyE']);
  });

  it('evaluates keys already held when the observation window begins', () => {
    const state = createKeyboardGhostingObservationState(
      ['KeyW', 'KeyA', 'ShiftLeft', 'Space'],
      ['KeyW', 'KeyA', 'ShiftLeft'],
    );

    expect(getKeyboardGhostingObservationResult(state).matchedCount).toBe(3);
  });

  it('clears current held state without erasing the best completed snapshot', () => {
    let state = createKeyboardGhostingObservationState(['KeyW', 'KeyA']);
    state = observeGhostingKeyDown(state, 'KeyW');
    state = observeGhostingKeyDown(state, 'KeyA');
    state = clearGhostingHeld(state);

    expect(state.heldCodes.size).toBe(0);
    expect(getKeyboardGhostingObservationResult(state).matchedCount).toBe(2);
  });
});
