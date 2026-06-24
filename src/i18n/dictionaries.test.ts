import { describe, expect, it } from 'vitest';

import { getDictionary } from './dictionaries';

describe('getDictionary', () => {
  it('loads English messages', async () => {
    const messages = await getDictionary('en');
    expect(Object.keys(messages).length).toBeGreaterThan(0);
  });

  it('loads Spanish messages', async () => {
    const messages = await getDictionary('es');
    expect(Object.keys(messages).length).toBeGreaterThan(0);
  });

  it('falls back to the default locale for an unknown locale', async () => {
    const fallback = await getDictionary('xx');
    const english = await getDictionary('en');
    expect(fallback).toEqual(english);
  });
});
