'use client';

import { type RefObject, useEffect, useEffectEvent, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Isolate the dialog from the rest of the page: walk from it up to <body> and,
// at each level, mark every sibling that is not on the path to the dialog as
// `inert` (blocks pointer + focus and drops it from the a11y tree). Works for
// both the portalled Modal (overlay is a direct child of <body>) and the inline
// MobileNav drawer (overlay is nested). Returns an undo that restores each
// element's prior `inert`, so stacked overlays unwind LIFO like the scroll-lock.
function hideOthers(dialog: HTMLElement): () => void {
  const undo: Array<() => void> = [];
  let node: HTMLElement | null = dialog;
  while (node && node !== document.body && node.parentElement) {
    for (const sibling of Array.from(node.parentElement.children)) {
      if (sibling === node || !(sibling instanceof HTMLElement)) continue;
      const previous = sibling.inert;
      sibling.inert = true;
      undo.push(() => {
        sibling.inert = previous;
      });
    }
    node = node.parentElement;
  }
  return () => undo.forEach(restore => restore());
}

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

  useEffect(() => {
    if (!open) return;
    // Saving the previous inline values (instead of resetting to '') keeps
    // pre-existing body styles intact and makes nested overlays restore LIFO.
    const { overflow, paddingRight } = document.body.style;
    // Compensate for the hidden scrollbar to avoid horizontal layout shift.
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);

  // Make the rest of the document inert so pointer/AT can't reach the backdrop;
  // the keyboard focus-trap below only covers Tab. Snapshot is taken on open, so
  // body children added later (e.g. a new toast) aren't covered — acceptable.
  useEffect(() => {
    if (!open) return;
    const dialog = overlayRef.current;
    if (!dialog) return;
    return hideOthers(dialog);
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
