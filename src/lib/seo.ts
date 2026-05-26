import type { Metadata } from 'next';

import { defaultLocale, type Locale, locales } from '@/i18n/config';

// OpenGraph expects `language_TERRITORY`; map each app locale to its og:locale.
export const localeToOgLocale: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_ES',
};

// Self-referencing canonical + hreflang set for a locale/path pair. Paths are
// relative; Next.js resolves them against `metadataBase`. Every page must set
// its own alternates so deep pages canonical to themselves (not the homepage)
// and the canonical URL appears in its own hreflang set.
export function buildAlternates(
  locale: Locale,
  path: string,
): NonNullable<Metadata['alternates']> {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(locales.map(l => [l, `/${l}${path}`])),
      'x-default': `/${defaultLocale}${path}`,
    },
  };
}
