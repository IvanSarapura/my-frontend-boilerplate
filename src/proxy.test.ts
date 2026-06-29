import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { env } from '@/lib/env';

import { proxy } from './proxy';

function request(path: string, headers?: Record<string, string>): NextRequest {
  return new NextRequest(
    new URL(`http://localhost:3000${path}`),
    headers ? { headers } : undefined,
  );
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('proxy — security headers', () => {
  it('sets a per-request nonce CSP with the hardening directives', () => {
    const res = proxy(request('/en'));
    const csp = res.headers.get('Content-Security-Policy') ?? '';

    expect(csp).toMatch(/'nonce-[^']+'/);
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
  });

  it('keeps connect-src in sync with the API origin', () => {
    const res = proxy(request('/en'));
    const csp = res.headers.get('Content-Security-Policy') ?? '';
    expect(csp).toContain(`connect-src 'self' ${env.NEXT_PUBLIC_API_ORIGIN}`);
  });

  it('propagates the same nonce via the x-nonce header', () => {
    const res = proxy(request('/en'));
    const nonce = res.headers.get('x-nonce');
    const csp = res.headers.get('Content-Security-Policy') ?? '';
    expect(nonce).toBeTruthy();
    expect(csp).toContain(`'nonce-${nonce}'`);
  });

  it('uses a fresh nonce on every request', () => {
    const a = proxy(request('/en')).headers.get('x-nonce');
    const b = proxy(request('/en')).headers.get('x-nonce');
    expect(a).not.toBe(b);
  });

  it('relaxes the CSP in development (unsafe-eval / unsafe-inline)', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const csp =
      proxy(request('/en')).headers.get('Content-Security-Policy') ?? '';
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toContain("'unsafe-inline'");
  });
});

describe('proxy — locale cookie', () => {
  it('hardens the NEXT_LOCALE cookie when the path is already localized', () => {
    const res = proxy(request('/es'));
    const cookie = res.cookies.get('NEXT_LOCALE');
    expect(cookie?.value).toBe('es');
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.sameSite).toBe('lax');
    // secure is off under NODE_ENV=test (treated as non-production / localhost).
    expect(cookie?.secure).toBe(false);
  });

  it('does not re-set the cookie when it already matches the path locale', () => {
    const res = proxy(request('/en', { cookie: 'NEXT_LOCALE=en' }));
    expect(res.cookies.get('NEXT_LOCALE')).toBeUndefined();
  });
});

describe('proxy — locale redirect', () => {
  it('redirects an unprefixed path to the detected locale and sets the cookie', () => {
    const res = proxy(
      request('/about', { 'accept-language': 'es-ES,es;q=0.9' }),
    );
    expect(res.headers.get('location')).toBe('http://localhost:3000/es/about');
    expect(res.cookies.get('NEXT_LOCALE')?.value).toBe('es');
    // Security headers ride along on the redirect too.
    expect(res.headers.get('Content-Security-Policy')).toContain(
      "object-src 'none'",
    );
  });

  it('falls back to the default locale for an unknown accept-language', () => {
    const res = proxy(request('/about', { 'accept-language': 'fr-FR' }));
    expect(res.headers.get('location')).toBe('http://localhost:3000/en/about');
  });

  it('prefers a valid NEXT_LOCALE cookie over accept-language', () => {
    const res = proxy(
      // Cookie (es) differs from the header (en) to prove the cookie wins.
      request('/about', {
        cookie: 'NEXT_LOCALE=es',
        'accept-language': 'en-US,en;q=0.9',
      }),
    );
    expect(res.headers.get('location')).toBe('http://localhost:3000/es/about');
  });

  it('ignores an unsupported NEXT_LOCALE cookie and uses accept-language', () => {
    const res = proxy(
      request('/about', {
        cookie: 'NEXT_LOCALE=zz',
        'accept-language': 'es-ES,es;q=0.9',
      }),
    );
    expect(res.headers.get('location')).toBe('http://localhost:3000/es/about');
  });

  it('falls back to the default locale with neither cookie nor accept-language', () => {
    const res = proxy(request('/about'));
    expect(res.headers.get('location')).toBe('http://localhost:3000/en/about');
  });
});
