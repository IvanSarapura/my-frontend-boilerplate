import { afterEach, describe, expect, it, vi } from 'vitest';

// env.ts runs its validation + production warning at module load, so each case
// re-imports it fresh under a different environment.
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('env', () => {
  it('warns in production when a public var falls back to its default', async () => {
    vi.resetModules();
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', undefined);
    vi.stubEnv('NEXT_PUBLIC_APP_URL', undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { env } = await import('./env');

    expect(env.NEXT_PUBLIC_APP_NAME).toBe('My App'); // default applied
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('NEXT_PUBLIC_APP_NAME'),
    );
  });

  it('does not warn when the public vars are set in production', async () => {
    vi.resetModules();
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'My Real App');
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://example.com');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { env } = await import('./env');

    expect(env.NEXT_PUBLIC_APP_NAME).toBe('My Real App');
    expect(warn).not.toHaveBeenCalled();
  });
});
