import { describe, expect, it } from 'vitest';

import { STALE_TIMES } from './query-defaults';

describe('STALE_TIMES', () => {
  it('treats STATIC as Infinity so cached data is never considered stale', () => {
    expect(STALE_TIMES.STATIC).toBe(Number.POSITIVE_INFINITY);
    expect(Number.isFinite(STALE_TIMES.STATIC)).toBe(false);
  });

  it('exposes monotonically increasing tiers (LIVE < INTERACTIVE < LONG < STATIC)', () => {
    expect(STALE_TIMES.LIVE).toBeLessThan(STALE_TIMES.INTERACTIVE);
    expect(STALE_TIMES.INTERACTIVE).toBeLessThan(STALE_TIMES.LONG);
    expect(STALE_TIMES.LONG).toBeLessThan(STALE_TIMES.STATIC);
  });

  it('uses millisecond units consistent with TanStack Query', () => {
    expect(STALE_TIMES.LIVE).toBe(0);
    expect(STALE_TIMES.INTERACTIVE).toBe(60_000);
    expect(STALE_TIMES.LONG).toBe(300_000);
  });
});
