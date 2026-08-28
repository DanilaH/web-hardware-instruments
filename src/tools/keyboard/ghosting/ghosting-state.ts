export interface KeyboardGhostingObservationState {
  readonly expectedCodes: ReadonlySet<string>;
  readonly heldCodes: ReadonlySet<string>;
  readonly bestMatchedCodes: ReadonlySet<string>;
  readonly additionalDetectedCodes: ReadonlySet<string>;
}

const matchedExpectedCodes = (
  expectedCodes: ReadonlySet<string>,
  heldCodes: ReadonlySet<string>,
): ReadonlySet<string> => {
  const matched = new Set<string>();
  expectedCodes.forEach((code) => {
    if (heldCodes.has(code)) matched.add(code);
  });
  return matched;
};

const extrasFromHeld = (
  expectedCodes: ReadonlySet<string>,
  heldCodes: ReadonlySet<string>,
): ReadonlySet<string> => {
  const extras = new Set<string>();
  heldCodes.forEach((code) => {
    if (!expectedCodes.has(code)) extras.add(code);
  });
  return extras;
};

const evaluateSnapshot = (
  state: KeyboardGhostingObservationState,
  heldCodes: ReadonlySet<string>,
  additionalDetectedCodes: ReadonlySet<string>,
): KeyboardGhostingObservationState => {
  const matched = matchedExpectedCodes(state.expectedCodes, heldCodes);
  return {
    ...state,
    heldCodes,
    bestMatchedCodes:
      matched.size > state.bestMatchedCodes.size ? matched : state.bestMatchedCodes,
    additionalDetectedCodes,
  };
};

export const createKeyboardGhostingObservationState = (
  expectedCodes: readonly string[],
  initiallyHeldCodes: readonly string[] = [],
): KeyboardGhostingObservationState => {
  const expected = new Set(expectedCodes.filter(Boolean));
  const held = new Set(initiallyHeldCodes.filter(Boolean));
  const initial: KeyboardGhostingObservationState = {
    expectedCodes: expected,
    heldCodes: held,
    bestMatchedCodes: new Set(),
    additionalDetectedCodes: extrasFromHeld(expected, held),
  };
  return evaluateSnapshot(initial, held, initial.additionalDetectedCodes);
};

export const observeGhostingKeyDown = (
  state: KeyboardGhostingObservationState,
  code: string,
): KeyboardGhostingObservationState => {
  if (!code || state.heldCodes.has(code)) return state;

  const heldCodes = new Set(state.heldCodes);
  heldCodes.add(code);
  const additionalDetectedCodes = new Set(state.additionalDetectedCodes);
  if (!state.expectedCodes.has(code)) additionalDetectedCodes.add(code);
  return evaluateSnapshot(state, heldCodes, additionalDetectedCodes);
};

export const observeGhostingKeyUp = (
  state: KeyboardGhostingObservationState,
  code: string,
): KeyboardGhostingObservationState => {
  if (!code || !state.heldCodes.has(code)) return state;
  const heldCodes = new Set(state.heldCodes);
  heldCodes.delete(code);
  return { ...state, heldCodes };
};

export const clearGhostingHeld = (
  state: KeyboardGhostingObservationState,
): KeyboardGhostingObservationState =>
  state.heldCodes.size === 0 ? state : { ...state, heldCodes: new Set() };

export interface KeyboardGhostingObservationResult {
  readonly expectedCount: number;
  readonly matchedCount: number;
  readonly missingCodes: readonly string[];
  readonly additionalDetectedCodes: readonly string[];
}

export const getKeyboardGhostingObservationResult = (
  state: KeyboardGhostingObservationState,
): KeyboardGhostingObservationResult => ({
  expectedCount: state.expectedCodes.size,
  matchedCount: state.bestMatchedCodes.size,
  missingCodes: [...state.expectedCodes].filter((code) => !state.bestMatchedCodes.has(code)),
  additionalDetectedCodes: [...state.additionalDetectedCodes],
});
