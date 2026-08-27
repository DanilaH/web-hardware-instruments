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
  push(timestamp: number): void;
  reset(): void;
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

export const createRefreshRateMeasurement = (): RefreshRateMeasurement => {
  let warmupStartedAt: number | null = null;
  let phase: RefreshRateMeasurementSnapshot['phase'] = 'warming';
  let lastTimestamp: number | null = null;
  let intervals: FrameIntervalSample[] = [];

  const reset = (): void => {
    warmupStartedAt = null;
    phase = 'warming';
    lastTimestamp = null;
    intervals = [];
  };

  const push = (timestamp: number): void => {
    if (!Number.isFinite(timestamp)) {
      return;
    }

    if (warmupStartedAt === null) {
      warmupStartedAt = timestamp;
      return;
    }

    if (timestamp - warmupStartedAt < WARMUP_MS) {
      return;
    }

    phase = 'measuring';

    if (lastTimestamp === null) {
      lastTimestamp = timestamp;
      return;
    }

    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (Number.isFinite(delta) && delta > 0) {
      intervals.push({ timestamp, deltaMs: delta });
    }

    const cutoff = timestamp - WINDOW_MS;
    intervals = intervals.filter((sample) => sample.timestamp >= cutoff);
  };

  const getSnapshot = (): RefreshRateMeasurementSnapshot => {
    if (phase === 'warming') {
      return {
        phase: 'warming',
        estimatedHz: null,
        medianFrameTimeMs: null,
        closestCommonMode: null,
        intervals: [],
      };
    }

    const medianFrameTimeMs = median(intervals.map((sample) => sample.deltaMs));
    const estimatedHz =
      medianFrameTimeMs !== null && medianFrameTimeMs > 0 ? 1000 / medianFrameTimeMs : null;
    const mode = estimatedHz === null ? null : closestCommonMode(estimatedHz);

    return {
      phase,
      estimatedHz,
      medianFrameTimeMs,
      closestCommonMode: mode,
      intervals: [...intervals],
    };
  };

  return {
    push,
    reset,
    getSnapshot,
  };
};
