import { describe, expect, it } from 'vitest';

import {
  calculateControllerDrift,
  calculateStickDrift,
  formatCenterOffsetPercent,
} from './stick-drift-measurement';

describe('stick drift measurement', () => {
  it('calculates center offset from the mean x/y position', () => {
    const result = calculateStickDrift([
      { x: 0.03, y: 0.04 },
      { x: 0.05, y: 0.02 },
    ]);

    expect(result?.meanX).toBeCloseTo(0.04);
    expect(result?.meanY).toBeCloseTo(0.03);
    expect(result?.centerOffset).toBeCloseTo(0.05);
    expect(formatCenterOffsetPercent(result?.centerOffset ?? 0)).toBe('5.0%');
  });

  it('keeps opposite jitter from becoming a false center offset', () => {
    const result = calculateStickDrift([
      { x: 0.1, y: 0 },
      { x: -0.1, y: 0 },
      { x: 0, y: 0.1 },
      { x: 0, y: -0.1 },
    ]);

    expect(result?.centerOffset).toBeCloseTo(0);
  });

  it('calculates both sticks independently and rejects empty samples', () => {
    expect(
      calculateControllerDrift(
        [{ x: 0.01, y: 0 }],
        [{ x: 0, y: -0.02 }],
      ),
    ).toEqual({
      left: { meanX: 0.01, meanY: 0, centerOffset: 0.01 },
      right: { meanX: 0, meanY: -0.02, centerOffset: 0.02 },
    });

    expect(calculateControllerDrift([], [{ x: 0, y: 0 }])).toBeNull();
  });

  it('rejects non-finite sample coordinates', () => {
    expect(calculateStickDrift([{ x: Number.NaN, y: 0 }])).toBeNull();
    expect(calculateStickDrift([{ x: 0, y: Number.POSITIVE_INFINITY }])).toBeNull();
  });
});
