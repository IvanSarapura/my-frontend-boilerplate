'use client';

import {
  autoUpdate,
  flip,
  offset,
  type Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react';
import type React from 'react';
import { useRef, useState } from 'react';

import { DropdownContext } from './context';

export type DropdownProps = {
  children: React.ReactNode;
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  placement?: Placement | undefined;
};

export function Dropdown({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
}: DropdownProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen! : uncontrolledOpen;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<(HTMLElement | null)[]>([]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open,
    onOpenChange: handleOpenChange,
    placement,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'menu' });
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
    // Skip disabled items: each DropdownItem renders aria-disabled and registers
    // in listRef, so we read the state straight from the DOM node.
    disabledIndices: index =>
      listRef.current[index]?.getAttribute('aria-disabled') === 'true',
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, dismiss, role, listNav],
  );

  return (
    <DropdownContext.Provider
      value={{
        open,
        setOpen: handleOpenChange,
        refs,
        floatingStyles,
        context,
        isPositioned,
        getReferenceProps,
        getFloatingProps,
        getItemProps,
        activeIndex,
        listRef,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}
