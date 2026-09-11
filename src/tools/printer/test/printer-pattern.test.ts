import { describe, expect, it } from 'vitest';

import {
  getPrinterPaperDefinition,
  getPrinterProfileDefinition,
  isPrinterPaperSize,
  isPrinterProfile,
} from './printer-pattern';

describe('printer reference profiles', () => {
  it('keeps Full as the combined grayscale and color reference', () => {
    expect(getPrinterProfileDefinition('full')).toEqual({
      showGrayscale: true,
      showColor: true,
    });
  });

  it('keeps Color focused on color while retaining common references in the page component', () => {
    expect(getPrinterProfileDefinition('color')).toEqual({
      showGrayscale: false,
      showColor: true,
    });
  });

  it('keeps Grayscale focused on grayscale while retaining common references in the page component', () => {
    expect(getPrinterProfileDefinition('grayscale')).toEqual({
      showGrayscale: true,
      showColor: false,
    });
  });

  it('uses the exact A4 and Letter portrait references from the product contract', () => {
    expect(getPrinterPaperDefinition('a4')).toEqual({ widthMm: 210, heightMm: 297, pageCss: 'A4' });
    expect(getPrinterPaperDefinition('letter')).toEqual({ widthMm: 215.9, heightMm: 279.4, pageCss: 'Letter' });
  });

  it('accepts only supported paper and profile state values', () => {
    expect(isPrinterPaperSize('a4')).toBe(true);
    expect(isPrinterPaperSize('letter')).toBe(true);
    expect(isPrinterPaperSize('legal')).toBe(false);
    expect(isPrinterProfile('full')).toBe(true);
    expect(isPrinterProfile('color')).toBe(true);
    expect(isPrinterProfile('grayscale')).toBe(true);
    expect(isPrinterProfile('photo')).toBe(false);
  });
});
