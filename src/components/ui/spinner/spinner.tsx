import { cx } from '@/lib/utils';

import styles from './spinner.module.css';

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerVariant = 'default' | 'muted' | 'white';

export type SpinnerProps = {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  /** Accessible label announced by screen readers. Defaults to "Loading". */
  label?: string;
  /**
   * Purely visual: drops `role="status"`/label and sets `aria-hidden`. Use
   * inside an element that already announces loading, to avoid nested live
   * regions. Defaults to `false`.
   */
  decorative?: boolean;
  className?: string;
};

export function Spinner({
  size = 'md',
  variant = 'default',
  label,
  decorative = false,
  className,
}: SpinnerProps) {
  const a11yProps = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({ role: 'status', 'aria-label': label ?? 'Loading' } as const);

  return (
    <span
      {...a11yProps}
      className={cx(
        styles.root,
        styles[size],
        variant !== 'default' && styles[variant],
        className,
      )}
    >
      {/* 24×24 viewBox matches the icon set; r=9 leaves ~3px stroke breathing room. */}
      <svg className={styles.svg} viewBox="0 0 24 24" aria-hidden="true">
        <circle className={styles.track} cx="12" cy="12" r="9" />
        <circle className={styles.arc} cx="12" cy="12" r="9" />
      </svg>
    </span>
  );
}
