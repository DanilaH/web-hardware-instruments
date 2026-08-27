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
  push(timestamp: number): void;
  reset(): void;
  getSnapshot(): FpsMeasurementSnapshot;
}

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
  let phase: FpsMeasurementSnapshot['phase'] = 'warming';
  let latestTimestamp: number | null = null;
  let windowTimestamps: number[] = [];
  let trace: TimedValue[] = [];
  let lastTraceTimestamp: number | null = null;

  const reset = (): void => {
    warmupStartedAt = null;
    phase = 'warming';
    latestTimestamp = null;
    windowTimestamps = [];
    trace = [];
    lastTraceTimestamp = null;
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
    latestTimestamp = timestamp;
    windowTimestamps.push(timestamp);
    const cutoff = timestamp - WINDOW_MS;
    windowTimestamps = windowTimestamps.filter((sample) => sample >= cutoff);
  };

  const getSnapshot = (): FpsMeasurementSnapshot => {
    if (phase === 'warming' || latestTimestamp === null) {
      return {
        phase: 'warming',
        fps: null,
        medianFrameTimeMs: null,
        trace: [],
      };
    }

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
      (lastTraceTimestamp === null || latestTimestamp - lastTraceTimestamp >= TRACE_INTERVAL_MS)
    ) {
      trace.push({ timestamp: latestTimestamp, value: fps });
      lastTraceTimestamp = latestTimestamp;
    }

    trace = trace.filter((point) => point.timestamp >= latestTimestamp - TRACE_HISTORY_MS);

    return {
      phase,
      fps,
      medianFrameTimeMs,
      trace: [...trace],
    };
  };

  return {
    push,
    reset,
    getSnapshot,
  };
};
