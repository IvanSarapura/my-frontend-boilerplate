import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    // Vercel sets this automatically; only needed for self-hosted deploys
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Content-Security-Policy is intentionally NOT defined here. The nonce-
  // based CSP is generated fresh per request in src/proxy.ts so each script
  // tag can carry a unique nonce. A static CSP here would conflict with the
  // dynamic nonce policy and re-introduce 'unsafe-inline' coverage.
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Note: nonce-based CSP forces dynamic rendering on routes that emit
  // inline scripts (the root layout does — anti-FOUC + JSON-LD). Cached
  // components inside those routes still cache; only the dynamic shell
  // pays the cost. See ONBOARDING.md §14 for the full trade-off rationale.
  cacheComponents: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
