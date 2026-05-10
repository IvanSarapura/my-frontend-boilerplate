import { cx } from '@/lib/utils';

import styles from './spinner.module.css';

type SpinnerProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
  sm: '1rem',
  md: '2rem',
  lg: '3rem',
};

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <div
      className={cx(styles.spinner, className)}
      style={{ width: sizeMap[size], height: sizeMap[size] }}
      aria-hidden="true"
    />
  );
}
