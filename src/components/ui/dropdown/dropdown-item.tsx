'use client';

import { useListItem } from '@floating-ui/react';
import type React from 'react';

import { cx } from '@/lib/utils';

import { useDropdownContext } from './context';
import styles from './dropdown.module.css';

type DropdownItemProps = {
  children: React.ReactNode;
  onSelect?: (() => void) | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
};

export function DropdownItem({
  children,
  onSelect,
  disabled = false,
  className,
}: DropdownItemProps) {
  const { activeIndex, getItemProps, setOpen } = useDropdownContext();
  const { ref, index } = useListItem();

  const isActive = activeIndex === index;

  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      tabIndex={isActive ? 0 : -1}
      aria-disabled={disabled ? true : undefined}
      className={cx(styles.item, disabled && styles.itemDisabled, className)}
      {...getItemProps({
        onClick: () => {
          if (!disabled) {
            onSelect?.();
            setOpen(false);
          }
        },
      })}
    >
      {children}
    </button>
  );
}
