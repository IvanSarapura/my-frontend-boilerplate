import type { MetadataRoute } from 'next';

import { defaultLocale, type Locale, locales } from '@/i18n/config';
import { env } from '@/lib/env';

// Paths without locale prefix; the sitemap expands them across `locales` with
// hreflang alternates. For dynamic routes, fetch and concat entries in the export.
const STATIC_PATHS = ['', '/contact', '/posts'] as const;

function buildLocaleUrl(locale: Locale, path: string): string {
  return `${env.NEXT_PUBLIC_APP_URL}/${locale}${path}`;
}

function buildLanguageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map(l => [l, buildLocaleUrl(l, path)])),
    'x-default': buildLocaleUrl(defaultLocale, path),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return STATIC_PATHS.flatMap(path =>
    locales.map(locale => ({
      url: buildLocaleUrl(locale, path),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
      alternates: {
        languages: buildLanguageAlternates(path),
      },
    })),
  );
}
