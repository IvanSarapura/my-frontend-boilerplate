import type { ReactNode } from 'react';

import { cx } from '@/lib/utils';

import styles from './modal.module.css';

type ModalBodyProps = {
  children: ReactNode;
  className?: string;
};

export function ModalBody({ children, className }: ModalBodyProps) {
  return <div className={cx(styles.body, className)}>{children}</div>;
}
