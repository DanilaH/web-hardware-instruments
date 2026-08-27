import { describe, expect, it } from 'vitest';

import type { GamepadSnapshot } from '../../../browser/gamepad-service';
import {
  createAccessibleControllerSummary,
  createStandardControllerView,
} from './gamepad-view-model';

const createSnapshot = (): GamepadSnapshot => ({
  sourceIndex: 3,
  mapping: 'standard',
  buttons: Array.from({ length: 17 }, (_, index) => ({
    pressed: index === 0 || index === 12,
    value: index === 6 ? 0.4 : index === 7 ? 0.75 : index === 0 || index === 12 ? 1 : 0,
  })),
  axes: [0.5, -0.25, -1, 1],
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
