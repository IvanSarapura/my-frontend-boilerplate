import { describe, expect, it } from 'vitest';

import { contentType, size } from './apple-icon';

// ImageResponse (Satori) rendering is exercised at build/E2E, not in jsdom.
describe('apple-icon metadata', () => {
  it('is the standard 180x180 png apple touch icon', () => {
    expect(size).toEqual({ width: 180, height: 180 });
    expect(contentType).toBe('image/png');
  });
});
