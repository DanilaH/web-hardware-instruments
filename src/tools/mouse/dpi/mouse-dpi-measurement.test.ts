import { describe, expect, it } from 'vitest';

import {
  calculateEstimatedDpi,
  convertDistance,
  distanceToInches,
} from './mouse-dpi-measurement';

describe('Mouse DPI measurement helpers', () => {
  it('converts centimeters and inches while preserving physical distance', () => {
    expect(convertDistance(2.54, 'cm', 'in')).toBeCloseTo(1, 8);
    expect(convertDistance(1, 'in', 'cm')).toBeCloseTo(2.54, 8);
    expect(convertDistance(10, 'cm', 'cm')).toBe(10);
  });

  it('rejects invalid physical distances', () => {
    expect(convertDistance(0, 'cm', 'in')).toBeNull();
    expect(convertDistance(Number.NaN, 'cm', 'in')).toBeNull();
    expect(distanceToInches(-1, 'in')).toBeNull();
  });

  it('calculates estimated DPI from the absolute net horizontal movement', () => {
    expect(calculateEstimatedDpi(1600, 1, 'in')).toBe(1600);
    expect(calculateEstimatedDpi(-1600, 1, 'in')).toBe(1600);
    expect(calculateEstimatedDpi(1600, 2.54, 'cm')).toBeCloseTo(1600, 8);
  });

  it('uses the signed sum rather than total absolute travel', () => {
    const signedNetMovement = 800;
    expect(calculateEstimatedDpi(signedNetMovement, 1, 'in')).toBe(800);
  });

  it('returns no result when no usable horizontal movement was captured', () => {
    expect(calculateEstimatedDpi(0, 10, 'cm')).toBeNull();
    expect(calculateEstimatedDpi(Number.POSITIVE_INFINITY, 10, 'cm')).toBeNull();
  });
});
