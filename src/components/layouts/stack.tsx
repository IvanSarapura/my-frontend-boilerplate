import type { HTMLAttributes } from 'react';

import { cx } from '@/lib/utils';

import styles from './stack.module.css';

/** Spacing between children, mapped to the global --space scale. */
type Gap = 2 | 4 | 6 | 8;

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
}

/** Vertical flow: stacks children in a column with a consistent gap. */
export function Stack({ gap = 4, className, children, ...props }: StackProps) {
  return (
    <div
      className={cx(styles.stack, styles[`gap-${gap}`], className)}
      {...props}
    >
      {children}
    </div>
  );
}
