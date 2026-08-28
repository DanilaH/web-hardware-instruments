export interface KeyboardGhostingPreset {
  readonly id: string;
  readonly label: string;
  readonly codes: readonly string[];
}

export const keyboardGhostingPresets: readonly KeyboardGhostingPreset[] = [
  {
    id: 'wasd-shift-space',
    label: 'W + A + S + D + Left Shift + Space',
    codes: ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft', 'Space'],
  },
  {
    id: 'wa-shift-space',
    label: 'W + A + Left Shift + Space',
    codes: ['KeyW', 'KeyA', 'ShiftLeft', 'Space'],
  },
  {
    id: 'wd-shift-space',
    label: 'W + D + Left Shift + Space',
    codes: ['KeyW', 'KeyD', 'ShiftLeft', 'Space'],
  },
  {
    id: 'qwe-asd',
    label: 'Q + W + E + A + S + D',
    codes: ['KeyQ', 'KeyW', 'KeyE', 'KeyA', 'KeyS', 'KeyD'],
  },
] as const;

export const getKeyboardGhostingPreset = (id: string): KeyboardGhostingPreset =>
  keyboardGhostingPresets.find((preset) => preset.id === id) ?? keyboardGhostingPresets[0];

export const formatKeyboardCode = (code: string): string => {
  if (code.startsWith('Key') && code.length === 4) return code.slice(3);
  if (code === 'ShiftLeft') return 'Left Shift';
  if (code === 'ShiftRight') return 'Right Shift';
  if (code === 'ControlLeft') return 'Left Ctrl';
  if (code === 'ControlRight') return 'Right Ctrl';
  if (code === 'AltLeft') return 'Left Alt';
  if (code === 'AltRight') return 'Right Alt';
  if (code === 'Space') return 'Space';
  return code || 'Unidentified';
};
