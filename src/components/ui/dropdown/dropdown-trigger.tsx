'use client';

import type React from 'react';

import { cx } from '@/lib/utils';

import { useDropdownContext } from './context';
import styles from './dropdown.module.css';

export type DropdownTriggerProps = {
  children: React.ReactNode;
  className?: string | undefined;
};

export function DropdownTrigger({ children, className }: DropdownTriggerProps) {
  const { refs, getReferenceProps } = useDropdownContext();

  return (
    <button
      // eslint-disable-next-line react-hooks/refs -- floating-ui callback ref, reads DOM node outside render
      ref={refs.setReference}
      type="button"
      className={cx(styles.trigger, className)}
      {...getReferenceProps()}
    >
      {children}
    </button>
  );
}
