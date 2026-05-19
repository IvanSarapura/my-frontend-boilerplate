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
  // cacheComponents stays enabled. The root layout's nonced inline scripts
  // are isolated inside <Suspense> in src/components/head-scripts/, so the
  // shell pre-renders normally and only the <script nonce> tags resolve per
  // request. See ONBOARDING.md §14 for the full architecture.
  cacheComponents: true,

  // Allowlist for next/image external sources. Leave the array empty until a
  // real external image is needed — `next/image` blocks any foreign hostname
  // not listed here, which is intentional (prevents abuse of the optimizer
  // endpoint and forces explicit allowlisting per host).
  //
  // When you add a host, prefer the most restrictive shape possible
  // (specific protocol, pathname, port). Wildcards on hostname are accepted
  // but should be the last resort. See CONTRIBUTING.md → "Images and Static
  // Assets" for the full policy.
  //
  //   remotePatterns: [
  //     { protocol: 'https', hostname: 'cdn.example.com', pathname: '/assets/**' },
  //   ],
  images: {
    remotePatterns: [],
  },

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
