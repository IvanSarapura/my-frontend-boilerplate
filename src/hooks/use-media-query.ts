'use client';

import { useSyncExternalStore } from 'react';

import { type Breakpoint, mediaUp } from '@/lib/breakpoints';

export function useMediaQuery(query: string): boolean {
  // Inline closures: the React Compiler memoizes them on `query`, so the
  // store only re-subscribes when the query changes.
  const subscribe = (onStoreChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onStoreChange);
    return () => mql.removeEventListener('change', onStoreChange);
  };
  return useSyncExternalStore(
    subscribe,
    // `.matches` is a live getter; calling matchMedia per snapshot is cheap
    // and keeps the snapshot independent from the subscription.
    () => window.matchMedia(query).matches,
    /* v8 ignore next -- SSR hydration baseline; not invoked under jsdom */
    () => false,
  );
}

/** True when the viewport is at least the given breakpoint (mobile-first). */
export function useBreakpoint(bp: Breakpoint): boolean {
  return useMediaQuery(mediaUp(bp));
}

/** True below `md` — phone-sized, single-column territory. */
export function useIsMobile(): boolean {
  return !useBreakpoint('md');
}
