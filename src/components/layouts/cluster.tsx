import type { HTMLAttributes } from 'react';

import { cx } from '@/lib/utils';

import styles from './cluster.module.css';
import gapStyles from './gap.module.css';
import type { Gap } from './types';

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
      className={cx(styles.cluster, gapStyles[`gap-${gap}`], className)}
      {...props}
    >
      {children}
    </div>
  );
}
