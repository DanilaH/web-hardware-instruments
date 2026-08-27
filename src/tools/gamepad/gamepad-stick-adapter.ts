import type { GamepadSnapshot } from '../../browser/gamepad-service';
import type { StandardStickPositions, StickPosition, StickSide } from './stick-position';

export const getStandardStickPositions = (
  gamepad: GamepadSnapshot,
): StandardStickPositions | null => {
  if (gamepad.mapping !== 'standard' || gamepad.axes.length < 4) {
    return null;
  }

  return {
    left: { x: gamepad.axes[0] ?? 0, y: gamepad.axes[1] ?? 0 },
    right: { x: gamepad.axes[2] ?? 0, y: gamepad.axes[3] ?? 0 },
  };
};

export const getStandardStickPosition = (
  gamepad: GamepadSnapshot,
  side: StickSide,
): StickPosition | null => {
  const positions = getStandardStickPositions(gamepad);
  return positions ? positions[side] : null;
};
