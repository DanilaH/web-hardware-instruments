export type MouseButtonIndex = 0 | 1 | 2 | 3 | 4;

export type MouseButtonAction =
  | { type: 'down'; button: MouseButtonIndex }
  | { type: 'up'; button: MouseButtonIndex }
  | { type: 'clear-held' };

export interface MouseButtonState {
  readonly heldButtons: ReadonlySet<MouseButtonIndex>;
  readonly detectedButtons: ReadonlySet<MouseButtonIndex>;
  readonly pressCounts: readonly [number, number, number, number, number];
}

const emptyCounts = (): [number, number, number, number, number] => [0, 0, 0, 0, 0];

export const createMouseButtonState = (): MouseButtonState => ({
  heldButtons: new Set(),
  detectedButtons: new Set(),
  pressCounts: emptyCounts(),
});

export const reduceMouseButtonState = (
  state: MouseButtonState,
  action: MouseButtonAction,
): MouseButtonState => {
  if (action.type === 'clear-held') {
    return { ...state, heldButtons: new Set() };
  }

  if (action.type === 'down') {
    const heldButtons = new Set(state.heldButtons);
    const detectedButtons = new Set(state.detectedButtons);
    const pressCounts = [...state.pressCounts] as [number, number, number, number, number];
    heldButtons.add(action.button);
    detectedButtons.add(action.button);
    pressCounts[action.button] += 1;
    return { heldButtons, detectedButtons, pressCounts };
  }

  const heldButtons = new Set(state.heldButtons);
  heldButtons.delete(action.button);
  return { ...state, heldButtons };
};
