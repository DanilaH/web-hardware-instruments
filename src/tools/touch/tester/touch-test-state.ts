export const touchGridColumns = 16;
export const touchGridRows = 10;
export const touchGridCellCount = touchGridColumns * touchGridRows;

export type TouchTestMode = 'coverage' | 'confirmation';
export type TouchSamplePhase = 'start' | 'move' | 'end' | 'cancel';

export interface TouchObservedSample {
  readonly phase: TouchSamplePhase;
  readonly contactId: number;
  readonly x: number;
  readonly y: number;
  readonly insideSurface: boolean;
}

export interface TouchTestState {
  readonly mode: TouchTestMode;
  readonly pass1Covered: ReadonlySet<number>;
  readonly pass2Covered: ReadonlySet<number>;
  readonly activeContacts: ReadonlySet<number>;
  readonly maximumDetectedTogether: number;
}

export const createTouchTestState = (): TouchTestState => ({
  mode: 'coverage',
  pass1Covered: new Set(),
  pass2Covered: new Set(),
  activeContacts: new Set(),
  maximumDetectedTogether: 0,
});

export const coverageCellIndex = (
  x: number,
  y: number,
  insideSurface: boolean,
): number | null => {
  if (
    !insideSurface ||
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    x < 0 ||
    x > 1 ||
    y < 0 ||
    y > 1
  ) {
    return null;
  }

  const cellX = Math.min(touchGridColumns - 1, Math.floor(x * touchGridColumns));
  const cellY = Math.min(touchGridRows - 1, Math.floor(y * touchGridRows));
  return cellY * touchGridColumns + cellX;
};

export const observeTouchSample = (
  state: TouchTestState,
  sample: TouchObservedSample,
): TouchTestState => {
  let activeContacts = state.activeContacts;
  let maximumDetectedTogether = state.maximumDetectedTogether;
  let pass1Covered = state.pass1Covered;
  let pass2Covered = state.pass2Covered;
  let changed = false;

  if (sample.phase === 'start') {
    if (!state.activeContacts.has(sample.contactId)) {
      activeContacts = new Set(state.activeContacts);
      activeContacts.add(sample.contactId);
      maximumDetectedTogether = Math.max(maximumDetectedTogether, activeContacts.size);
      changed = true;
    }
  } else if (sample.phase === 'end' || sample.phase === 'cancel') {
    if (state.activeContacts.has(sample.contactId)) {
      activeContacts = new Set(state.activeContacts);
      activeContacts.delete(sample.contactId);
      changed = true;
    }
  }

  if (sample.phase === 'start' || sample.phase === 'move') {
    const cell = coverageCellIndex(sample.x, sample.y, sample.insideSurface);
    if (cell !== null) {
      if (state.mode === 'coverage' && !state.pass1Covered.has(cell)) {
        pass1Covered = new Set(state.pass1Covered);
        pass1Covered.add(cell);
        changed = true;
      }
      if (state.mode === 'confirmation' && !state.pass2Covered.has(cell)) {
        pass2Covered = new Set(state.pass2Covered);
        pass2Covered.add(cell);
        changed = true;
      }
    }
  }

  return changed
    ? { ...state, activeContacts, maximumDetectedTogether, pass1Covered, pass2Covered }
    : state;
};

export const clearActiveContacts = (state: TouchTestState): TouchTestState =>
  state.activeContacts.size === 0 ? state : { ...state, activeContacts: new Set() };

export const startTouchConfirmation = (state: TouchTestState): TouchTestState => ({
  ...state,
  mode: 'confirmation',
  pass2Covered: new Set(),
});

export const coveredCellCount = (state: TouchTestState): number =>
  new Set([...state.pass1Covered, ...state.pass2Covered]).size;

export const coveragePercentage = (state: TouchTestState): number =>
  (coveredCellCount(state) / touchGridCellCount) * 100;

export const repeatableMissedCellCount = (state: TouchTestState): number =>
  touchGridCellCount - coveredCellCount(state);
