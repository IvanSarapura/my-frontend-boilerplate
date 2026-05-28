import type { HTMLAttributes } from 'react';

import { cx } from '@/lib/utils';

import gapStyles from './gap.module.css';
import styles from './stack.module.css';
import type { Gap } from './types';

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
}

/** Vertical flow: stacks children in a column with a consistent gap. */
export function Stack({ gap = 4, className, children, ...props }: StackProps) {
  return (
    <div
      className={cx(styles.stack, gapStyles[`gap-${gap}`], className)}
      {...props}
    >
      {children}
    </div>
  );
}
