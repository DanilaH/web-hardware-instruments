import type { MouseInputServiceEvent, MouseSemanticButton } from '../../../browser/mouse-input-service';

export interface MouseButtonState {
  readonly heldButtons: ReadonlySet<MouseSemanticButton>;
  readonly detectedButtons: ReadonlySet<MouseSemanticButton>;
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
  event: MouseInputServiceEvent,
): MouseButtonState => {
  if (event.type === 'clear') {
    return { ...state, heldButtons: new Set() };
  }
  if (event.type === 'buttondown') {
    const heldButtons = new Set(state.heldButtons);
    const detectedButtons = new Set(state.detectedButtons);
    const pressCounts = [...state.pressCounts] as [number, number, number, number, number];
    heldButtons.add(event.button);
    detectedButtons.add(event.button);
    pressCounts[event.button] += 1;
    return { heldButtons, detectedButtons, pressCounts };
  }
  if (event.type === 'buttonup') {
    const heldButtons = new Set(state.heldButtons);
    heldButtons.delete(event.button);
    return { ...state, heldButtons };
  }
  return state;
};
