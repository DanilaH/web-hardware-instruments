import { describe, expect, it } from 'vitest';

import type { GamepadSnapshot } from '../../browser/gamepad-service';
import { getStandardStickPosition, getStandardStickPositions } from './gamepad-stick-adapter';

const createGamepad = (overrides: Partial<GamepadSnapshot> = {}): GamepadSnapshot => ({
  sourceIndex: 0,
  mapping: 'standard',
  buttons: [],
  axes: [0, 0, 0, 0],
  ...overrides,
});

describe('gamepad stick adapter', () => {
  it('prepares both standard stick positions from the approved axes', () => {
    expect(getStandardStickPositions(createGamepad({ axes: [0.1, -0.2, 0.3, -0.4] }))).toEqual({
      left: { x: 0.1, y: -0.2 },
      right: { x: 0.3, y: -0.4 },
    });
  });

  it('returns the selected prepared stick', () => {
    const gamepad = createGamepad({ axes: [0.1, -0.2, 0.3, -0.4] });
    expect(getStandardStickPosition(gamepad, 'left')).toEqual({ x: 0.1, y: -0.2 });
    expect(getStandardStickPosition(gamepad, 'right')).toEqual({ x: 0.3, y: -0.4 });
  });

  it('rejects non-standard and incomplete mappings instead of guessing axes', () => {
    expect(getStandardStickPositions(createGamepad({ mapping: 'non-standard' }))).toBeNull();
    expect(getStandardStickPositions(createGamepad({ axes: [0, 0, 0] }))).toBeNull();
    expect(getStandardStickPosition(createGamepad({ axes: [0, 0, 0] }), 'right')).toBeNull();
  });
});
