export interface DeadPixelColor {
  readonly name: 'Black' | 'White' | 'Red' | 'Green' | 'Blue';
  readonly value: string;
}

export const deadPixelColors: readonly DeadPixelColor[] = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#ffffff' },
  { name: 'Red', value: '#ff0000' },
  { name: 'Green', value: '#00ff00' },
  { name: 'Blue', value: '#0000ff' },
];

export const moveDeadPixelColorIndex = (currentIndex: number, delta: -1 | 1): number => {
  const count = deadPixelColors.length;
  if (count === 0) return 0;
  return (currentIndex + delta + count) % count;
};

export const getDeadPixelColor = (index: number): DeadPixelColor =>
  deadPixelColors[index] ?? deadPixelColors[0] ?? { name: 'Black', value: '#000000' };
