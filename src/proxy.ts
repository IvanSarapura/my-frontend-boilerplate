import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { Locale } from '@/i18n/config';
import { defaultLocale, locales } from '@/i18n/config';

function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get('accept-language') ?? '';
  const preferred = header.split(',')[0]?.split('-')[0]?.toLowerCase() ?? '';
  return (locales as readonly string[]).includes(preferred)
    ? (preferred as Locale)
    : defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (hasLocale) return;

  const locale = detectLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // skip Next.js internals, static assets, and metadata files — locale redirect for real pages only
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|opengraph-image).*)',
  ],
};
