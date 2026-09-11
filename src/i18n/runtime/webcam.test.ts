import { describe, expect, it } from 'vitest';

import { implementedContentLocales } from '../content';
import { getWebcamRuntimeMessages } from './webcam';

describe('webcam runtime localization', () => {
  it('keeps every primary webcam string non-empty in every implemented locale', () => {
    for (const locale of implementedContentLocales) {
      const messages = getWebcamRuntimeMessages(locale);
      const values = Object.values(messages);
      expect(values.every((value) => value.trim().length > 0), locale).toBe(true);
    }
  });
});
