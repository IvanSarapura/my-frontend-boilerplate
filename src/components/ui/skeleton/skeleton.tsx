import type { CSSProperties } from 'react';

import { cx } from '@/lib/utils';

import styles from './skeleton.module.css';

type SkeletonVariant = 'text' | 'circle' | 'rect';

type SkeletonProps = {
  variant?: SkeletonVariant | undefined;
  width?: number | string | undefined;
  height?: number | string | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  /**
   * Optional accessible name. When supplied, the skeleton is announced as
   * a live `role="status"` region (useful for block-level loading
   * placeholders so screen readers receive a "loading" cue). When omitted,
   * the element stays fully decorative with `aria-hidden`.
   */
  label?: string | undefined;
};

export function Skeleton({
  variant = 'rect',
  width,
  height,
  className,
  style,
  label,
}: SkeletonProps) {
  const semanticProps = label
    ? {
        role: 'status' as const,
        'aria-live': 'polite' as const,
        'aria-label': label,
      }
    : { 'aria-hidden': true as const };

  return (
    <span
      {...semanticProps}
      className={cx(styles.skeleton, styles[variant], className)}
      style={{
        ...(width !== undefined ? { width } : {}),
        ...(height !== undefined ? { height } : {}),
        ...style,
      }}
    />
  );
}
