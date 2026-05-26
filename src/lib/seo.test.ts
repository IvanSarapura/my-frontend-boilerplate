import { describe, expect, it } from 'vitest';

import { buildAlternates, localeToOgLocale } from './seo';

describe('buildAlternates', () => {
  it('builds a self-referencing canonical for a locale/path pair', () => {
    expect(buildAlternates('en', '/posts').canonical).toBe('/en/posts');
    expect(buildAlternates('es', '/posts').canonical).toBe('/es/posts');
  });

  it('includes every locale plus x-default in the hreflang set', () => {
    expect(buildAlternates('es', '/contact').languages).toEqual({
      en: '/en/contact',
      es: '/es/contact',
      'x-default': '/en/contact',
    });
  });

  it('handles the root path (empty string)', () => {
    expect(buildAlternates('en', '').canonical).toBe('/en');
    expect(buildAlternates('en', '').languages).toMatchObject({
      'x-default': '/en',
    });
  });
});

describe('localeToOgLocale', () => {
  it('maps app locales to og:locale territory codes', () => {
    expect(localeToOgLocale.en).toBe('en_US');
    expect(localeToOgLocale.es).toBe('es_ES');
  });
});
