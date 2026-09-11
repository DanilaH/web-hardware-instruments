export type DisplayPattern =
  | { readonly id: string; readonly kind: 'solid'; readonly value: string }
  | { readonly id: string; readonly kind: 'gradient'; readonly css: string }
  | { readonly id: string; readonly kind: 'bars'; readonly values: readonly string[] }
  | { readonly id: string; readonly kind: 'grid' };

export const encodedGrayChannel = (percent: number): number => {
  const bounded = Math.min(100, Math.max(0, percent));
  return Math.round((255 * bounded) / 100);
};

export const encodedGrayReference = (percent: number): string => {
  const channel = encodedGrayChannel(percent);
  return `rgb(${channel} ${channel} ${channel})`;
};

const blackLevelPercents = [0, 5, 10, 15, 20, 25, 30, 35] as const;
const whiteLevelPercents = [65, 70, 75, 80, 85, 90, 95, 100] as const;

export const monitorPatterns = [
  { id: 'white', kind: 'solid', value: '#ffffff' },
  { id: 'black', kind: 'solid', value: '#000000' },
  { id: 'red', kind: 'solid', value: '#ff0000' },
  { id: 'green', kind: 'solid', value: '#00ff00' },
  { id: 'blue', kind: 'solid', value: '#0000ff' },
  { id: 'gray-50', kind: 'solid', value: encodedGrayReference(50) },
  { id: 'gray-5', kind: 'solid', value: encodedGrayReference(5) },
  { id: 'grayscale-gradient', kind: 'gradient', css: 'linear-gradient(90deg, #000000 0%, #ffffff 100%)' },
  { id: 'color-gradient', kind: 'gradient', css: 'linear-gradient(90deg, #ff0000 0%, #ffff00 16.66%, #00ff00 33.33%, #00ffff 50%, #0000ff 66.66%, #ff00ff 83.33%, #ff0000 100%)' },
  { id: 'black-level', kind: 'bars', values: blackLevelPercents.map(encodedGrayReference) },
  { id: 'white-level', kind: 'bars', values: whiteLevelPercents.map(encodedGrayReference) },
  { id: 'sharpness-grid', kind: 'grid' },
] as const satisfies readonly DisplayPattern[];

export const moveDisplayPatternIndex = (currentIndex: number, delta: -1 | 1, length: number): number => {
  if (length <= 0) return 0;
  return (currentIndex + delta + length) % length;
};
