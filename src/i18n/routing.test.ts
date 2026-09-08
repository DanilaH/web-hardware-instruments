import { describe, expect, it } from 'vitest';

import { locales } from './locales';
import {
  buildAlternateLinks,
  buildLocalizedPath,
  getSemanticPath,
  normalizePath,
  parseLocalizedPath,
} from './routing';

describe('locale routing', () => {
  it('normalizes root, leading slash, and trailing slashes', () => {
    expect(normalizePath('')).toBe('/');
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('gamepad-tester')).toBe('/gamepad-tester');
    expect(normalizePath('/gamepad-tester///')).toBe('/gamepad-tester');
  });

  it('parses every localized route prefix back to one semantic path', () => {
    expect(parseLocalizedPath('/gamepad-tester')).toEqual({
      locale: 'en',
      semanticPath: '/gamepad-tester',
    });
    expect(parseLocalizedPath('/pt-br/gamepad-tester')).toEqual({
      locale: 'pt-BR',
      semanticPath: '/gamepad-tester',
    });
    expect(parseLocalizedPath('/de/gamepad-tester')).toEqual({
      locale: 'de',
      semanticPath: '/gamepad-tester',
    });
    expect(parseLocalizedPath('/fr/gamepad-tester')).toEqual({
      locale: 'fr',
      semanticPath: '/gamepad-tester',
    });
    expect(parseLocalizedPath('/es/gamepad-tester')).toEqual({
      locale: 'es',
      semanticPath: '/gamepad-tester',
    });
    expect(parseLocalizedPath('/ru/gamepad-tester')).toEqual({
      locale: 'ru',
      semanticPath: '/gamepad-tester',
    });
  });

  it('parses locale homepages and route segments case-insensitively', () => {
    expect(parseLocalizedPath('/pt-br')).toEqual({ locale: 'pt-BR', semanticPath: '/' });
    expect(parseLocalizedPath('/PT-BR/keyboard-tester/')).toEqual({
      locale: 'pt-BR',
      semanticPath: '/keyboard-tester',
    });
    expect(parseLocalizedPath('/DE')).toEqual({ locale: 'de', semanticPath: '/' });
  });

  it('never treats /en as a locale prefix', () => {
    expect(parseLocalizedPath('/en/gamepad-tester')).toEqual({
      locale: 'en',
      semanticPath: '/en/gamepad-tester',
    });
    expect(getSemanticPath('/en')).toBe('/en');
  });

  it('leaves unknown first segments on the English semantic path', () => {
    expect(parseLocalizedPath('/pl/gamepad-tester')).toEqual({
      locale: 'en',
      semanticPath: '/pl/gamepad-tester',
    });
  });

  it('builds stable English slugs beneath each locale prefix', () => {
    expect(buildLocalizedPath('en', '/mouse-dpi-test')).toBe('/mouse-dpi-test');
    expect(buildLocalizedPath('pt-BR', '/mouse-dpi-test')).toBe('/pt-br/mouse-dpi-test');
    expect(buildLocalizedPath('de', '/mouse-dpi-test')).toBe('/de/mouse-dpi-test');
    expect(buildLocalizedPath('fr', '/mouse-dpi-test')).toBe('/fr/mouse-dpi-test');
    expect(buildLocalizedPath('es', '/mouse-dpi-test')).toBe('/es/mouse-dpi-test');
    expect(buildLocalizedPath('ru', '/mouse-dpi-test')).toBe('/ru/mouse-dpi-test');
  });

  it('builds locale homepages without introducing /en or trailing slashes', () => {
    expect(buildLocalizedPath('en', '/')).toBe('/');
    expect(buildLocalizedPath('pt-BR', '/')).toBe('/pt-br');
    expect(buildLocalizedPath('de', '/')).toBe('/de');
    expect(buildLocalizedPath('fr', '/')).toBe('/fr');
    expect(buildLocalizedPath('es', '/')).toBe('/es');
    expect(buildLocalizedPath('ru', '/')).toBe('/ru');
  });

  it('builds the complete reciprocal hreflang target set plus English x-default', () => {
    const alternates = buildAlternateLinks('/keyboard-tester', locales);

    expect(alternates).toEqual([
      { hreflang: 'en', path: '/keyboard-tester' },
      { hreflang: 'pt-BR', path: '/pt-br/keyboard-tester' },
      { hreflang: 'de', path: '/de/keyboard-tester' },
      { hreflang: 'fr', path: '/fr/keyboard-tester' },
      { hreflang: 'es', path: '/es/keyboard-tester' },
      { hreflang: 'ru', path: '/ru/keyboard-tester' },
      { hreflang: 'x-default', path: '/keyboard-tester' },
    ]);
    expect(new Set(alternates.map(({ hreflang }) => hreflang)).size).toBe(alternates.length);
  });

  it('only emits x-default when English is available', () => {
    expect(buildAlternateLinks('/about', ['de', 'fr'])).toEqual([
      { hreflang: 'de', path: '/de/about' },
      { hreflang: 'fr', path: '/fr/about' },
    ]);
    expect(buildAlternateLinks('/about', ['en', 'ru'])).toEqual([
      { hreflang: 'en', path: '/about' },
      { hreflang: 'ru', path: '/ru/about' },
      { hreflang: 'x-default', path: '/about' },
    ]);
  });
});
