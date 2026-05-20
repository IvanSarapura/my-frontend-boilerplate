'use client';

import type { ReactNode } from 'react';

import { cx } from '@/lib/utils';

import { useModalContext } from './context';
import styles from './modal.module.css';

type ModalHeaderProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Header slot of the compound Modal API. The wrapper carries the id
 * referenced by the dialog's `aria-labelledby`, so any text inside is
 * announced as the dialog's accessible name.
 */
export function ModalHeader({ children, className }: ModalHeaderProps) {
  const { titleId } = useModalContext();
  return (
    <div id={titleId} className={cx(styles.headerSlot, className)}>
      {children}
    </div>
  );
}
