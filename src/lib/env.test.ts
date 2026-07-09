import { afterEach, describe, expect, it, vi } from 'vitest';

// env.ts runs its validation at module load, so each case re-imports it
// fresh under a different environment.
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('env', () => {
  it('throws in production when the public vars are missing', async () => {
    vi.resetModules();
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', undefined);
    vi.stubEnv('NEXT_PUBLIC_APP_URL', undefined);
    vi.stubEnv('NEXT_PUBLIC_API_ORIGIN', undefined);

    await expect(import('./env')).rejects.toThrow(
      /NEXT_PUBLIC_APP_NAME[\s\S]*NEXT_PUBLIC_APP_URL[\s\S]*NEXT_PUBLIC_API_ORIGIN/,
    );
  });

  it('names only the missing var when production is partially configured', async () => {
    vi.resetModules();
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'My Real App');
    vi.stubEnv('NEXT_PUBLIC_APP_URL', undefined);
    vi.stubEnv('NEXT_PUBLIC_API_ORIGIN', 'https://api.example.com');

    const error = await import('./env').then(
      () => null,
      (e: unknown) => e as Error,
    );

    expect(error).not.toBeNull();
    expect(error?.message).toContain('NEXT_PUBLIC_APP_URL');
    expect(error?.message).not.toContain('NEXT_PUBLIC_APP_NAME');
    expect(error?.message).not.toContain('NEXT_PUBLIC_API_ORIGIN');
  });

  it('parses when the public vars are set in production', async () => {
    vi.resetModules();
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'My Real App');
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://example.com');
    vi.stubEnv('NEXT_PUBLIC_API_ORIGIN', 'https://api.example.com');

    const { env } = await import('./env');

    expect(env.NEXT_PUBLIC_APP_NAME).toBe('My Real App');
    expect(env.NEXT_PUBLIC_APP_URL).toBe('https://example.com');
    expect(env.NEXT_PUBLIC_API_ORIGIN).toBe('https://api.example.com');
  });

  it('applies defaults outside production so dev stays zero-config', async () => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', undefined);
    vi.stubEnv('NEXT_PUBLIC_APP_URL', undefined);
    vi.stubEnv('NEXT_PUBLIC_API_ORIGIN', undefined);

    const { env } = await import('./env');

    expect(env.NEXT_PUBLIC_APP_NAME).toBe('My App');
    expect(env.NEXT_PUBLIC_APP_URL).toBe('http://localhost:3000');
    expect(env.NEXT_PUBLIC_API_ORIGIN).toBe(
      'https://jsonplaceholder.typicode.com',
    );
  });

  it('normalizes NEXT_PUBLIC_API_ORIGIN to a bare origin', async () => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_API_ORIGIN', 'https://api.example.com/v1/');

    const { env } = await import('./env');

    expect(env.NEXT_PUBLIC_API_ORIGIN).toBe('https://api.example.com');
  });

  it('throws when NEXT_PUBLIC_API_ORIGIN is not a valid URL', async () => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_API_ORIGIN', 'not-a-url');

    await expect(import('./env')).rejects.toThrow();
  });
});
