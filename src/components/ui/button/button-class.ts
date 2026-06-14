import { cx } from '@/lib/utils';

import styles from './button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string | undefined;
}

/** Shared button styling, so a `next/link` (`ButtonLink`) can look identical. */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonClassOptions = {}): string {
  return cx(styles.button, styles[variant], styles[size], className);
}
