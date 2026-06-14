import type { ReactNode } from 'react';

import { Cluster } from '@/components/layouts';
import { cx } from '@/lib/utils';

import styles from './hero.module.css';

interface HeroProps {
  /** Small uppercase label above the title. */
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Call-to-action buttons, wrapped in a Cluster. */
  actions?: ReactNode;
  /** Text alignment — `center` for the Minimal preset, `start` for marketing. */
  align?: 'start' | 'center';
  className?: string;
}

/** Hero block: eyebrow + display headline + subtitle + CTA cluster. */
export function Hero({
  eyebrow,
  title,
  subtitle,
  actions,
  align = 'start',
  className,
}: HeroProps) {
  return (
    <div
      className={cx(
        styles.hero,
        align === 'center' && styles.center,
        className,
      )}
    >
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {actions && <Cluster className={styles.actions}>{actions}</Cluster>}
    </div>
  );
}
