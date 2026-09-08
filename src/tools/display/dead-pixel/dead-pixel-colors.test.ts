import { describe, expect, it } from 'vitest';
import { deadPixelColors, getDeadPixelColor, moveDeadPixelColorIndex } from './dead-pixel-colors';

describe('dead pixel color sequence', () => {
  it('uses the approved black white red green blue order', () => { expect(deadPixelColors.map((color) => color.id)).toEqual(['black', 'white', 'red', 'green', 'blue']); });
  it('wraps forward from blue to black', () => { expect(moveDeadPixelColorIndex(4, 1)).toBe(0); });
  it('wraps backward from black to blue', () => { expect(moveDeadPixelColorIndex(0, -1)).toBe(4); });
  it('falls back to black for an invalid color index', () => { expect(getDeadPixelColor(99).id).toBe('black'); });
});
