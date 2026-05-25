'use client';

import { type RefObject, useEffect, useEffectEvent, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useModalBehavior(
  open: boolean,
  onClose: () => void,
  overlayRef: RefObject<HTMLDivElement | null>,
) {
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      if (document.activeElement instanceof HTMLElement) {
        previousFocus.current = document.activeElement;
      }
      const focusable =
        overlayRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      focusable?.[0]?.focus();
    } else {
      previousFocus.current?.focus();
    }
  }, [open, overlayRef]);

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'Tab' && overlayRef.current) {
      const focusable = Array.from(
        overlayRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      /* v8 ignore next -- modal always renders a close button */
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  useEffect(() => {
    if (!open) return;
    const listener = (e: KeyboardEvent) => onKeyDown(e);
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [open]);

  const onPointerDown = useEffectEvent((e: PointerEvent) => {
    if (e.target === overlayRef.current) onClose();
  });

  useEffect(() => {
    if (!open) return;
    const listener = (e: PointerEvent) => onPointerDown(e);
    document.addEventListener('pointerdown', listener);
    return () => document.removeEventListener('pointerdown', listener);
  }, [open]);
}
