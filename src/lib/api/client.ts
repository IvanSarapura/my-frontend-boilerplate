import { z } from 'zod';

type ApiClientOptions<T> = RequestInit & {
  /** Required: the response is always validated against this Zod contract.
   * For an intentional passthrough, pass `z.unknown()` explicitly. */
  schema: z.ZodSchema<T>;
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

// Fixed, safe messages keyed by status — never echo upstream `statusText`,
// which is backend-controlled and can leak implementation details. The exact
// code stays available on `ApiError.status` for programmatic handling.
const STATUS_MESSAGES: Record<number, string> = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  408: 'Request timeout',
  409: 'Conflict',
  429: 'Too many requests',
  500: 'Server error',
  502: 'Bad gateway',
  503: 'Service unavailable',
  504: 'Gateway timeout',
};

function safeStatusMessage(status: number): string {
  return STATUS_MESSAGES[status] ?? 'Request failed';
}

// Normalize via `new Headers()` so a caller's Headers instance or tuple array
// (both valid HeadersInit) merge correctly — a plain spread would drop them.
function buildHeaders(
  callerHeaders: HeadersInit | undefined,
  body: BodyInit | null | undefined,
): Headers {
  const headers = new Headers(callerHeaders);
  // JSON-first client: accept JSON unless the caller asked for something else.
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  // Only declare a JSON Content-Type for string bodies (the JSON.stringify
  // case). FormData/Blob/URLSearchParams/streams carry their own type — let the
  // platform set it. The caller's explicit Content-Type always wins.
  if (typeof body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return headers;
}

export async function apiClient<T>(
  url: string,
  options: ApiClientOptions<T>,
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
      headers: buildHeaders(fetchOptions.headers, fetchOptions.body),
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
    throw new ApiError(safeStatusMessage(res.status), res.status);
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new ApiError('Invalid JSON response from upstream', 502);
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError(
      `Schema validation failed: ${parsed.error.message}`,
      422,
    );
  }
  return parsed.data;
}
