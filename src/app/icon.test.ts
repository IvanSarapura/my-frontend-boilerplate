import { describe, expect, it } from 'vitest';

import { generateImageMetadata } from './icon';

// ImageResponse (Satori) rendering is exercised at build/E2E, not in jsdom.
describe('icon generateImageMetadata', () => {
  const variants = generateImageMetadata();

  it('emits a 192 and a 512 png variant', () => {
    expect(variants.map(v => v.id)).toEqual(['192', '512']);
    expect(variants.map(v => v.size)).toEqual([
      { width: 192, height: 192 },
      { width: 512, height: 512 },
    ]);
    expect(variants.every(v => v.contentType === 'image/png')).toBe(true);
  });
});
