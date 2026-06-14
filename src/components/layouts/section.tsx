import type { HTMLAttributes } from 'react';

import { cx } from '@/lib/utils';

import styles from './section.module.css';

type SectionSurface = 'none' | 'muted';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  surface?: SectionSurface;
}

/** Vertical-rhythm band (`padding-block: --section-py`). Nest a `<Container>`
 * inside for gutters; `surface="muted"` makes a full-width background band. */
export function Section({
  surface = 'none',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cx(styles.section, styles[surface], className)}
      {...props}
    >
      {children}
    </section>
  );
}
