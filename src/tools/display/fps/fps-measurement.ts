import { median } from '../../../lib/math/median';

const WARMUP_MS = 500;
const WINDOW_MS = 1000;
const TRACE_INTERVAL_MS = 250;
const TRACE_HISTORY_MS = 8000;

export interface TimedValue {
  timestamp: number;
  value: number;
}

export interface FpsMeasurementSnapshot {
  phase: 'warming' | 'measuring';
  fps: number | null;
  medianFrameTimeMs: number | null;
  trace: readonly TimedValue[];
}

export interface FpsMeasurement {
  push(timestamp: number): FpsMeasurementSnapshot;
  reset(): FpsMeasurementSnapshot;
  getSnapshot(): FpsMeasurementSnapshot;
}

const createSnapshot = (
  phase: FpsMeasurementSnapshot['phase'],
  fps: number | null,
  medianFrameTimeMs: number | null,
  trace: readonly TimedValue[],
): FpsMeasurementSnapshot => ({
  phase,
  fps,
  medianFrameTimeMs,
  trace: [...trace],
});

const calculateDeltas = (timestamps: readonly number[]): number[] => {
  const deltas: number[] = [];

  for (let index = 1; index < timestamps.length; index += 1) {
    const previous = timestamps[index - 1];
    const current = timestamps[index];
    if (previous === undefined || current === undefined) {
      continue;
    }

    const delta = current - previous;
    if (Number.isFinite(delta) && delta > 0) {
      deltas.push(delta);
    }
  }

  return deltas;
};

export const createFpsMeasurement = (): FpsMeasurement => {
  let warmupStartedAt: number | null = null;
  let windowTimestamps: number[] = [];
  let trace: TimedValue[] = [];
  let lastTraceTimestamp: number | null = null;
  let snapshot = createSnapshot('warming', null, null, []);

  const reset = (): FpsMeasurementSnapshot => {
    warmupStartedAt = null;
    windowTimestamps = [];
    trace = [];
    lastTraceTimestamp = null;
    snapshot = createSnapshot('warming', null, null, []);
    return snapshot;
  };

  const push = (timestamp: number): FpsMeasurementSnapshot => {
    if (!Number.isFinite(timestamp)) {
      return snapshot;
    }

    if (warmupStartedAt === null) {
      warmupStartedAt = timestamp;
      snapshot = createSnapshot('warming', null, null, trace);
      return snapshot;
    }

    if (timestamp - warmupStartedAt < WARMUP_MS) {
      snapshot = createSnapshot('warming', null, null, trace);
      return snapshot;
    }

    windowTimestamps.push(timestamp);
    const cutoff = timestamp - WINDOW_MS;
    windowTimestamps = windowTimestamps.filter((sample) => sample >= cutoff);

    let fps: number | null = null;
    let medianFrameTimeMs: number | null = null;

    if (windowTimestamps.length >= 2) {
      const firstTimestamp = windowTimestamps[0];
      const lastTimestamp = windowTimestamps.at(-1);
      if (firstTimestamp !== undefined && lastTimestamp !== undefined) {
        const duration = lastTimestamp - firstTimestamp;
        if (Number.isFinite(duration) && duration > 0) {
          fps = ((windowTimestamps.length - 1) * 1000) / duration;
        }
      }

      medianFrameTimeMs = median(calculateDeltas(windowTimestamps));
    }

    if (
      fps !== null &&
      (lastTraceTimestamp === null || timestamp - lastTraceTimestamp >= TRACE_INTERVAL_MS)
    ) {
      trace.push({ timestamp, value: fps });
      lastTraceTimestamp = timestamp;
    }

    trace = trace.filter((point) => point.timestamp >= timestamp - TRACE_HISTORY_MS);
    snapshot = createSnapshot('measuring', fps, medianFrameTimeMs, trace);
    return snapshot;
  };

  return {
    push,
    reset,
    getSnapshot: () => snapshot,
  };
};
