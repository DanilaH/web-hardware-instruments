export type ScrollDirection = 'up' | 'down' | 'left' | 'right';

export interface MouseScrollState {
  readonly up: number;
  readonly down: number;
  readonly left: number;
  readonly right: number;
  readonly recent: readonly ScrollDirection[];
}

export const createMouseScrollState = (): MouseScrollState => ({
  up: 0,
  down: 0,
  left: 0,
  right: 0,
  recent: [],
});

export const directionFromWheel = (deltaX: number, deltaY: number): ScrollDirection | null => {
  if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY) || (deltaX === 0 && deltaY === 0)) {
    return null;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX < 0 ? 'left' : 'right';
  }
  return deltaY < 0 ? 'up' : deltaY > 0 ? 'down' : deltaX < 0 ? 'left' : 'right';
};

export const observeWheel = (
  state: MouseScrollState,
  deltaX: number,
  deltaY: number,
): MouseScrollState => {
  const direction = directionFromWheel(deltaX, deltaY);
  if (!direction) return state;

  return {
    up: state.up + (direction === 'up' ? 1 : 0),
    down: state.down + (direction === 'down' ? 1 : 0),
    left: state.left + (direction === 'left' ? 1 : 0),
    right: state.right + (direction === 'right' ? 1 : 0),
    recent: [...state.recent, direction].slice(-24),
  };
};
