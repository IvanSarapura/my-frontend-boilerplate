import type { ReactNode } from 'react';

import { cx } from '@/lib/utils';

import styles from './modal.module.css';

export type ModalFooterProps = {
  children: ReactNode;
  className?: string;
};

export function ModalFooter({ children, className }: ModalFooterProps) {
  return <div className={cx(styles.footer, className)}>{children}</div>;
}
