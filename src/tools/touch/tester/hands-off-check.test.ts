import { describe, expect, it } from 'vitest';
import {
  armHandsOffCheck,
  beginHandsOffCheck,
  completeHandsOffCheck,
  createHandsOffState,
  interruptHandsOffCheck,
  observeHandsOffContactStart,
  observeHandsOffContactsEmpty,
} from './hands-off-check';

describe('hands-off check state', () => {
  it('waits for existing contacts before beginning the quiet guard', () => {
    let state = beginHandsOffCheck(2);
    expect(state.phase).toBe('waiting-for-empty');
    state = observeHandsOffContactsEmpty(state);
    expect(state.phase).toBe('guarding');
  });

  it('restarts the guard after a touch begins during the quiet interval', () => {
    let state = beginHandsOffCheck(0);
    state = observeHandsOffContactStart(state, null);
    expect(state.phase).toBe('waiting-for-empty');
    state = observeHandsOffContactsEmpty(state);
    expect(state.phase).toBe('guarding');
  });

  it('counts only new starts while armed and bounds visible markers', () => {
    let state = armHandsOffCheck(beginHandsOffCheck(0));
    for (let index = 0; index < 15; index += 1) {
      state = observeHandsOffContactStart(state, { x: index / 20, y: index / 20 });
    }
    expect(state.unexpectedStarts).toBe(15);
    expect(state.markers).toHaveLength(12);
  });

  it('completes only from armed state and preserves the observed count', () => {
    let state = armHandsOffCheck(beginHandsOffCheck(0));
    state = observeHandsOffContactStart(state, null);
    state = completeHandsOffCheck(state);
    expect(state.phase).toBe('complete');
    expect(state.unexpectedStarts).toBe(1);
  });

  it('interrupts an active run without producing a partial result', () => {
    let state = armHandsOffCheck(beginHandsOffCheck(0));
    state = observeHandsOffContactStart(state, { x: 0.5, y: 0.5 });
    state = interruptHandsOffCheck(state);
    expect(state).toEqual({ phase: 'interrupted', unexpectedStarts: 0, markers: [] });
    expect(interruptHandsOffCheck(createHandsOffState())).toEqual(createHandsOffState());
  });
});
