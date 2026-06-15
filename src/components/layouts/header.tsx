import type { ReactNode } from 'react';

import { cx } from '@/lib/utils';

import { Container } from './container';
import styles from './header.module.css';
import { MobileNav } from './mobile-nav';
import { NavLink } from './nav-link';

interface NavItem {
  href: string;
  label: string;
}

interface HeaderProps {
  /** Brand / wordmark slot (usually a link to home). */
  brand: ReactNode;
  /** Nav items — single source of truth, rendered inline (desktop) and in the
   * drawer (mobile). `href` must be locale-prefixed. */
  links?: NavItem[];
  /** Right-aligned slot, e.g. `<ThemeToggle />` or a CTA button. */
  actions?: ReactNode;
  navLabel?: string;
  menuLabel?: string;
  closeLabel?: string;
  /** `lg` scales the bar, wordmark and hamburger up; `md` is the default. */
  size?: 'md' | 'lg';
  /** Render the hamburger as a bare icon (no button box) — see `MobileNav`. */
  bareToggle?: boolean;
  className?: string;
}

/** Sticky page header. Server Component: composes the client `MobileNav`,
 * `NavLink`s and `actions` without shipping its own JS. */
export function Header({
  brand,
  links = [],
  actions,
  navLabel,
  menuLabel,
  closeLabel,
  size = 'md',
  bareToggle = false,
  className,
}: HeaderProps) {
  return (
    <header className={cx(styles.header, styles[size], className)}>
      <Container>
        <div className={styles.bar}>
          <div className={styles.brand}>{brand}</div>
          <MobileNav
            className={cx(styles.nav)}
            size={size}
            bareToggle={bareToggle}
            {...(navLabel !== undefined && { label: navLabel })}
            {...(menuLabel !== undefined && { menuLabel })}
            {...(closeLabel !== undefined && { closeLabel })}
          >
            {links.map(link => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </MobileNav>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </Container>
    </header>
  );
}
