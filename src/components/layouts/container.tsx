import type { HTMLAttributes } from 'react';

import { cx } from '@/lib/utils';

import styles from './container.module.css';

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={cx(styles.container, className)} {...props}>
      {children}
    </div>
  );
}
