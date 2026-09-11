import { describe, expect, it } from 'vitest';

import {
  encodedGrayChannel,
  encodedGrayReference,
  monitorPatterns,
  moveDisplayPatternIndex,
  screenUniformityPatterns,
} from './display-patterns';

describe('display pattern references', () => {
  it('uses the documented encoded sRGB gray references', () => {
    expect(encodedGrayChannel(5)).toBe(13);
    expect(encodedGrayChannel(10)).toBe(26);
    expect(encodedGrayChannel(25)).toBe(64);
    expect(encodedGrayChannel(50)).toBe(128);
    expect(encodedGrayChannel(75)).toBe(191);
    expect(encodedGrayChannel(100)).toBe(255);
    expect(encodedGrayReference(5)).toBe('rgb(13 13 13)');
    expect(encodedGrayReference(50)).toBe('rgb(128 128 128)');
  });

  it('clamps encoded gray references to the supported percentage range', () => {
    expect(encodedGrayReference(-5)).toBe('rgb(0 0 0)');
    expect(encodedGrayReference(105)).toBe('rgb(255 255 255)');
  });

  it('keeps the exact Monitor P0 sequence', () => {
    expect(monitorPatterns.map((pattern) => pattern.id)).toEqual([
      'white',
      'black',
      'red',
      'green',
      'blue',
      'gray-50',
      'gray-5',
      'grayscale-gradient',
      'color-gradient',
      'black-level',
      'white-level',
      'sharpness-grid',
    ]);
  });

  it('keeps black and white level references concentrated near clipping boundaries', () => {
    const black = monitorPatterns.find((pattern) => pattern.id === 'black-level');
    const white = monitorPatterns.find((pattern) => pattern.id === 'white-level');
    expect(black?.kind).toBe('bars');
    expect(white?.kind).toBe('bars');
    if (black?.kind !== 'bars' || white?.kind !== 'bars') throw new Error('Expected level patterns');
    expect(black.values).toEqual([0, 1, 2, 3, 4, 5, 7, 10].map(encodedGrayReference));
    expect(white.values).toEqual([90, 93, 95, 96, 97, 98, 99, 100].map(encodedGrayReference));
  });

  it('keeps the exact Screen Uniformity P0 presets and encoded values', () => {
    expect(screenUniformityPatterns.map((pattern) => pattern.id)).toEqual([
      'gray-5',
      'gray-10',
      'gray-25',
      'gray-50',
      'gray-75',
      'white-100',
    ]);
    expect(screenUniformityPatterns.map((pattern) => pattern.kind === 'solid' ? pattern.value : null)).toEqual(
      [5, 10, 25, 50, 75, 100].map(encodedGrayReference),
    );
  });

  it('wraps manual navigation for Monitor and Uniformity sequence lengths', () => {
    expect(moveDisplayPatternIndex(0, -1, 12)).toBe(11);
    expect(moveDisplayPatternIndex(11, 1, 12)).toBe(0);
    expect(moveDisplayPatternIndex(5, 1, 12)).toBe(6);
    expect(moveDisplayPatternIndex(0, -1, 6)).toBe(5);
    expect(moveDisplayPatternIndex(5, 1, 6)).toBe(0);
  });
});
