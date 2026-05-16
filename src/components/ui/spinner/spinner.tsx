import { cx } from '@/lib/utils';

import styles from './spinner.module.css';

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerVariant = 'default' | 'muted' | 'white';

type SpinnerProps = {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  /** Accessible label announced by screen readers. Defaults to "Loading". */
  label?: string;
  className?: string;
};

export function Spinner({
  size = 'md',
  variant = 'default',
  label,
  className,
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label ?? 'Loading'}
      className={cx(
        styles.root,
        styles[size],
        variant !== 'default' && styles[variant],
        className,
      )}
    >
      <svg className={styles.svg} viewBox="0 0 24 24" aria-hidden="true">
        <circle className={styles.track} cx="12" cy="12" r="9" />
        <circle className={styles.arc} cx="12" cy="12" r="9" />
      </svg>
    </span>
  );
}
