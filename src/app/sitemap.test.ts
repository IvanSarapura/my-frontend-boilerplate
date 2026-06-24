import { describe, expect, it } from 'vitest';

import { locales } from '@/i18n/config';
import { env } from '@/lib/env';

import sitemap from './sitemap';

describe('sitemap', () => {
  const entries = sitemap();

  it('emits one entry per static path per locale', () => {
    // 3 static paths ('', '/contact', '/posts') × locales.
    expect(entries).toHaveLength(3 * locales.length);
  });

  it('builds locale-prefixed absolute URLs', () => {
    const home = entries.find(
      e => e.url === `${env.NEXT_PUBLIC_APP_URL}/${locales[0]}`,
    );
    expect(home).toBeDefined();
    expect(home?.priority).toBe(1);
  });

  it('includes hreflang alternates with an x-default for every entry', () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages ?? {};
      expect(Object.keys(languages)).toContain('x-default');
      for (const locale of locales) {
        expect(languages).toHaveProperty(locale);
      }
    }
  });
});
