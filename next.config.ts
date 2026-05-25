import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

// Opt-in via ANALYZE=true (`npm run analyze`). Forces webpack since
// @next/bundle-analyzer doesn't support Turbopack; treat output as diagnostic.
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

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
  // CSP is intentionally NOT set here — it's generated per request with a fresh
  // nonce in src/proxy.ts; a static policy would conflict. See README → proxy.ts.
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Nonced inline scripts are isolated in <Suspense> (src/components/head-scripts/)
  // so the shell still pre-renders under PPR. See README → proxy.ts.
  cacheComponents: true,

  // Gzip when serving via `next start`. No-op on Vercel; when self-hosting
  // behind a proxy/CDN, prefer `compress: false` and let the proxy compress.
  compress: true,

  // Empty allowlist blocks all external image hosts by default. Add hosts as
  // narrowly as possible. See CONTRIBUTING → Images and Static Assets.
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

export default withBundleAnalyzer(nextConfig);
