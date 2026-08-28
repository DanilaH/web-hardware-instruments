import { describe, expect, it } from 'vitest';
import {
  deadPixelColors,
  getDeadPixelColor,
  moveDeadPixelColorIndex,
} from './dead-pixel-colors';

describe('dead pixel color sequence', () => {
  it('uses the approved Black White Red Green Blue order', () => {
    expect(deadPixelColors.map((color) => color.name)).toEqual([
      'Black',
      'White',
      'Red',
      'Green',
      'Blue',
    ]);
  });

  it('wraps forward from Blue to Black', () => {
    expect(moveDeadPixelColorIndex(4, 1)).toBe(0);
  });

  it('wraps backward from Black to Blue', () => {
    expect(moveDeadPixelColorIndex(0, -1)).toBe(4);
  });

  it('falls back to Black for an invalid color index', () => {
    expect(getDeadPixelColor(99).name).toBe('Black');
  });
});
