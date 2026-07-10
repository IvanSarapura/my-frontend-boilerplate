import { describe, expect, it } from 'vitest';

import manifest from './manifest';

describe('manifest', () => {
  const result = manifest();

  it('exposes a 192 and a 512 png icon', () => {
    const sizes = result.icons?.map(icon => icon.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
  });

  it('declares a maskable icon for adaptive home-screen masks', () => {
    const maskable = result.icons?.some(icon => icon.purpose === 'maskable');
    expect(maskable).toBe(true);
  });

  it('keeps the favicon fallback and aligns theme color to the brand accent', () => {
    const favicon = result.icons?.find(icon => icon.src === '/favicon.ico');
    expect(favicon).toBeDefined();
    expect(result.theme_color).toBe('#0070f3');
  });
});
