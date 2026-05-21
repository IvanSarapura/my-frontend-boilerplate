import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

// Opt-in bundle analyzer. Activates only when ANALYZE=true is set, so normal
// builds (`next build`) pay zero overhead. Run `npm run analyze` to produce
// HTML treemaps in `.next/analyze/` (client.html, nodejs.html, edge.html).
//
// Next.js 16 defaults to Turbopack, which is NOT supported by
// `@next/bundle-analyzer` (webpack-only tool). The `analyze` npm script
// forces the webpack bundler via `next build --webpack` so the analyzer
// hooks fire. Treat the report as a diagnostic snapshot of the webpack
// bundle, not of the production Turbopack build (the two have small
// differences in chunking — for absolute numbers, deploy + measure).
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

  // Gzip compression for HTML, RSC payloads and static assets when serving
  // via `next start` or a custom Node server. This is Next.js's default
  // (declared here as intent-as-documentation):
  //   - Algorithm: gzip ONLY. Brotli is NOT served by next start; it must
  //     be handled at the edge (reverse-proxy, CDN, Vercel).
  //   - No-op on Vercel: the edge already serves brotli/gzip; this flag is
  //     irrelevant there.
  //   - Self-host behind Nginx/Caddy/Cloudflare: prefer `compress: false`
  //     and let the proxy compress (avoids double-encoding, enables brotli).
  //   - Self-host directly via `next start`: keep `true` to get gzip.
  compress: true,

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

export default withBundleAnalyzer(nextConfig);
