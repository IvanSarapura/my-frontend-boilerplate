import { describe, expect, it } from 'vitest';

import { GET, OPTIONS } from './route';

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

  it('sets a wildcard CORS allow-origin header', async () => {
    const response = await GET();
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe(
      'GET, OPTIONS',
    );
  });
});

describe('OPTIONS /api/health (CORS preflight)', () => {
  it('responds with HTTP 204', () => {
    const response = OPTIONS();
    expect(response.status).toBe(204);
  });

  it('echoes the CORS headers expected by browsers', () => {
    const response = OPTIONS();
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe(
      'GET, OPTIONS',
    );
    expect(response.headers.get('Access-Control-Max-Age')).toBe('86400');
  });
});
