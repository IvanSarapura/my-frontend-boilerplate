import { describe, expect, it } from 'vitest';

import { GET } from './route';

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const response = await GET();
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  it('returns a valid ISO 8601 timestamp', async () => {
    const before = Date.now();
    const response = await GET();
    const after = Date.now();
    const body = await response.json();
    const ts = new Date(body.timestamp).getTime();
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });

  it('responds with HTTP 200', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });
});
