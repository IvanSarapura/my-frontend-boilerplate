// Vendor-agnostic error reporting hook. Callers get a stable `reportError`
// surface; adopting an SDK later is a one-file change. See README → Error Tracking.

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

  // Production: intentional no-op. Replace this body with your SDK call,
  // keeping the signature stable. See README → Error Tracking.
}
