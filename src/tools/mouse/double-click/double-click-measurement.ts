export type DoubleClickButtonIndex = 0 | 1 | 2 | 3 | 4;

export const rapidRepeatThresholdMs = 50;

export interface DoubleClickState {
  readonly previousByButton: readonly [
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
  ];
  readonly totalPresses: number;
  readonly rapidRepeatEvents: number;
  readonly shortestGapMs: number | null;
  readonly lastGapMs: number | null;
}

const emptyPrevious = (): [
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
] => [null, null, null, null, null];

export const createDoubleClickState = (): DoubleClickState => ({
  previousByButton: emptyPrevious(),
  totalPresses: 0,
  rapidRepeatEvents: 0,
  shortestGapMs: null,
  lastGapMs: null,
});

export const observeButtonPress = (
  state: DoubleClickState,
  button: DoubleClickButtonIndex,
  timestamp: number,
): DoubleClickState => {
  if (!Number.isFinite(timestamp)) return state;

  const previous = state.previousByButton[button];
  if (previous === null) {
    const previousByButton = [...state.previousByButton] as [
      number | null,
      number | null,
      number | null,
      number | null,
      number | null,
    ];
    previousByButton[button] = timestamp;
    return {
      ...state,
      previousByButton,
      totalPresses: state.totalPresses + 1,
    };
  }

  const gap = timestamp - previous;
  if (!Number.isFinite(gap) || gap <= 0) {
    return {
      ...state,
      totalPresses: state.totalPresses + 1,
    };
  }

  const previousByButton = [...state.previousByButton] as [
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
  ];
  previousByButton[button] = timestamp;

  return {
    previousByButton,
    totalPresses: state.totalPresses + 1,
    rapidRepeatEvents:
      state.rapidRepeatEvents + (gap <= rapidRepeatThresholdMs ? 1 : 0),
    shortestGapMs:
      state.shortestGapMs === null ? gap : Math.min(state.shortestGapMs, gap),
    lastGapMs: gap,
  };
};
