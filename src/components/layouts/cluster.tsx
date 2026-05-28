import type { HTMLAttributes } from 'react';

import { cx } from '@/lib/utils';

import styles from './cluster.module.css';

/** Spacing between children, mapped to the global --space scale. */
type Gap = 2 | 4 | 6 | 8;

interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
}

/** Horizontal flow that wraps: rows of actions, badges or tags. */
export function Cluster({
  gap = 4,
  className,
  children,
  ...props
}: ClusterProps) {
  return (
    <div
      className={cx(styles.cluster, styles[`gap-${gap}`], className)}
      {...props}
    >
      {children}
    </div>
  );
}
