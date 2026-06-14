import type { HTMLAttributes } from 'react';

import { cx } from '@/lib/utils';

import styles from './container.module.css';

/** Content-width scale — see globals.css `--layout-max-*`. `bleed` spans
 * edge-to-edge; re-contain inner content with a nested `<Container>`. */
type ContainerSize = 'prose' | 'default' | 'wide' | 'bleed';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

export function Container({
  size = 'default',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div className={cx(styles.container, styles[size], className)} {...props}>
      {children}
    </div>
  );
}
