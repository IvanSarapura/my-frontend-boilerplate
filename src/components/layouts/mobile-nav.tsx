'use client';

import { useEffect, useId, useRef } from 'react';

import { CloseIcon, MenuIcon } from '@/components/ui/icon';
import { useBreakpoint } from '@/hooks/use-media-query';
import { useModalBehavior } from '@/hooks/use-modal-behavior';
import { useSwipe } from '@/hooks/use-swipe';
import { useToggle } from '@/hooks/use-toggle';
import { cx } from '@/lib/utils';

import styles from './mobile-nav.module.css';

type MobileNavSize = 'md' | 'lg';

interface MobileNavProps {
  /** Links/content: shown inline on desktop, inside the drawer on mobile. */
  children: React.ReactNode;
  /** Accessible name for the <nav> landmark and the open drawer. */
  label?: string;
  /** Accessible name for the hamburger button. */
  menuLabel?: string;
  /** Accessible name for the in-drawer close button. */
  closeLabel?: string;
  /** Scales the hamburger/close target + icon. `lg` pairs with `<Header size="lg">`. */
  size?: MobileNavSize;
  /** Strip the hamburger's button chrome → a plain icon (keeps tap target +
   * focus ring). Useful next to a `ThemeSwitch` for equal-height controls. */
  bareToggle?: boolean;
  className?: string;
}

/** Menu/close icon px paired to each size so the glyph scales with the target. */
const ICON_SIZE: Record<MobileNavSize, number> = { md: 24, lg: 28 };

// Exception to the ICON_SIZE control-pairing: the bare hamburger is sized for
// OPTICAL parity with an adjacent ~28px ThemeSwitch, not its own button.
// MenuIcon's bars fill ~50% of the box, so 48px → ~24px visible lines — a touch
// shorter than the switch for balance, and it keeps the bar from growing.
const BARE_MENU_ICON = 42;

/**
 * Responsive navigation: an inline bar from `md` up, and a hamburger-driven
 * off-canvas drawer below it. Single DOM tree — CSS decides the presentation,
 * so it renders identically on the server (no breakpoint flash on hydration).
 */
export function MobileNav({
  children,
  label = 'Main navigation',
  menuLabel = 'Open menu',
  closeLabel = 'Close menu',
  size = 'md',
  bareToggle = false,
  className,
}: MobileNavProps) {
  const [open, toggle, setOpen] = useToggle(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = () => setOpen(false);
  // Focus trap + Esc + backdrop click, shared with Modal.
  useModalBehavior(open, close, overlayRef);
  // Swipe the panel toward the edge it slid from to dismiss it.
  const swipe = useSwipe({ onSwipeRight: close });

  // The drawer is desktop-hidden; close it if the viewport grows past `md`
  // (e.g. orientation change) so focus and state never get stranded.
  const isDesktop = useBreakpoint('md');
  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop, setOpen]);

  // Dialog semantics only while the mobile drawer is open — never on the
  // desktop inline bar.
  const dialogProps = open
    ? ({ role: 'dialog', 'aria-modal': true, 'aria-label': label } as const)
    : {};

  return (
    <nav aria-label={label} className={cx(styles.nav, styles[size], className)}>
      <button
        type="button"
        className={cx(styles.toggle, bareToggle && styles.bare)}
        aria-label={menuLabel}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="dialog"
        onClick={toggle}
      >
        <MenuIcon size={bareToggle ? BARE_MENU_ICON : ICON_SIZE[size]} />
      </button>

      <div
        ref={overlayRef}
        className={cx(styles.overlay, open && styles.overlayOpen)}
        {...dialogProps}
      >
        <div id={menuId} className={styles.menu} {...swipe}>
          {open && (
            <button
              type="button"
              className={styles.close}
              aria-label={closeLabel}
              onClick={close}
            >
              <CloseIcon size={ICON_SIZE[size]} />
            </button>
          )}
          {children}
        </div>
      </div>
    </nav>
  );
}
