export interface KeyboardGhostingPreset {
  readonly id: string;
  readonly label: string;
  readonly codes: readonly string[];
}

const defaultKeyboardGhostingPreset: KeyboardGhostingPreset = {
  id: 'wa-shift-space',
  label: 'Gaming chord · W + A + Left Shift + Space',
  codes: ['KeyW', 'KeyA', 'ShiftLeft', 'Space'],
};

export const keyboardGhostingPresets: readonly KeyboardGhostingPreset[] = [
  defaultKeyboardGhostingPreset,
  {
    id: 'wd-shift-space',
    label: 'Gaming chord · W + D + Left Shift + Space',
    codes: ['KeyW', 'KeyD', 'ShiftLeft', 'Space'],
  },
  {
    id: 'qwe',
    label: '3-key chord · Q + W + E',
    codes: ['KeyQ', 'KeyW', 'KeyE'],
  },
  {
    id: 'asd',
    label: '3-key chord · A + S + D',
    codes: ['KeyA', 'KeyS', 'KeyD'],
  },
  {
    id: 'edc',
    label: '3-key chord · E + D + C',
    codes: ['KeyE', 'KeyD', 'KeyC'],
  },
  {
    id: 'wasd-shift-space',
    label: '6-key stress · W + A + S + D + Left Shift + Space',
    codes: ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft', 'Space'],
  },
];

export const getKeyboardGhostingPreset = (id: string): KeyboardGhostingPreset =>
  keyboardGhostingPresets.find((preset) => preset.id === id) ?? defaultKeyboardGhostingPreset;

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