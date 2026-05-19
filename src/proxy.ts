import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { Locale } from '@/i18n/config';
import { defaultLocale, locales } from '@/i18n/config';

const LOCALE_COOKIE = 'NEXT_LOCALE';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

/**
 * Build the per-request Content-Security-Policy header.
 *
 * - `'nonce-XYZ' 'strict-dynamic'` allows our nonced scripts and anything
 *   they dynamically load (required for Next.js hydration). This replaces
 *   the previous `'unsafe-inline'`.
 * - `'unsafe-eval'` is dev-only — React uses eval for enhanced stack traces.
 *   Not needed in production.
 * - `style-src` keeps `'unsafe-inline'` in dev (Next.js dev server injects
 *   un-noncable inline styles); production locks it down to the nonce.
 * - Hardening directives: `object-src 'none'`, `base-uri 'self'`,
 *   `form-action 'self'`, `upgrade-insecure-requests`.
 */
function buildCspHeader(nonce: string, isDev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self' https://jsonplaceholder.typicode.com",
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
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  return match ?? null;
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';
  const cspHeader = buildCspHeader(nonce, isDev);

  // Propagate nonce + CSP via request headers so Next.js can extract the
  // nonce and inject it into framework scripts, and Server Components can
  // read it with `headers()`.
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
      response.cookies.set(LOCALE_COOKIE, pathLocale, {
        maxAge: COOKIE_MAX_AGE_SECONDS,
        path: '/',
        sameSite: 'lax',
      });
    }
    return applySecurityResponseHeaders(response, nonce, cspHeader);
  }

  const locale = detectLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set(LOCALE_COOKIE, locale, {
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: '/',
    sameSite: 'lax',
  });
  return applySecurityResponseHeaders(response, nonce, cspHeader);
}

export const config = {
  matcher: [
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|opengraph-image).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
