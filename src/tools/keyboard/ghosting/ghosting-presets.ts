import type { ToolRuntimeMessages } from '../../../i18n/runtime';

export type KeyboardGhostingPresetKind = 'gaming' | 'three' | 'six';
export interface KeyboardGhostingPreset {
  readonly id: string;
  readonly kind: KeyboardGhostingPresetKind;
  readonly codes: readonly string[];
}

type Messages = ToolRuntimeMessages<'ghosting'>;
const defaultKeyboardGhostingPreset: KeyboardGhostingPreset = { id: 'wa-shift-space', kind: 'gaming', codes: ['KeyW', 'KeyA', 'ShiftLeft', 'Space'] };
export const keyboardGhostingPresets: readonly KeyboardGhostingPreset[] = [
  defaultKeyboardGhostingPreset,
  { id: 'wd-shift-space', kind: 'gaming', codes: ['KeyW', 'KeyD', 'ShiftLeft', 'Space'] },
  { id: 'qwe', kind: 'three', codes: ['KeyQ', 'KeyW', 'KeyE'] },
  { id: 'asd', kind: 'three', codes: ['KeyA', 'KeyS', 'KeyD'] },
  { id: 'edc', kind: 'three', codes: ['KeyE', 'KeyD', 'KeyC'] },
  { id: 'wasd-shift-space', kind: 'six', codes: ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft', 'Space'] },
];
export const getKeyboardGhostingPreset = (id: string): KeyboardGhostingPreset => keyboardGhostingPresets.find((preset) => preset.id === id) ?? defaultKeyboardGhostingPreset;
export const formatKeyboardCode = (code: string, messages: Messages): string => {
  if (code.startsWith('Key') && code.length === 4) return code.slice(3);
  if (code === 'ShiftLeft') return messages.leftShift;
  if (code === 'ShiftRight') return messages.rightShift;
  if (code === 'ControlLeft') return messages.leftCtrl;
  if (code === 'ControlRight') return messages.rightCtrl;
  if (code === 'AltLeft') return messages.leftAlt;
  if (code === 'AltRight') return messages.rightAlt;
  if (code === 'Space') return messages.space;
  return code || messages.unidentified;
};
export const formatKeyboardGhostingPresetLabel = (preset: KeyboardGhostingPreset, messages: Messages): string => {
  const prefix = preset.kind === 'gaming' ? messages.presetGaming : preset.kind === 'three' ? messages.presetThree : messages.presetSix;
  return `${prefix} · ${preset.codes.map((code) => formatKeyboardCode(code, messages)).join(' + ')}`;
};
