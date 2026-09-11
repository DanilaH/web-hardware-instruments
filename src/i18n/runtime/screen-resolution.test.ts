import { describe, expect, it } from 'vitest';

import { implementedContentLocales } from '../content';
import { getScreenResolutionRuntimeMessages } from './screen-resolution';

describe('screen resolution runtime localization', () => {
  it('provides every primary label in every implemented locale', () => {
    for (const locale of implementedContentLocales) {
      const messages = getScreenResolutionRuntimeMessages(locale);
      const values = [
        messages.controlsHeading,
        messages.browserReported,
        messages.screenSize,
        messages.cssPixels,
        messages.estimatedDevicePixels,
        messages.estimated,
        messages.devicePixels,
        messages.viewport,
        messages.availableArea,
        messages.devicePixelRatio,
        messages.colorDepth,
        messages.bits,
        messages.orientation,
      ];
      expect(values.every((value) => value.trim().length > 0), locale).toBe(true);
    }
  });
});
