import type { MetadataRoute } from 'next';

import { defaultLocale, type Locale, locales } from '@/i18n/config';
import { env } from '@/lib/env';

// Static routes served by the app, defined once per path (no locale prefix).
// The sitemap multiplies this list by `locales` to produce one entry per
// (path × locale) combination, with hreflang alternates inside.
//
// To add dynamic routes (e.g. CMS posts, DB items), fetch them inside the
// default export and concat the generated entries — e.g.:
//   const posts = await getPosts();
//   const postEntries = posts.flatMap((p) =>
//     locales.map((locale) => ({
//       url: buildLocaleUrl(locale, `/posts/${p.slug}`),
//       lastModified: new Date(p.updatedAt),
//       alternates: { languages: buildLanguageAlternates(`/posts/${p.slug}`) },
//     })),
//   );
const STATIC_PATHS = ['', '/contact', '/posts', '/posts/mock'] as const;

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
