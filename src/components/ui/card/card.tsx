import type { HTMLAttributes } from 'react';

import { cx } from '@/lib/utils';

import styles from './card.module.css';

type CardVariant = 'default' | 'outlined' | 'interactive';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

export function Card({
  children,
  variant = 'default',
  className,
  ...props
}: CardProps) {
  return (
    <div className={cx(styles.card, styles[variant], className)} {...props}>
      {children}
    </div>
  );
}
