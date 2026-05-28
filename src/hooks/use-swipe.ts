'use client';

import { type TouchEventHandler, useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /** Minimum horizontal travel in px to count as a swipe. Default 50. */
  threshold?: number;
}

interface SwipeProps {
  onTouchStart: TouchEventHandler;
  onTouchMove: TouchEventHandler;
  onTouchEnd: TouchEventHandler;
}

/**
 * Detects horizontal swipes from touch events. Returns handlers to spread onto
 * the target element. State lives in refs, so moving never triggers a re-render
 * and the hook is SSR-safe (it touches no browser globals during render).
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: SwipeHandlers): SwipeProps {
  const startX = useRef<number | null>(null);
  const endX = useRef<number | null>(null);

  return {
    onTouchStart: e => {
      endX.current = null;
      startX.current = e.touches[0]?.clientX ?? null;
    },
    onTouchMove: e => {
      endX.current = e.touches[0]?.clientX ?? null;
    },
    onTouchEnd: () => {
      if (startX.current === null || endX.current === null) return;
      const distance = startX.current - endX.current;
      if (distance > threshold) onSwipeLeft?.();
      else if (distance < -threshold) onSwipeRight?.();
    },
  };
}
