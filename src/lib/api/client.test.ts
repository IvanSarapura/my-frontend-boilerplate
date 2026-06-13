import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { server } from '@/mocks/node';

import { apiClient, ApiError } from './client';

// Per-test handlers via server.use(). The global afterEach in vitest.setup.ts
// calls server.resetHandlers(), so no manual cleanup is needed here.

describe('apiClient', () => {
  it('returns parsed data when the response matches the schema', async () => {
    server.use(
      http.get('https://api.test/user', () =>
        HttpResponse.json({ id: 1, name: 'Jane' }),
      ),
    );
    const schema = z.object({ id: z.number(), name: z.string() });

    const data = await apiClient('https://api.test/user', { schema });

    expect(data).toEqual({ id: 1, name: 'Jane' });
  });

  it('returns raw data unvalidated (and warns in dev) when no schema is provided', async () => {
    const payload = { anything: ['goes', 'here'] };
    server.use(
      http.get('https://api.test/raw', () => HttpResponse.json(payload)),
    );
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const data = await apiClient<typeof payload>('https://api.test/raw');

    expect(data).toEqual(payload);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('No schema provided'),
    );
    warn.mockRestore();
  });

  it('throws ApiError with the response status when the HTTP response is not ok', async () => {
    server.use(
      http.get(
        'https://api.test/missing',
        () => new HttpResponse('Not found', { status: 404 }),
      ),
    );

    await expect(apiClient('https://api.test/missing')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      message: 'Not found',
    });
  });

  it('never leaks the upstream statusText in the error message', async () => {
    server.use(
      http.get(
        'https://api.test/boom',
        () =>
          new HttpResponse(null, {
            status: 500,
            statusText: 'DB at db-internal:5432 down',
          }),
      ),
    );

    const error = (await apiClient('https://api.test/boom').catch(
      (e: unknown) => e,
    )) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(500);
    expect(error.message).toBe('Server error');
    expect(error.message).not.toContain('db-internal');
  });

  it('falls back to a generic message for unmapped statuses', async () => {
    server.use(
      http.get(
        'https://api.test/teapot',
        () => new HttpResponse(null, { status: 418 }),
      ),
    );

    await expect(apiClient('https://api.test/teapot')).rejects.toMatchObject({
      name: 'ApiError',
      status: 418,
      message: 'Request failed',
    });
  });

  it('throws ApiError(422) when schema validation fails', async () => {
    server.use(
      http.get('https://api.test/user', () =>
        HttpResponse.json({ id: 'not-a-number' }),
      ),
    );
    const schema = z.object({ id: z.number() });

    await expect(
      apiClient('https://api.test/user', { schema }),
    ).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
    });
  });

  it('merges custom headers and method with the default Content-Type', async () => {
    let receivedMethod: string | undefined;
    let receivedAuth: string | null = null;
    let receivedContentType: string | null = null;

    server.use(
      http.post('https://api.test/echo', ({ request }) => {
        receivedMethod = request.method;
        receivedAuth = request.headers.get('Authorization');
        receivedContentType = request.headers.get('Content-Type');
        return HttpResponse.json({ ok: true });
      }),
    );

    await apiClient('https://api.test/echo', {
      method: 'POST',
      headers: { Authorization: 'Bearer token-123' },
      body: JSON.stringify({ x: 1 }),
    });

    expect(receivedMethod).toBe('POST');
    expect(receivedAuth).toBe('Bearer token-123');
    expect(receivedContentType).toBe('application/json');
  });

  it('throws ApiError(504) when the request exceeds the timeout', async () => {
    server.use(
      http.get('https://api.test/slow', async () => {
        await delay('infinite');
        return HttpResponse.json({ ok: true });
      }),
    );

    await expect(
      apiClient('https://api.test/slow', { timeoutMs: 20 }),
    ).rejects.toMatchObject({ name: 'ApiError', status: 504 });
  });

  it('throws ApiError(502) when the response body is not valid JSON', async () => {
    server.use(
      http.get(
        'https://api.test/html',
        () =>
          new HttpResponse('<html>oops</html>', {
            headers: { 'Content-Type': 'text/html' },
          }),
      ),
    );

    await expect(apiClient('https://api.test/html')).rejects.toMatchObject({
      name: 'ApiError',
      status: 502,
    });
  });

  it('re-throws a caller-initiated abort without wrapping it in ApiError', async () => {
    server.use(
      http.get('https://api.test/cancel', async () => {
        await delay('infinite');
        return HttpResponse.json({ ok: true });
      }),
    );

    const controller = new AbortController();
    const promise = apiClient('https://api.test/cancel', {
      signal: controller.signal,
    });
    controller.abort();

    await expect(promise).rejects.not.toBeInstanceOf(ApiError);
  });

  it('aborts immediately when the caller signal is already aborted', async () => {
    server.use(
      http.get('https://api.test/pre-aborted', async () => {
        await delay('infinite');
        return HttpResponse.json({ ok: true });
      }),
    );

    const controller = new AbortController();
    controller.abort();

    await expect(
      apiClient('https://api.test/pre-aborted', { signal: controller.signal }),
    ).rejects.not.toBeInstanceOf(ApiError);
  });
});

describe('ApiError', () => {
  it('preserves the status and uses the ApiError name', () => {
    const err = new ApiError('Something broke', 503);

    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('ApiError');
    expect(err.status).toBe(503);
    expect(err.message).toBe('Something broke');
  });
});
