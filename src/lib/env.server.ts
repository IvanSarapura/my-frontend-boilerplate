import 'server-only';

import { z } from 'zod';

/**
 * Server-only environment variables.
 *
 * The `import 'server-only'` at the top of this module makes Next.js throw a
 * build-time error if any Client Component (or code transitively imported by
 * one) reaches this file. That guarantees server secrets cannot leak into the
 * client bundle.
 *
 * To add a new secret:
 *
 * 1. Add the variable to the schema below with a Zod validator. Use
 *    `.optional()` while you are still wiring it up, then make it required
 *    once the consumer code is in place.
 * 2. Add the same name to `.env.example` with a placeholder value so other
 *    developers know it exists.
 * 3. Import `serverEnv` from this module in your server-side code (Route
 *    Handlers, Server Actions, Server Components, etc.). Never reference
 *    `process.env.<NAME>` directly — that bypasses the schema.
 *
 * Example additions:
 *
 *   DATABASE_URL: z.string().url(),
 *   STRIPE_SECRET_KEY: z.string().min(32),
 *   SENTRY_AUTH_TOKEN: z.string().optional(),
 *
 * The schema is intentionally empty today — the boilerplate ships no secrets.
 * The module exists so the pattern is in place before the first secret arrives.
 */
const serverEnvSchema = z.object({});

export const serverEnv = serverEnvSchema.parse(process.env);

export type ServerEnv = z.infer<typeof serverEnvSchema>;
