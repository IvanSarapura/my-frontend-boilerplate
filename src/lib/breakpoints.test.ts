import { describe, expect, it } from 'vitest';

import { BREAKPOINTS, mediaUp } from './breakpoints';

describe('breakpoints', () => {
  it('exposes the four canonical breakpoints in px', () => {
    expect(BREAKPOINTS).toEqual({ sm: 640, md: 768, lg: 1024, xl: 1280 });
  });

  it('builds a mobile-first media query for a breakpoint', () => {
    expect(mediaUp('sm')).toBe('(width >= 640px)');
    expect(mediaUp('md')).toBe('(width >= 768px)');
    expect(mediaUp('lg')).toBe('(width >= 1024px)');
    expect(mediaUp('xl')).toBe('(width >= 1280px)');
  });
});
