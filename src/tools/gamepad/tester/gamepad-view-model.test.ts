import { describe, expect, it } from 'vitest';

import type { GamepadSnapshot } from '../../../browser/gamepad-service';
import {
  createAccessibleControllerSummary,
  createAccessibleFallbackSummary,
  createFallbackControllerView,
  createStandardControllerView,
} from './gamepad-view-model';

const createSnapshot = (overrides: Partial<GamepadSnapshot> = {}): GamepadSnapshot => ({
  sourceIndex: 3,
  mapping: 'standard',
  buttons: Array.from({ length: 17 }, (_, index) => ({
    pressed: index === 0 || index === 12,
    value: index === 6 ? 0.4 : index === 7 ? 0.75 : index === 0 || index === 12 ? 1 : 0,
  })),
  axes: [0.5, -0.25, -1, 1],
  ...overrides,
});

describe('createStandardControllerView', () => {
  it('maps standard buttons, triggers, and stick axes to semantic view data', () => {
    const view = createStandardControllerView(createSnapshot());

    expect(view.buttons['face-bottom']).toBe(true);
    expect(view.buttons['dpad-up']).toBe(true);
    expect(view.buttons['face-right']).toBe(false);
    expect(view.triggers).toEqual({ left: 0.4, right: 0.75 });
    expect(view.sticks.left).toEqual({ x: 0.5, y: -0.25, pressed: false });
    expect(view.sticks.right).toEqual({ x: -1, y: 1, pressed: false });
    expect(view.pressedLabels).toEqual(['Face bottom', 'D-pad up']);
  });

  it('creates a concise text equivalent for the live controller state', () => {
    expect(createAccessibleControllerSummary(createStandardControllerView(createSnapshot()))).toBe(
      'Face bottom, D-pad up. Left stick x 50%, y -25%. Right stick x -100%, y 100%. Left trigger 40%. Right trigger 75%.',
    );
  });
});

describe('createFallbackControllerView', () => {
  it('prepares numbered button and normalized axis render data without physical-layout assumptions', () => {
    const view = createFallbackControllerView(
      createSnapshot({
        mapping: 'non-standard',
        buttons: [
          { pressed: true, value: 1 },
          { pressed: false, value: 0.25 },
        ],
        axes: [-1, 0.25, 1],
      }),
    );

    expect(view).toEqual({
      buttons: [
        { text: '1', label: 'Button 1', pressed: true, value: 1 },
        { text: '2', label: 'Button 2', pressed: false, value: 0.25 },
      ],
      axes: [
        { label: 'Axis 1', percent: -100, positionPercent: 0 },
        { label: 'Axis 2', percent: 25, positionPercent: 62.5 },
        { label: 'Axis 3', percent: 100, positionPercent: 100 },
      ],
    });

    expect(createAccessibleFallbackSummary(view)).toBe(
      'Controller detected with a non-standard mapping. 1 button is currently pressed.',
    );
  });
});
