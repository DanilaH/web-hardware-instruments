import { describe, expect, it } from 'vitest';

import { createBrowserScreenInfo, estimateDevicePixelDimension } from './screen-info';

describe('screen resolution info', () => {
  it('uses the exact Math.round(css * dpr) estimate', () => {
    expect(estimateDevicePixelDimension(1920, 1)).toBe(1920);
    expect(estimateDevicePixelDimension(1536, 1.25)).toBe(1920);
    expect(estimateDevicePixelDimension(1365, 1.5)).toBe(2048);
    expect(estimateDevicePixelDimension(390, 3)).toBe(1170);
  });

  it('keeps reported CSS values separate from estimated device pixels', () => {
    expect(createBrowserScreenInfo({
      screenWidthCss: 1536,
      screenHeightCss: 864,
      availWidthCss: 1536,
      availHeightCss: 816,
      viewportWidthCss: 1280,
      viewportHeightCss: 720,
      devicePixelRatio: 1.25,
      colorDepth: 24,
      orientation: 'landscape-primary',
    })).toEqual({
      screenWidthCss: 1536,
      screenHeightCss: 864,
      availWidthCss: 1536,
      availHeightCss: 816,
      viewportWidthCss: 1280,
      viewportHeightCss: 720,
      devicePixelRatio: 1.25,
      colorDepth: 24,
      orientation: 'landscape-primary',
      estimatedDevicePixelWidth: 1920,
      estimatedDevicePixelHeight: 1080,
    });
  });
});
