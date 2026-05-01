import { cx } from '@/lib/utils';

import styles from './badge.module.css';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span className={cx(styles.badge, styles[variant], className)}>
      {children}
    </span>
  );
}
