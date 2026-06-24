import { describe, expect, it } from 'vitest';

import { defaultLocale, isLocale, locales } from './config';

describe('i18n config', () => {
  it('has expected locales', () => {
    expect(locales).toEqual(['en', 'es']);
  });

  it('uses English as the default locale', () => {
    expect(defaultLocale).toBe('en');
    expect(locales).toContain(defaultLocale);
  });

  it('narrows known locales and rejects unknown ones', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('es')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });
});
