export interface KeyboardRolloverState {
  readonly heldCodes: ReadonlySet<string>;
  readonly maximumDetectedTogether: number;
  readonly lastDetectedCode: string | null;
}

export const createKeyboardRolloverState = (): KeyboardRolloverState => ({
  heldCodes: new Set(),
  maximumDetectedTogether: 0,
  lastDetectedCode: null,
});

export const observeRolloverKeyDown = (
  state: KeyboardRolloverState,
  code: string,
): KeyboardRolloverState => {
  if (!code) return state;

  if (state.heldCodes.has(code)) {
    return state.lastDetectedCode === code ? state : { ...state, lastDetectedCode: code };
  }

  const heldCodes = new Set(state.heldCodes);
  heldCodes.add(code);
  return {
    heldCodes,
    maximumDetectedTogether: Math.max(state.maximumDetectedTogether, heldCodes.size),
    lastDetectedCode: code,
  };
};

export const observeRolloverKeyUp = (
  state: KeyboardRolloverState,
  code: string,
): KeyboardRolloverState => {
  if (!code || !state.heldCodes.has(code)) return state;
  const heldCodes = new Set(state.heldCodes);
  heldCodes.delete(code);
  return { ...state, heldCodes };
};

export const clearRolloverHeld = (state: KeyboardRolloverState): KeyboardRolloverState =>
  state.heldCodes.size === 0 ? state : { ...state, heldCodes: new Set() };

export const resetRolloverMaximum = (state: KeyboardRolloverState): KeyboardRolloverState => ({
  ...state,
  maximumDetectedTogether: state.heldCodes.size,
});
