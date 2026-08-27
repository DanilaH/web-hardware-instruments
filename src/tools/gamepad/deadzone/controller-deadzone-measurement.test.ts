import { describe, expect, it } from 'vitest';

import type { GamepadSnapshot } from '../../../browser/gamepad-service';
import {
  calculateDeadzoneMeasurement,
  formatCenterNoisePercent,
  getStandardStickPosition,
  percentile95NearestRank,
} from './controller-deadzone-measurement';

const createGamepad = (overrides: Partial<GamepadSnapshot> = {}): GamepadSnapshot => ({
  sourceIndex: 0,
  mapping: 'standard',
  buttons: [],
  axes: [0, 0, 0, 0],
  ...overrides,
});

describe('controller deadzone measurement', () => {
  it('reads the selected stick only from a complete standard mapping', () => {
    const gamepad = createGamepad({ axes: [0.1, -0.2, 0.3, -0.4] });

    expect(getStandardStickPosition(gamepad, 'left')).toEqual({ x: 0.1, y: -0.2 });
    expect(getStandardStickPosition(gamepad, 'right')).toEqual({ x: 0.3, y: -0.4 });
    expect(getStandardStickPosition(createGamepad({ mapping: 'non-standard' }), 'left')).toBeNull();
    expect(getStandardStickPosition(createGamepad({ axes: [0, 0, 0] }), 'right')).toBeNull();
  });

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

  it('caps the suggested deadzone at 100 percent', () => {
    const result = calculateDeadzoneMeasurement([{ x: 1, y: 1 }]);
    expect(result?.suggestedDeadzone).toBe(1);
    expect(result?.suggestedPercent).toBe(100);
  });
});
