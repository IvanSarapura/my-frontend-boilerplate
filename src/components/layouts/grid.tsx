import type { HTMLAttributes } from 'react';

import { cx } from '@/lib/utils';

import styles from './grid.module.css';

/** Max columns on desktop (lg). Always 1 on mobile, 2 from tablet (md) up. */
type Cols = 2 | 3 | 4;
/** Spacing between cells, mapped to the global --space scale. */
type Gap = 2 | 4 | 6 | 8;

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
        styles[`gap-${gap}`],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
