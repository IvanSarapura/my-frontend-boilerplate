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
};

export function Skeleton({
  variant = 'rect',
  width,
  height,
  className,
  style,
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(styles.skeleton, styles[variant], className)}
      style={{
        ...(width !== undefined ? { width } : {}),
        ...(height !== undefined ? { height } : {}),
        ...style,
      }}
    />
  );
}
