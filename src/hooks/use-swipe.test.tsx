import { renderHook } from '@testing-library/react';
import type { TouchEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useSwipe } from './use-swipe';

/** Minimal React.TouchEvent stub carrying a single touch point. */
function touch(clientX: number): TouchEvent {
  return { touches: [{ clientX }] } as unknown as TouchEvent;
}

const empty = { touches: [] } as unknown as TouchEvent;

describe('useSwipe', () => {
  it('fires onSwipeLeft when dragged left past the threshold', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft }));

    result.current.onTouchStart(touch(200));
    result.current.onTouchMove(touch(120));
    result.current.onTouchEnd(empty);

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
  });

  it('fires onSwipeRight when dragged right past the threshold', () => {
    const onSwipeRight = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeRight }));

    result.current.onTouchStart(touch(100));
    result.current.onTouchMove(touch(200));
    result.current.onTouchEnd(empty);

    expect(onSwipeRight).toHaveBeenCalledTimes(1);
  });

  it('ignores travel below the threshold', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    const { result } = renderHook(() =>
      useSwipe({ onSwipeLeft, onSwipeRight }),
    );

    result.current.onTouchStart(touch(200));
    result.current.onTouchMove(touch(180));
    result.current.onTouchEnd(empty);

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('does nothing on a tap with no movement', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    const { result } = renderHook(() =>
      useSwipe({ onSwipeLeft, onSwipeRight }),
    );

    result.current.onTouchStart(touch(200));
    result.current.onTouchEnd(empty);

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('respects a custom threshold', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() =>
      useSwipe({ onSwipeLeft, threshold: 100 }),
    );

    result.current.onTouchStart(touch(200));
    result.current.onTouchMove(touch(120)); // 80px < 100
    result.current.onTouchEnd(empty);

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('no-ops a rightward swipe when only onSwipeLeft is provided', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft }));

    result.current.onTouchStart(touch(100));
    result.current.onTouchMove(touch(220));
    result.current.onTouchEnd(empty);

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('no-ops a leftward swipe when only onSwipeRight is provided', () => {
    const onSwipeRight = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeRight }));

    result.current.onTouchStart(touch(220));
    result.current.onTouchMove(touch(100));
    result.current.onTouchEnd(empty);

    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('handles a touchstart with no touch points gracefully', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft }));

    result.current.onTouchStart(empty);
    result.current.onTouchMove(touch(50));
    result.current.onTouchEnd(empty);

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('handles a touchmove with no touch points gracefully', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft }));

    result.current.onTouchStart(touch(200));
    result.current.onTouchMove(empty);
    result.current.onTouchEnd(empty);

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });
});
