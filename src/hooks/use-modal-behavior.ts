'use client';

import { type RefObject, useEffect, useRef } from 'react';

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
      const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.[0]?.focus();
    } else {
      previousFocus.current?.focus();
    }
  }, [open, overlayRef]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && overlayRef.current) {
        const focusable = Array.from(
          overlayRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
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
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose, overlayRef]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (e.target === overlayRef.current) onClose();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, onClose, overlayRef]);
}
