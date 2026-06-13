'use client';

import {
  type KeyboardEventHandler,
  type RefObject,
  useEffect,
  useRef,
} from 'react';

type Orientation = 'horizontal' | 'vertical' | 'both';

type UseRovingFocusOptions = {
  /** Arrow-key axis. 'both' enables all four arrows. Default 'horizontal'. */
  orientation?: Orientation | undefined;
  /** Wrap from last→first and first→last. Default true. */
  loop?: boolean | undefined;
  /**
   * CSS selector for navigable items, scoped to the container. Disabled-skipping
   * is expressed here. Default '[role="tab"]:not([disabled])'.
   */
  itemSelector?: string | undefined;
  /**
   * true = the hook owns the roving tabindex (focus-driven): the focused item
   * gets 0 and the rest -1, and it seeds a single tab stop on mount. false
   * (default, selection-driven) = the hook only moves focus.
   */
  manageTabIndex?: boolean | undefined;
  /** Called with the element focus moved to, after the move. */
  onMove?: ((item: HTMLElement) => void) | undefined;
};

type RovingFocusProps<T extends HTMLElement> = {
  containerRef: RefObject<T | null>;
  onKeyDown: KeyboardEventHandler<T>;
};

const PREV_KEYS: Record<Orientation, readonly string[]> = {
  horizontal: ['ArrowLeft'],
  vertical: ['ArrowUp'],
  both: ['ArrowLeft', 'ArrowUp'],
};

const NEXT_KEYS: Record<Orientation, readonly string[]> = {
  horizontal: ['ArrowRight'],
  vertical: ['ArrowDown'],
  both: ['ArrowRight', 'ArrowDown'],
};

/**
 * Roving focus for static composite widgets (tablist, toolbar, menubar,
 * segmented control). Attach `containerRef` to the wrapper and spread
 * `onKeyDown` onto it; the handler relies on bubbling from the focused item, so
 * one listener covers every item. Activation (Enter/Space) is left to the
 * consumer. SSR-safe: the DOM is touched only inside the handler/effect, never
 * during render.
 */
export function useRovingFocus<T extends HTMLElement = HTMLElement>({
  orientation = 'horizontal',
  loop = true,
  itemSelector = '[role="tab"]:not([disabled])',
  manageTabIndex = false,
  onMove,
}: UseRovingFocusOptions = {}): RovingFocusProps<T> {
  const containerRef = useRef<T | null>(null);

  // Focus-driven mode: seed a single tab stop so the widget is reachable by Tab.
  // Runs on mount only (stable deps).
  useEffect(() => {
    if (!manageTabIndex || !containerRef.current) return;
    const items = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(itemSelector),
    );
    items.forEach((item, i) => {
      item.tabIndex = i === 0 ? 0 : -1;
    });
  }, [manageTabIndex, itemSelector]);

  // Plain handler (not useEffectEvent): it's attached via the JSX onKeyDown
  // prop, so React re-binds it each render for free — there is no effect to keep
  // from re-running, which is the only reason to reach for useEffectEvent.
  const onKeyDown: KeyboardEventHandler<T> = e => {
    const container = containerRef.current;
    if (!container) return;
    const items = Array.from(
      container.querySelectorAll<HTMLElement>(itemSelector),
    );
    if (items.length === 0) return;

    const current = items.indexOf(document.activeElement as HTMLElement);
    let target: HTMLElement | undefined;

    if (e.key === 'Home') {
      target = items[0];
    } else if (e.key === 'End') {
      target = items[items.length - 1];
    } else if (current === -1) {
      return; // focus isn't on a tracked item: only Home/End act
    } else if (NEXT_KEYS[orientation].includes(e.key)) {
      target = loop
        ? items[(current + 1) % items.length]
        : items[Math.min(current + 1, items.length - 1)];
    } else if (PREV_KEYS[orientation].includes(e.key)) {
      target = loop
        ? items[(current - 1 + items.length) % items.length]
        : items[Math.max(current - 1, 0)];
    }

    if (!target) return;
    e.preventDefault();
    target.focus();
    if (manageTabIndex) {
      for (const item of items) item.tabIndex = item === target ? 0 : -1;
    }
    onMove?.(target);
  };

  return { containerRef, onKeyDown };
}
