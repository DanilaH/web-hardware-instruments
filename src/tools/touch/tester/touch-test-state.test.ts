import { describe, expect, it } from 'vitest';
import {
  clearActiveContacts,
  coverageCellIndex,
  coveragePercentage,
  createTouchTestState,
  observeTouchSample,
  repeatableMissedCellCount,
  startTouchConfirmation,
  touchGridCellCount,
} from './touch-test-state';

describe('touch test state', () => {
  it('maps exact normalized boundaries into the final grid cell', () => {
    expect(coverageCellIndex(0, 0, true)).toBe(0);
    expect(coverageCellIndex(1, 1, true)).toBe(touchGridCellCount - 1);
  });

  it('rejects non-finite and out-of-surface samples instead of clamping them', () => {
    expect(coverageCellIndex(1.1, 0.5, false)).toBeNull();
    expect(coverageCellIndex(Number.NaN, 0.5, true)).toBeNull();
  });

  it('marks only observed start/move cells and does not synthesize cells between samples', () => {
    let state = createTouchTestState();
    state = observeTouchSample(state, { phase: 'start', contactId: 1, x: 0.01, y: 0.01, insideSurface: true });
    state = observeTouchSample(state, { phase: 'move', contactId: 1, x: 0.99, y: 0.99, insideSurface: true });
    expect(state.pass1Covered.size).toBe(2);
  });

  it('keeps pass1 and confirmation coverage separate while reporting union coverage', () => {
    let state = createTouchTestState();
    state = observeTouchSample(state, { phase: 'start', contactId: 1, x: 0.01, y: 0.01, insideSurface: true });
    state = startTouchConfirmation(state);
    state = observeTouchSample(state, { phase: 'move', contactId: 1, x: 0.99, y: 0.99, insideSurface: true });
    expect(state.pass1Covered.size).toBe(1);
    expect(state.pass2Covered.size).toBe(1);
    expect(coveragePercentage(state)).toBe(1.25);
    expect(repeatableMissedCellCount(state)).toBe(158);
  });

  it('tracks only contacts observed in the test surface for multi-touch metrics', () => {
    let state = createTouchTestState();
    state = observeTouchSample(state, { phase: 'start', contactId: 1, x: -0.2, y: 0.5, insideSurface: false });
    expect(state.activeContacts.size).toBe(0);
    expect(state.maximumDetectedTogether).toBe(0);

    state = observeTouchSample(state, { phase: 'move', contactId: 1, x: 0.1, y: 0.5, insideSurface: true });
    state = observeTouchSample(state, { phase: 'start', contactId: 2, x: 0.8, y: 0.5, insideSurface: true });
    expect(state.activeContacts.size).toBe(2);
    expect(state.maximumDetectedTogether).toBe(2);

    state = observeTouchSample(state, { phase: 'move', contactId: 1, x: 1.2, y: 0.5, insideSurface: false });
    expect(state.activeContacts.size).toBe(2);

    state = observeTouchSample(state, { phase: 'end', contactId: 1, x: 1.2, y: 0.5, insideSurface: false });
    expect(state.activeContacts.size).toBe(1);
    state = clearActiveContacts(state);
    expect(state.activeContacts.size).toBe(0);
    expect(state.maximumDetectedTogether).toBe(2);
  });

  it('reset state clears coverage, contacts, maximum, and confirmation mode', () => {
    expect(createTouchTestState()).toEqual({
      mode: 'coverage',
      pass1Covered: new Set(),
      pass2Covered: new Set(),
      activeContacts: new Set(),
      maximumDetectedTogether: 0,
    });
  });
});
