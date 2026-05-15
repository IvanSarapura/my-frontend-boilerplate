import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('reportError', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('logs structured payload to console in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { reportError } = await import('./observability');
    const error = new Error('boom');

    reportError(error, {
      source: 'unit-test',
      digest: 'abc123',
      extra: { userId: 42 },
    });

    expect(consoleErrorSpy).toHaveBeenCalledOnce();
    expect(consoleErrorSpy).toHaveBeenCalledWith('[observability]', {
      error,
      source: 'unit-test',
      digest: 'abc123',
      extra: { userId: 42 },
    });
  });

  it('uses an empty context when none is provided', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { reportError } = await import('./observability');
    const error = new Error('lonely');

    reportError(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith('[observability]', { error });
  });

  it('is a silent no-op in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { reportError } = await import('./observability');

    reportError(new Error('shipped'), { source: 'prod-test' });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
