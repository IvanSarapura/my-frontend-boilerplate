import 'server-only';

import { z } from 'zod';

// `import 'server-only'` makes Next.js fail the build if a Client Component
// reaches this file, so secrets can never leak into the client bundle.
// Schema empty by design — no secrets ship yet. See README → Environment Variables.
const serverEnvSchema = z.object({});

export const serverEnv = serverEnvSchema.parse(process.env);

export type ServerEnv = z.infer<typeof serverEnvSchema>;
