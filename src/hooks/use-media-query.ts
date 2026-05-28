'use client';

import { useEffect, useState } from 'react';

import { type Breakpoint, mediaUp } from '@/lib/breakpoints';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/** True when the viewport is at least the given breakpoint (mobile-first). */
export function useBreakpoint(bp: Breakpoint): boolean {
  return useMediaQuery(mediaUp(bp));
}

/** True below `md` — phone-sized, single-column territory. */
export function useIsMobile(): boolean {
  return !useBreakpoint('md');
}
