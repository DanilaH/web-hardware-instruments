import { describe, expect, it } from 'vitest';

import { getSiteContent, implementedContentLocales } from './content';
import { getRuntimeMessages } from './runtime';

const placeholders = (value: string): readonly string[] =>
  [...value.matchAll(/\{([a-zA-Z0-9_]+)\}/g)]
    .map((match) => match[1] ?? '')
    .filter(Boolean)
    .sort();

const compareRuntimeShape = (reference: unknown, candidate: unknown, path = 'runtime'): void => {
  if (typeof reference === 'string') {
    expect(typeof candidate, `${path} should be a string`).toBe('string');
    expect(placeholders(candidate as string), `${path} placeholder mismatch`).toEqual(placeholders(reference));
    return;
  }

  if (Array.isArray(reference)) {
    expect(Array.isArray(candidate), `${path} should be an array`).toBe(true);
    const candidateArray = candidate as readonly unknown[];
    expect(candidateArray.length, `${path} array length mismatch`).toBe(reference.length);
    reference.forEach((item, index) => compareRuntimeShape(item, candidateArray[index], `${path}[${index}]`));
    return;
  }

  expect(reference && typeof reference === 'object', `${path} reference should be an object`).toBe(true);
  expect(candidate && typeof candidate === 'object', `${path} should be an object`).toBe(true);

  const referenceRecord = reference as Record<string, unknown>;
  const candidateRecord = candidate as Record<string, unknown>;
  expect(Object.keys(candidateRecord).sort(), `${path} keys mismatch`).toEqual(Object.keys(referenceRecord).sort());

  Object.entries(referenceRecord).forEach(([key, value]) => {
    compareRuntimeShape(value, candidateRecord[key], `${path}.${key}`);
  });
};

describe('localization contracts', () => {
  const englishContent = getSiteContent('en');
  const englishRuntime = getRuntimeMessages('en');

  it.each(implementedContentLocales)('%s keeps the complete semantic page structure', (locale) => {
    const content = getSiteContent(locale);

    expect(Object.keys(content.tools).sort()).toEqual(Object.keys(englishContent.tools).sort());
    expect(content.home.inputs).toHaveLength(englishContent.home.inputs.length);

    for (const toolId of Object.keys(englishContent.tools) as (keyof typeof englishContent.tools)[]) {
      const referenceTool = englishContent.tools[toolId];
      const localizedTool = content.tools[toolId];
      expect(localizedTool.sections, `${locale}.${toolId} section count`).toHaveLength(referenceTool.sections.length);

      referenceTool.sections.forEach((referenceSection, index) => {
        const localizedSection = localizedTool.sections[index];
        expect(localizedSection, `${locale}.${toolId}.sections[${index}]`).toBeDefined();
        expect(Boolean(localizedSection?.steps), `${locale}.${toolId}.sections[${index}] steps shape`).toBe(Boolean(referenceSection.steps));
        expect(Boolean(localizedSection?.paragraphs), `${locale}.${toolId}.sections[${index}] paragraph shape`).toBe(Boolean(referenceSection.paragraphs));
        if (referenceSection.steps) {
          expect(localizedSection?.steps, `${locale}.${toolId}.sections[${index}] step count`).toHaveLength(referenceSection.steps.length);
        }
        if (referenceSection.paragraphs) {
          expect(localizedSection?.paragraphs, `${locale}.${toolId}.sections[${index}] paragraph count`).toHaveLength(referenceSection.paragraphs.length);
        }
      });
    }
  });

  it.each(implementedContentLocales)('%s preserves runtime keys, arrays, and placeholders', (locale) => {
    compareRuntimeShape(englishRuntime, getRuntimeMessages(locale), locale);
  });
});
