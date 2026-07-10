import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { Locale } from '@/i18n/config';
import { defaultLocale, locales } from '@/i18n/config';
import { env } from '@/lib/env';

const LOCALE_COOKIE = 'NEXT_LOCALE';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

// Per-request CSP header. `'strict-dynamic'` is omitted on purpose: it would
// disable the `'self'` allowlist and Turbopack injects lazy chunks without the
// nonce, breaking hydration in production. See README → Important Notes → proxy.ts.
function buildCspHeader(nonce: string, isDev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    "img-src 'self' blob: data:",
    "font-src 'self'",
    // Same env var the posts/comments services fetch from — keeps the CSP
    // allowlist in sync with the API origin by construction.
    `connect-src 'self' ${env.NEXT_PUBLIC_API_ORIGIN}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

function applySecurityResponseHeaders(
  response: NextResponse,
  nonce: string,
  cspHeader: string,
): NextResponse {
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('x-nonce', nonce);
  return response;
}

function detectLocale(request: NextRequest): Locale {
  const cookieValue = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieValue && (locales as readonly string[]).includes(cookieValue)) {
    return cookieValue as Locale;
  }
  const header = request.headers.get('accept-language') ?? '';
  const preferred = header.split(',')[0]?.split('-')[0]?.toLowerCase() ?? '';
  return (locales as readonly string[]).includes(preferred)
    ? (preferred as Locale)
    : defaultLocale;
}

function extractLocaleFromPath(pathname: string): Locale | null {
  const match = locales.find(
    l => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  return match ?? null;
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';
  const cspHeader = buildCspHeader(nonce, isDev);

  // httpOnly: the cookie is only read server-side (here + server actions).
  // secure: off in dev since localhost is HTTP.
  const localeCookieOptions = {
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: '/',
    sameSite: 'lax' as const,
    httpOnly: true,
    secure: !isDev,
  };

  // Propagate via request headers so Next.js nonces its framework scripts and
  // Server Components can read the nonce with `headers()`.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const { pathname } = request.nextUrl;
  const pathLocale = extractLocaleFromPath(pathname);

  if (pathLocale) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    if (cookieLocale !== pathLocale) {
      response.cookies.set(LOCALE_COOKIE, pathLocale, localeCookieOptions);
    }
    return applySecurityResponseHeaders(response, nonce, cspHeader);
  }

  const locale = detectLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set(LOCALE_COOKIE, locale, localeCookieOptions);
  return applySecurityResponseHeaders(response, nonce, cspHeader);
}

export const config = {
  matcher: [
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|opengraph-image|icon|apple-icon).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
