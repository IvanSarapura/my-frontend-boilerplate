import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('My App'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  // Posts/comments API. Normalized to a bare origin so the value is always
  // valid inside the CSP `connect-src` directive built in src/proxy.ts.
  NEXT_PUBLIC_API_ORIGIN: z
    .string()
    .url()
    .default('https://jsonplaceholder.typicode.com')
    .transform(v => new URL(v).origin),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_ORIGIN: process.env.NEXT_PUBLIC_API_ORIGIN,
});

// Defaults keep dev zero-config but shouldn't ship to production. Warn (don't
// crash) when a public var falls back to its default in a production build.
if (process.env.NODE_ENV === 'production') {
  for (const key of [
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_API_ORIGIN',
  ] as const) {
    if (!process.env[key]) {
      console.warn(
        `[env] ${key} is not set; using a development default. Set it in production.`,
      );
    }
  }
}
