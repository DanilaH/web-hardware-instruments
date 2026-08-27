import type { StickPosition } from '../stick-position';

export interface StickDriftResult {
  meanX: number;
  meanY: number;
  centerOffset: number;
}

export interface ControllerDriftResult {
  left: StickDriftResult;
  right: StickDriftResult;
}

export const calculateStickDrift = (
  samples: readonly StickPosition[],
): StickDriftResult | null => {
  if (samples.length === 0) {
    return null;
  }

  let sumX = 0;
  let sumY = 0;

  for (const sample of samples) {
    if (!Number.isFinite(sample.x) || !Number.isFinite(sample.y)) {
      return null;
    }
    sumX += sample.x;
    sumY += sample.y;
  }

  const meanX = sumX / samples.length;
  const meanY = sumY / samples.length;
  const centerOffset = Math.hypot(meanX, meanY);

  return Number.isFinite(centerOffset)
    ? { meanX, meanY, centerOffset }
    : null;
};

export const calculateControllerDrift = (
  leftSamples: readonly StickPosition[],
  rightSamples: readonly StickPosition[],
): ControllerDriftResult | null => {
  const left = calculateStickDrift(leftSamples);
  const right = calculateStickDrift(rightSamples);

  return left && right ? { left, right } : null;
};

export const formatCenterOffsetPercent = (centerOffset: number): string =>
  `${(centerOffset * 100).toFixed(1)}%`;
