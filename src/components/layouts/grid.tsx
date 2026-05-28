import type { HTMLAttributes } from 'react';

import { cx } from '@/lib/utils';

import gapStyles from './gap.module.css';
import styles from './grid.module.css';
import type { Cols, Gap } from './types';

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: Cols;
  gap?: Gap;
}

/** Mobile-first grid: 1 column, then `cols` columns as the viewport grows. */
export function Grid({
  cols = 3,
  gap = 4,
  className,
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={cx(
        styles.grid,
        styles[`cols-${cols}`],
        gapStyles[`gap-${gap}`],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
