import type { GamepadSnapshot } from '../../../browser/gamepad-service';
import type { StickPosition } from '../drift/stick-drift-measurement';

export type StickSide = 'left' | 'right';

export interface DeadzoneMeasurementResult {
  centerNoise: number;
  suggestedDeadzone: number;
  suggestedPercent: number;
}

export const getStandardStickPosition = (
  gamepad: GamepadSnapshot,
  side: StickSide,
): StickPosition | null => {
  if (gamepad.mapping !== 'standard' || gamepad.axes.length < 4) {
    return null;
  }

  const offset = side === 'left' ? 0 : 2;
  return {
    x: gamepad.axes[offset] ?? 0,
    y: gamepad.axes[offset + 1] ?? 0,
  };
};

export const percentile95NearestRank = (values: readonly number[]): number | null => {
  if (values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.ceil(0.95 * sorted.length);
  return sorted[Math.max(0, rank - 1)] ?? null;
};

export const calculateDeadzoneMeasurement = (
  samples: readonly StickPosition[],
): DeadzoneMeasurementResult | null => {
  if (samples.length === 0) {
    return null;
  }

  const magnitudes: number[] = [];
  for (const sample of samples) {
    if (!Number.isFinite(sample.x) || !Number.isFinite(sample.y)) {
      return null;
    }
    magnitudes.push(Math.hypot(sample.x, sample.y));
  }

  const centerNoise = percentile95NearestRank(magnitudes);
  if (centerNoise === null) {
    return null;
  }

  const suggestedDeadzone = Math.min(1, centerNoise + 0.01);
  const suggestedPercent = Math.ceil(Number((suggestedDeadzone * 100).toFixed(10)));

  return {
    centerNoise,
    suggestedDeadzone,
    suggestedPercent,
  };
};

export const formatCenterNoisePercent = (centerNoise: number): string =>
  `${(centerNoise * 100).toFixed(1)}%`;
