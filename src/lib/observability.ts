/**
 * Vendor-agnostic error reporting hook.
 *
 * The boilerplate ships without an external error-tracking SDK on purpose: the
 * choice of vendor (Sentry, Rollbar, Highlight, Datadog…) belongs to the
 * product, not to the platform. This module exposes a stable `reportError`
 * surface that error boundaries and Server Actions can call today, so adopting
 * a vendor later becomes a single-file change instead of a refactor.
 *
 * See README → "Optional Integrations → Error Tracking" for the full
 * rationale and the recommended adoption recipe.
 */

export type ErrorContext = {
  /** Where the error was caught — e.g. 'root-error-boundary', 'server-action:contact'. */
  source?: string | undefined;
  /** Next.js error digest (server-thrown errors). */
  digest?: string | undefined;
  /** Free-form structured data. Keep values serialisable. */
  extra?: Record<string, unknown> | undefined;
};

const isDev = process.env.NODE_ENV !== 'production';

export function reportError(error: unknown, context: ErrorContext = {}): void {
  if (isDev) {
    console.error('[observability]', { error, ...context });
    return;
  }

  // Production: intentional no-op. Replace this block with your vendor SDK
  // call when the product picks one. Example with Sentry:
  //
  //   import * as Sentry from '@sentry/nextjs';
  //   Sentry.captureException(error, {
  //     tags: { source: context.source, digest: context.digest },
  //     extra: context.extra,
  //   });
  //
  // Keep the function signature stable so callers do not change.
}
