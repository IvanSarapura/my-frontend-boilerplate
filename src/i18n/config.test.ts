import { describe, expect, it } from 'vitest';

import { defaultLocale, getMessages, locales } from './config';

describe('i18n config', () => {
  it('has expected locales', () => {
    expect(locales).toEqual(['en', 'es']);
  });

  it('uses English as the default locale', () => {
    expect(defaultLocale).toBe('en');
    expect(locales).toContain(defaultLocale);
  });

  it('loads English messages', async () => {
    const messages = await getMessages('en');
    expect(messages).toBeDefined();
    expect(Object.keys(messages).length).toBeGreaterThan(0);
  });

  it('loads Spanish messages', async () => {
    const messages = await getMessages('es');
    expect(messages).toBeDefined();
    expect(Object.keys(messages).length).toBeGreaterThan(0);
  });

  it('throws for unsupported locale', async () => {
    // @ts-expect-error testing invalid locale
    await expect(getMessages('fr')).rejects.toThrow();
  });
});
