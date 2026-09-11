import { describe, expect, it } from 'vitest';

import { implementedContentLocales } from '../content';
import { getMonitorRuntimeMessages } from './monitor';

const EXPECTED_PATTERN_COUNT = 12;

describe('monitor runtime localization', () => {
  it('provides one non-empty label per Monitor P0 pattern in every implemented locale', () => {
    for (const locale of implementedContentLocales) {
      const messages = getMonitorRuntimeMessages(locale);
      expect(messages.patterns, locale).toHaveLength(EXPECTED_PATTERN_COUNT);
      expect(messages.patterns.every((label) => label.trim().length > 0), locale).toBe(true);
    }
  });

  it('keeps every primary Monitor control string non-empty in every implemented locale', () => {
    for (const locale of implementedContentLocales) {
      const messages = getMonitorRuntimeMessages(locale);
      const primaryStrings = [
        messages.controlsHeading,
        messages.visualInspection,
        messages.instruction,
        messages.start,
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
