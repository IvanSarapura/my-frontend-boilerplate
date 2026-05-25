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

  // Own controller to enforce the timeout while still honouring the caller's
  // AbortSignal (e.g. React Query's); the timer is cleared in `finally`.
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
    // Our timeout fired → 504. A caller-initiated abort is re-thrown untouched.
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

  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[apiClient] No schema provided for ${url}; returning unvalidated data. ` +
        'Pass a Zod schema to validate the response.',
    );
  }
  return data as T;
}
