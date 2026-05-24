import { z } from 'zod';

type ApiClientOptions<T> = RequestInit & {
  schema?: z.ZodSchema<T>;
  /** Abort the request after this many ms. Defaults to 10s. */
  timeoutMs?: number;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  url: string,
  options: ApiClientOptions<T> = {},
): Promise<T> {
  const {
    schema,
    timeoutMs = 10_000,
    signal: callerSignal,
    ...fetchOptions
  } = options;

  // Own controller so we can enforce a timeout while still honouring a caller's
  // AbortSignal (e.g. React Query's). The timer is always cleared in `finally`
  // so it never lingers in tests or serverless invocations.
  const controller = new AbortController();
  const onCallerAbort = () => controller.abort(callerSignal?.reason);
  if (callerSignal?.aborted) controller.abort(callerSignal.reason);
  else callerSignal?.addEventListener('abort', onCallerAbort, { once: true });
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });
  } catch (err) {
    // Our timeout fired (the caller did not abort) → surface a gateway timeout.
    // A caller-initiated cancellation is re-thrown untouched so React Query and
    // other callers can detect their own abort.
    if (controller.signal.aborted && !callerSignal?.aborted) {
      throw new ApiError(`Request timed out after ${timeoutMs}ms`, 504);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
    callerSignal?.removeEventListener('abort', onCallerAbort);
  }

  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}: ${res.statusText}`, res.status);
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new ApiError('Invalid JSON response from upstream', 502);
  }

  if (schema) {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw new ApiError(
        `Schema validation failed: ${parsed.error.message}`,
        422,
      );
    }
    return parsed.data;
  }

  return data as T;
}
