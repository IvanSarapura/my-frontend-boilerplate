import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('My App'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

// Defaults keep `npm run dev` zero-config, but they should never silently ship
// to production. Warn (do not crash) when a public var falls back to its default
// in a production build so the misconfiguration is visible in logs.
if (process.env.NODE_ENV === 'production') {
  for (const key of ['NEXT_PUBLIC_APP_NAME', 'NEXT_PUBLIC_APP_URL'] as const) {
    if (!process.env[key]) {
      console.warn(
        `[env] ${key} is not set; using a development default. Set it in production.`,
      );
    }
  }
}
