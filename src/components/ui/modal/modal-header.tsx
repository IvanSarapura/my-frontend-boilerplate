'use client';

import { type ReactNode, useEffect } from 'react';

import { cx } from '@/lib/utils';

import { useModalContext } from './context';
import styles from './modal.module.css';

export type ModalHeaderProps = {
  children: ReactNode;
  className?: string;
};

// Header slot of the compound Modal. Carries the id referenced by the dialog's
// `aria-labelledby`, so its text becomes the dialog's accessible name.
export function ModalHeader({ children, className }: ModalHeaderProps) {
  const { titleId, registerHeader } = useModalContext();
  // Signal presence so Modal won't dev-warn about a missing accessible name.
  useEffect(() => registerHeader(), [registerHeader]);
  return (
    <div id={titleId} className={cx(styles.headerSlot, className)}>
      {children}
    </div>
  );
}
