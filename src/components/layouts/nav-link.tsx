'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';

import { cx } from '@/lib/utils';

import styles from './nav-link.module.css';

type NavLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

/** Locale-aware nav link with active state. `href` must be fully qualified
 * (locale-prefixed) since usePathname() includes the locale segment. Active is
 * an exact match — nested-route highlighting is intentionally out of scope. */
export function NavLink({ href, className, children, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cx(styles.link, active && styles.active, className)}
      {...props}
    >
      {children}
    </Link>
  );
}
