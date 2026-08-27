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

const calculateWindowMetrics = (
  timestamps: readonly number[],
): { fps: number | null; medianFrameTimeMs: number | null } => {
  if (timestamps.length < 2) {
    return { fps: null, medianFrameTimeMs: null };
  }

  const firstTimestamp = timestamps[0];
  const lastTimestamp = timestamps.at(-1);
  let fps: number | null = null;

  if (firstTimestamp !== undefined && lastTimestamp !== undefined) {
    const duration = lastTimestamp - firstTimestamp;
    if (Number.isFinite(duration) && duration > 0) {
      fps = ((timestamps.length - 1) * 1000) / duration;
    }
  }

  return {
    fps,
    medianFrameTimeMs: median(calculateDeltas(timestamps)),
  };
};

export const createFpsMeasurement = (): FpsMeasurement => {
  let warmupStartedAt: number | null = null;
  let phase: FpsMeasurementSnapshot['phase'] = 'warming';
  let windowTimestamps: number[] = [];
  let trace: TimedValue[] = [];
  let lastComputedAt: number | null = null;
  let fps: number | null = null;
  let medianFrameTimeMs: number | null = null;

  const reset = (): void => {
    warmupStartedAt = null;
    phase = 'warming';
    windowTimestamps = [];
    trace = [];
    lastComputedAt = null;
    fps = null;
    medianFrameTimeMs = null;
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
    windowTimestamps.push(timestamp);
    const cutoff = timestamp - WINDOW_MS;
    windowTimestamps = windowTimestamps.filter((sample) => sample >= cutoff);

    if (lastComputedAt !== null && timestamp - lastComputedAt < TRACE_INTERVAL_MS) {
      return;
    }

    lastComputedAt = timestamp;
    const metrics = calculateWindowMetrics(windowTimestamps);
    fps = metrics.fps;
    medianFrameTimeMs = metrics.medianFrameTimeMs;

    if (fps !== null) {
      trace.push({ timestamp, value: fps });
    }

    trace = trace.filter((point) => point.timestamp >= timestamp - TRACE_HISTORY_MS);
  };

  const getSnapshot = (): FpsMeasurementSnapshot => ({
    phase,
    fps,
    medianFrameTimeMs,
    trace: [...trace],
  });

  return {
    push,
    reset,
    getSnapshot,
  };
};
