import { describe, expect, it } from 'vitest';

import { implementedContentLocales } from '../content';
import { getScreenUniformityRuntimeMessages } from './screen-uniformity';

const EXPECTED_PATTERN_COUNT = 6;

describe('screen uniformity runtime localization', () => {
  it('provides one non-empty label per Uniformity preset in every implemented locale', () => {
    for (const locale of implementedContentLocales) {
      const messages = getScreenUniformityRuntimeMessages(locale);
      expect(messages.patterns, locale).toHaveLength(EXPECTED_PATTERN_COUNT);
      expect(messages.patterns.every((label) => label.trim().length > 0), locale).toBe(true);
    }
  });

  it('keeps every primary Uniformity control string non-empty in every implemented locale', () => {
    for (const locale of implementedContentLocales) {
      const messages = getScreenUniformityRuntimeMessages(locale);
      const primaryStrings = [
        messages.controlsHeading,
        messages.visualInspection,
        messages.instruction,
        messages.start,
        messages.sequenceAria,
        messages.stageAria,
        messages.nextHint,
        messages.previous,
        messages.next,
        messages.hideControls,
        messages.exit,
        messages.fullScreenUnavailable,
      ];

      expect(primaryStrings.every((value) => value.trim().length > 0), locale).toBe(true);
    }
  });
});
