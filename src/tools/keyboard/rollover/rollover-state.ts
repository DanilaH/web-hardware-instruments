export interface KeyboardRolloverState {
  readonly heldCodes: ReadonlySet<string>;
  readonly maximumDetectedTogether: number;
}

export const createKeyboardRolloverState = (): KeyboardRolloverState => ({
  heldCodes: new Set(),
  maximumDetectedTogether: 0,
});

export const observeRolloverKeyDown = (
  state: KeyboardRolloverState,
  code: string,
): KeyboardRolloverState => {
  if (!code || state.heldCodes.has(code)) return state;

  const heldCodes = new Set(state.heldCodes);
  heldCodes.add(code);
  return {
    heldCodes,
    maximumDetectedTogether: Math.max(state.maximumDetectedTogether, heldCodes.size),
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
