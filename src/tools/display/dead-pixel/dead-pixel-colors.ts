export type DeadPixelColorId = 'black' | 'white' | 'red' | 'green' | 'blue';
export interface DeadPixelColor { readonly id: DeadPixelColorId; readonly value: string; }
export const deadPixelColors: readonly DeadPixelColor[] = [
  { id: 'black', value: '#000000' },
  { id: 'white', value: '#ffffff' },
  { id: 'red', value: '#ff0000' },
  { id: 'green', value: '#00ff00' },
  { id: 'blue', value: '#0000ff' },
];
export const moveDeadPixelColorIndex = (currentIndex: number, delta: -1 | 1): number => { const count = deadPixelColors.length; if (count === 0) return 0; return (currentIndex + delta + count) % count; };
export const getDeadPixelColor = (index: number): DeadPixelColor => deadPixelColors[index] ?? deadPixelColors[0] ?? { id: 'black', value: '#000000' };
