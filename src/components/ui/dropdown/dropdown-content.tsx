'use client';

import {
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
} from '@floating-ui/react';
import type React from 'react';

import { cx } from '@/lib/utils';

import { useDropdownContext } from './context';
import styles from './dropdown.module.css';

export type DropdownContentProps = {
  children: React.ReactNode;
  className?: string | undefined;
};

export function DropdownContent({ children, className }: DropdownContentProps) {
  const {
    open,
    refs,
    floatingStyles,
    context,
    getFloatingProps,
    listRef,
    isPositioned,
  } = useDropdownContext();

  if (!open) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false}>
        <div
          // eslint-disable-next-line react-hooks/refs -- floating-ui callback ref, reads DOM node outside render
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            visibility: isPositioned ? 'visible' : 'hidden',
          }}
          className={cx(styles.content, className)}
          {...getFloatingProps()}
        >
          <FloatingList elementsRef={listRef}>{children}</FloatingList>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}
