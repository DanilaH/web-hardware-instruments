import type { MouseInputServiceEvent, MouseSemanticButton } from '../../../browser/mouse-input-service';

export type MouseWheelDirection = 'up' | 'down' | 'horizontal' | null;

export interface MouseTesterState {
  readonly heldButtons: ReadonlySet<MouseSemanticButton>;
  readonly pressCounts: readonly [number, number, number, number, number];
  readonly wheelDirection: MouseWheelDirection;
  readonly movementDetected: boolean;
  readonly anyInputDetected: boolean;
}

const emptyCounts = (): [number, number, number, number, number] => [0, 0, 0, 0, 0];

export const createMouseTesterState = (): MouseTesterState => ({
  heldButtons: new Set(),
  pressCounts: emptyCounts(),
  wheelDirection: null,
  movementDetected: false,
  anyInputDetected: false,
});

const wheelDirectionFromEvent = (
  event: Extract<MouseInputServiceEvent, { type: 'wheel' }>,
): MouseWheelDirection => {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY) && event.deltaX !== 0) {
    return 'horizontal';
  }
  if (event.deltaY < 0) {
    return 'up';
  }
  if (event.deltaY > 0) {
    return 'down';
  }
  return event.deltaX !== 0 ? 'horizontal' : null;
};

export const reduceMouseTesterState = (
  state: MouseTesterState,
  event: MouseInputServiceEvent,
): MouseTesterState => {
  if (event.type === 'clear') {
    return { ...state, heldButtons: new Set() };
  }

  if (event.type === 'buttondown') {
    const heldButtons = new Set(state.heldButtons);
    heldButtons.add(event.button);
    const pressCounts = [...state.pressCounts] as [number, number, number, number, number];
    pressCounts[event.button] += 1;
    return {
      ...state,
      heldButtons,
      pressCounts,
      anyInputDetected: true,
    };
  }

  if (event.type === 'buttonup') {
    const heldButtons = new Set(state.heldButtons);
    heldButtons.delete(event.button);
    return { ...state, heldButtons };
  }

  if (event.type === 'wheel') {
    const direction = wheelDirectionFromEvent(event);
    if (direction === null) {
      return state;
    }
    return {
      ...state,
      wheelDirection: direction,
      anyInputDetected: true,
    };
  }

  if (event.type === 'move') {
    if (event.movementX === 0 && event.movementY === 0) {
      return state;
    }
    return {
      ...state,
      movementDetected: true,
      anyInputDetected: true,
    };
  }

  return state;
};
