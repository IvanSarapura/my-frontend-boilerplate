import { describe, expect, it, vi } from 'vitest';

// The real `server-only` package throws when imported anywhere a client bundle
// can reach. In jsdom-mode tests both server and client live in the same
// process, so we stub it with a no-op to allow direct import. This mirrors
// what Next.js does internally during build for tests.
vi.mock('server-only', () => ({}));

describe('serverEnv', () => {
  it('exposes a parsed server env object', async () => {
    const { serverEnv } = await import('./env.server');
    expect(serverEnv).toBeTypeOf('object');
    expect(serverEnv).not.toBeNull();
  });

  it('returns an empty object today (no secrets defined yet)', async () => {
    const { serverEnv } = await import('./env.server');
    expect(Object.keys(serverEnv)).toHaveLength(0);
  });
});
