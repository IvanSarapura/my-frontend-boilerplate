import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useBreakpoint, useIsMobile, useMediaQuery } from './use-media-query';

type Listener = (e: MediaQueryListEvent) => void;

function installMatchMedia(initialMatches: boolean) {
  const listeners = new Set<Listener>();
  const mql = {
    matches: initialMatches,
    media: '(min-width: 768px)',
    onchange: null,
    addEventListener: (_: string, cb: Listener) => listeners.add(cb),
    removeEventListener: (_: string, cb: Listener) => listeners.delete(cb),
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  };

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue(mql),
  });

  return {
    mql,
    fire(matches: boolean) {
      mql.matches = matches;
      listeners.forEach(cb =>
        cb({ matches } as unknown as MediaQueryListEvent),
      );
    },
    listenerCount: () => listeners.size,
  };
}

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the initial match state synchronously', () => {
    installMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('returns false when the query does not match', () => {
    installMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('updates when the MediaQueryList fires a change event', () => {
    const ctrl = installMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);
    act(() => ctrl.fire(true));
    expect(result.current).toBe(true);
    act(() => ctrl.fire(false));
    expect(result.current).toBe(false);
  });

  it('re-reads the snapshot from the MediaQueryList on each notification', () => {
    const ctrl = installMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    // Mutate the list's live state, then notify without trusting the event
    // payload: useSyncExternalStore must reflect the re-read `.matches`.
    act(() => {
      ctrl.mql.matches = true;
      ctrl.fire(true);
    });
    expect(result.current).toBe(true);
  });

  it('removes its listener on unmount to avoid leaks', () => {
    const ctrl = installMatchMedia(false);
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(ctrl.listenerCount()).toBe(1);
    unmount();
    expect(ctrl.listenerCount()).toBe(0);
  });
});

describe('useBreakpoint', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('queries the canonical breakpoint and reports a match', () => {
    const matchMedia = installMatchMedia(true);
    const { result } = renderHook(() => useBreakpoint('md'));

    expect(result.current).toBe(true);
    expect(matchMedia.mql.media).toBeDefined();
    expect(window.matchMedia).toHaveBeenCalledWith('(width >= 768px)');
  });

  it('reports no match below the breakpoint', () => {
    installMatchMedia(false);
    const { result } = renderHook(() => useBreakpoint('lg'));
    expect(result.current).toBe(false);
  });
});

describe('useIsMobile', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is true below md', () => {
    installMatchMedia(false);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('is false at md and up', () => {
    installMatchMedia(true);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
