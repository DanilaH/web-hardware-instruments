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

// Keep level references concentrated near the clipping boundaries instead of
// spreading them across the whole tonal range. These remain encoded sRGB
// references, not measured panel-luminance percentages.
const blackLevelPercents = [0, 1, 2, 3, 4, 5, 7, 10] as const;
const whiteLevelPercents = [90, 93, 95, 96, 97, 98, 99, 100] as const;

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

export const screenUniformityPatterns = [5, 10, 25, 50, 75, 100].map((percent) => ({
  id: percent === 100 ? 'white-100' : `gray-${percent}`,
  kind: 'solid' as const,
  value: encodedGrayReference(percent),
})) satisfies readonly DisplayPattern[];

export const oledBurnInPatterns = [
  { id: 'red', kind: 'solid', value: '#ff0000' },
  { id: 'green', kind: 'solid', value: '#00ff00' },
  { id: 'blue', kind: 'solid', value: '#0000ff' },
  { id: 'white', kind: 'solid', value: '#ffffff' },
  { id: 'gray-50', kind: 'solid', value: encodedGrayReference(50) },
  { id: 'gray-25', kind: 'solid', value: encodedGrayReference(25) },
  { id: 'gray-75', kind: 'solid', value: encodedGrayReference(75) },
  { id: 'black', kind: 'solid', value: '#000000' },
] as const satisfies readonly DisplayPattern[];

export const moveDisplayPatternIndex = (currentIndex: number, delta: -1 | 1, length: number): number => {
  if (length <= 0) return 0;
  return (currentIndex + delta + length) % length;
};
