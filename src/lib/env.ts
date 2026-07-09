import { z } from 'zod';

const appName = z.string().min(1);
const appUrl = z.string().url();
// Posts/comments API. Normalized to a bare origin so the value is always
// valid inside the CSP `connect-src` directive built in src/proxy.ts.
const toOrigin = (v: string) => new URL(v).origin;
const apiOrigin = z.string().url();

// Defaults keep dev/test zero-config, but a production build must set every
// public var explicitly — otherwise localhost metadata, a wrong sitemap and a
// demo-API CSP would ship silently.
const envSchema =
  process.env.NODE_ENV === 'production'
    ? z.object({
        NEXT_PUBLIC_APP_NAME: appName,
        NEXT_PUBLIC_APP_URL: appUrl,
        NEXT_PUBLIC_API_ORIGIN: apiOrigin.transform(toOrigin),
      })
    : z.object({
        NEXT_PUBLIC_APP_NAME: appName.default('My App'),
        NEXT_PUBLIC_APP_URL: appUrl.default('http://localhost:3000'),
        NEXT_PUBLIC_API_ORIGIN: apiOrigin
          .default('https://jsonplaceholder.typicode.com')
          .transform(toOrigin),
      });

// NEXT_PUBLIC_* values are inlined at build time, so each access must be
// static — a dynamic `process.env[key]` reaches the client as undefined.
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_ORIGIN: process.env.NEXT_PUBLIC_API_ORIGIN,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map(issue => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n  ');
  throw new Error(
    `[env] Invalid or missing public environment variables:\n  ${issues}\n` +
      'See .env.local.example and README → Environment Variables.',
  );
}

export const env = parsed.data;
