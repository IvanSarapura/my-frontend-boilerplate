import { cx } from '@/lib/utils';

import styles from './icon-base.module.css';
import type { IconBaseProps } from './types';

export function IconBase({
  size = 20,
  className,
  'aria-label': ariaLabel,
  children,
  ...rest
}: IconBaseProps) {
  const isDecorative = !ariaLabel;

  return (
    <svg
      className={cx(styles.icon, className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={isDecorative ? undefined : 'img'}
      aria-label={ariaLabel}
      aria-hidden={isDecorative ? true : undefined}
      focusable={false}
      {...rest}
    >
      {children}
    </svg>
  );
}
