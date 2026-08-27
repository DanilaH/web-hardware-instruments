import { describe, expect, it } from 'vitest';

import {
  calculateDeadzoneMeasurement,
  formatCenterNoisePercent,
  percentile95NearestRank,
} from './controller-deadzone-measurement';

describe('controller deadzone measurement', () => {
  it('uses nearest-rank p95 deterministically', () => {
    const values = Array.from({ length: 20 }, (_, index) => index + 1);
    expect(percentile95NearestRank(values)).toBe(19);
    expect(percentile95NearestRank([3, 1, 2])).toBe(3);
    expect(percentile95NearestRank([])).toBeNull();
  });

  it('calculates radial p95 noise and adds one percentage point for the suggestion', () => {
    const samples = Array.from({ length: 20 }, (_, index) => ({
      x: (index + 1) / 1000,
      y: 0,
    }));

    const result = calculateDeadzoneMeasurement(samples);

    expect(result?.centerNoise).toBeCloseTo(0.019);
    expect(result?.suggestedDeadzone).toBeCloseTo(0.029);
    expect(result?.suggestedPercent).toBe(3);
    expect(formatCenterNoisePercent(result?.centerNoise ?? 0)).toBe('1.9%');
  });

  it('does not round an exact whole-percent suggestion up again', () => {
    const result = calculateDeadzoneMeasurement([{ x: 0.03, y: 0 }]);
    expect(result?.suggestedDeadzone).toBeCloseTo(0.04);
    expect(result?.suggestedPercent).toBe(4);
  });

  it('caps the suggested deadzone at 100 percent', () => {
    const result = calculateDeadzoneMeasurement([{ x: 1, y: 1 }]);
    expect(result?.suggestedDeadzone).toBe(1);
    expect(result?.suggestedPercent).toBe(100);
  });

  it('rejects non-finite values instead of manufacturing a result', () => {
    expect(calculateDeadzoneMeasurement([{ x: Number.NaN, y: 0 }])).toBeNull();
    expect(percentile95NearestRank([0.01, Number.POSITIVE_INFINITY])).toBeNull();
  });
});
