export type HandsOffPhase =
  | 'idle'
  | 'waiting-for-empty'
  | 'guarding'
  | 'armed'
  | 'complete'
  | 'interrupted';

export interface HandsOffMarker {
  readonly x: number;
  readonly y: number;
}

export interface HandsOffState {
  readonly phase: HandsOffPhase;
  readonly unexpectedStarts: number;
  readonly markers: readonly HandsOffMarker[];
}

export const createHandsOffState = (): HandsOffState => ({
  phase: 'idle',
  unexpectedStarts: 0,
  markers: [],
});

export const beginHandsOffCheck = (activeContactCount: number): HandsOffState => ({
  phase: activeContactCount === 0 ? 'guarding' : 'waiting-for-empty',
  unexpectedStarts: 0,
  markers: [],
});

export const observeHandsOffContactStart = (
  state: HandsOffState,
  marker: HandsOffMarker | null,
): HandsOffState => {
  if (state.phase === 'guarding') {
    return { ...state, phase: 'waiting-for-empty' };
  }

  if (state.phase !== 'armed') return state;

  return {
    ...state,
    unexpectedStarts: state.unexpectedStarts + 1,
    markers: marker ? [...state.markers, marker].slice(-12) : state.markers,
  };
};

export const observeHandsOffActiveContact = (state: HandsOffState): HandsOffState =>
  state.phase === 'guarding' ? { ...state, phase: 'waiting-for-empty' } : state;

export const observeHandsOffContactsEmpty = (state: HandsOffState): HandsOffState =>
  state.phase === 'waiting-for-empty' ? { ...state, phase: 'guarding' } : state;

export const armHandsOffCheck = (state: HandsOffState): HandsOffState =>
  state.phase === 'guarding' ? { ...state, phase: 'armed' } : state;

export const completeHandsOffCheck = (state: HandsOffState): HandsOffState =>
  state.phase === 'armed' ? { ...state, phase: 'complete' } : state;

export const interruptHandsOffCheck = (state: HandsOffState): HandsOffState =>
  state.phase === 'waiting-for-empty' || state.phase === 'guarding' || state.phase === 'armed'
    ? { phase: 'interrupted', unexpectedStarts: 0, markers: [] }
    : state;
