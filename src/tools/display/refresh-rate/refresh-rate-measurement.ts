import { median } from '../../../lib/math/median';

const WARMUP_MS = 500;
const WINDOW_MS = 1500;

export const COMMON_REFRESH_MODES = [
  30, 50, 60, 72, 75, 90, 100, 120, 144, 165, 180, 200, 240, 360, 480,
] as const;

export interface FrameIntervalSample {
  timestamp: number;
  deltaMs: number;
}

export interface RefreshRateMeasurementSnapshot {
  phase: 'warming' | 'measuring';
  estimatedHz: number | null;
  medianFrameTimeMs: number | null;
  closestCommonMode: number | null;
  intervals: readonly FrameIntervalSample[];
}

export interface RefreshRateMeasurement {
  push(timestamp: number): RefreshRateMeasurementSnapshot;
  reset(): RefreshRateMeasurementSnapshot;
  getSnapshot(): RefreshRateMeasurementSnapshot;
}

const closestCommonMode = (estimate: number): number | null => {
  let nearest: number | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const mode of COMMON_REFRESH_MODES) {
    const distance = Math.abs(estimate - mode);
    if (distance < nearestDistance) {
      nearest = mode;
      nearestDistance = distance;
    }
  }

  if (nearest === null) {
    return null;
  }

  return Math.abs(estimate - nearest) / nearest <= 0.03 ? nearest : null;
};

const createSnapshot = (
  phase: RefreshRateMeasurementSnapshot['phase'],
  estimatedHz: number | null,
  medianFrameTimeMs: number | null,
  mode: number | null,
  intervals: readonly FrameIntervalSample[],
): RefreshRateMeasurementSnapshot => ({
  phase,
  estimatedHz,
  medianFrameTimeMs,
  closestCommonMode: mode,
  intervals: [...intervals],
});

export const createRefreshRateMeasurement = (): RefreshRateMeasurement => {
  let warmupStartedAt: number | null = null;
  let lastTimestamp: number | null = null;
  let intervals: FrameIntervalSample[] = [];
  let snapshot = createSnapshot('warming', null, null, null, []);

  const reset = (): RefreshRateMeasurementSnapshot => {
    warmupStartedAt = null;
    lastTimestamp = null;
    intervals = [];
    snapshot = createSnapshot('warming', null, null, null, []);
    return snapshot;
  };

  const push = (timestamp: number): RefreshRateMeasurementSnapshot => {
    if (!Number.isFinite(timestamp)) {
      return snapshot;
    }

    if (warmupStartedAt === null) {
      warmupStartedAt = timestamp;
      snapshot = createSnapshot('warming', null, null, null, intervals);
      return snapshot;
    }

    if (timestamp - warmupStartedAt < WARMUP_MS) {
      snapshot = createSnapshot('warming', null, null, null, intervals);
      return snapshot;
    }

    if (lastTimestamp === null) {
      lastTimestamp = timestamp;
      snapshot = createSnapshot('measuring', null, null, null, intervals);
      return snapshot;
    }

    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (Number.isFinite(delta) && delta > 0) {
      intervals.push({ timestamp, deltaMs: delta });
    }

    const cutoff = timestamp - WINDOW_MS;
    intervals = intervals.filter((sample) => sample.timestamp >= cutoff);

    const medianFrameTimeMs = median(intervals.map((sample) => sample.deltaMs));
    const estimatedHz =
      medianFrameTimeMs !== null && medianFrameTimeMs > 0 ? 1000 / medianFrameTimeMs : null;
    const mode = estimatedHz === null ? null : closestCommonMode(estimatedHz);

    snapshot = createSnapshot('measuring', estimatedHz, medianFrameTimeMs, mode, intervals);
    return snapshot;
  };

  return {
    push,
    reset,
    getSnapshot: () => snapshot,
  };
};
