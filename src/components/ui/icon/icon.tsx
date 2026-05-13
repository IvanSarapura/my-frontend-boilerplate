import { cx } from '@/lib/utils';

import styles from './icon.module.css';
import { type IconName, icons } from './icons';

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  'aria-label'?: string;
};

export function Icon({
  name,
  size = 20,
  className,
  'aria-label': ariaLabel,
}: IconProps) {
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
      aria-hidden={isDecorative || undefined}
      focusable={false}
    >
      {icons[name]}
    </svg>
  );
}
