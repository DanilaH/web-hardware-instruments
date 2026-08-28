export const frameSkippingWarmupMs = 1_000;
export const frameSkippingDeltaWindowSize = 60;
export const frameSkippingRecentCheckSize = 30;
export const frameSkippingStabilityMultiplier = 1.5;
export const frameSkippingSlotCount = 48;

export interface FrameSkippingReadinessState {
  readonly firstTimestamp: number | null;
  readonly lastSampleTimestamp: number | null;
  readonly deltas: readonly number[];
  readonly ready: boolean;
  readonly frameOrdinal: number | null;
  readonly epochPreviousTimestamp: number | null;
}

export interface FrameSkippingReadinessSnapshot {
  readonly phase: 'warming' | 'waiting' | 'ready';
  readonly ready: boolean;
  readonly frameOrdinal: number | null;
  readonly slot: number | null;
  readonly medianDeltaMs: number | null;
  readonly collectedDeltas: number;
}

export const createFrameSkippingReadinessState = (): FrameSkippingReadinessState => ({
  firstTimestamp: null,
  lastSampleTimestamp: null,
  deltas: [],
  ready: false,
  frameOrdinal: null,
  epochPreviousTimestamp: null,
});

const median = (values: readonly number[]): number | null => {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[middle] ?? null;
  const lower = sorted[middle - 1];
  const upper = sorted[middle];
  return lower === undefined || upper === undefined ? null : (lower + upper) / 2;
};

const appendDelta = (deltas: readonly number[], delta: number): readonly number[] =>
  [...deltas, delta].slice(-frameSkippingDeltaWindowSize);

const hasStableRecentCadence = (deltas: readonly number[], liveMedian: number | null): boolean => {
  if (
    deltas.length < frameSkippingRecentCheckSize ||
    liveMedian === null ||
    !Number.isFinite(liveMedian) ||
    liveMedian <= 0
  ) {
    return false;
  }

  const threshold = frameSkippingStabilityMultiplier * liveMedian;
  return deltas
    .slice(-frameSkippingRecentCheckSize)
    .every((delta) => Number.isFinite(delta) && delta > 0 && delta < threshold);
};

export const pushFrameSkippingSample = (
  state: FrameSkippingReadinessState,
  timestamp: number,
): FrameSkippingReadinessState => {
  if (!Number.isFinite(timestamp)) return state;

  if (state.firstTimestamp === null || state.lastSampleTimestamp === null) {
    return {
      firstTimestamp: timestamp,
      lastSampleTimestamp: timestamp,
      deltas: [],
      ready: false,
      frameOrdinal: null,
      epochPreviousTimestamp: null,
    };
  }

  const delta = timestamp - state.lastSampleTimestamp;
  if (!Number.isFinite(delta) || delta <= 0) {
    return {
      ...state,
      lastSampleTimestamp: timestamp,
      ready: false,
      frameOrdinal: null,
      epochPreviousTimestamp: null,
    };
  }

  const deltas = appendDelta(state.deltas, delta);
  const liveMedian = median(deltas);
  const warmupComplete = timestamp - state.firstTimestamp >= frameSkippingWarmupMs;
  const cadenceStable = warmupComplete && hasStableRecentCadence(deltas, liveMedian);

  if (!cadenceStable) {
    return {
      ...state,
      lastSampleTimestamp: timestamp,
      deltas,
      ready: false,
      frameOrdinal: null,
      epochPreviousTimestamp: null,
    };
  }

  if (!state.ready || state.frameOrdinal === null || state.epochPreviousTimestamp === null) {
    return {
      ...state,
      lastSampleTimestamp: timestamp,
      deltas,
      ready: true,
      frameOrdinal: 0,
      epochPreviousTimestamp: timestamp,
    };
  }

  return {
    ...state,
    lastSampleTimestamp: timestamp,
    deltas,
    ready: true,
    frameOrdinal: state.frameOrdinal + 1,
    epochPreviousTimestamp: timestamp,
  };
};

export const getFrameSkippingReadinessSnapshot = (
  state: FrameSkippingReadinessState,
): FrameSkippingReadinessSnapshot => {
  const liveMedian = median(state.deltas);
  const warmupElapsed =
    state.firstTimestamp !== null && state.lastSampleTimestamp !== null
      ? state.lastSampleTimestamp - state.firstTimestamp
      : 0;
  const phase = state.ready
    ? 'ready'
    : warmupElapsed < frameSkippingWarmupMs || state.deltas.length < frameSkippingRecentCheckSize
      ? 'warming'
      : 'waiting';

  return {
    phase,
    ready: state.ready,
    frameOrdinal: state.frameOrdinal,
    slot: state.ready && state.frameOrdinal !== null
      ? state.frameOrdinal % frameSkippingSlotCount
      : null,
    medianDeltaMs: liveMedian,
    collectedDeltas: state.deltas.length,
  };
};
