import { describe, expect, it } from 'vitest';

import type { GamepadSnapshot } from '../../../browser/gamepad-service';
import {
  calculateControllerDrift,
  calculateStickDrift,
  formatCenterOffsetPercent,
  getStandardStickPositions,
} from './stick-drift-measurement';

const createGamepad = (overrides: Partial<GamepadSnapshot> = {}): GamepadSnapshot => ({
  sourceIndex: 0,
  mapping: 'standard',
  buttons: [],
  axes: [0, 0, 0, 0],
  ...overrides,
});

describe('stick drift measurement', () => {
  it('reads left and right axes only for a complete standard mapping', () => {
    expect(getStandardStickPositions(createGamepad({ axes: [0.1, -0.2, 0.3, -0.4] }))).toEqual({
      left: { x: 0.1, y: -0.2 },
      right: { x: 0.3, y: -0.4 },
    });
    expect(getStandardStickPositions(createGamepad({ mapping: 'non-standard' }))).toBeNull();
    expect(getStandardStickPositions(createGamepad({ axes: [0, 0, 0] }))).toBeNull();
  });

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
});
