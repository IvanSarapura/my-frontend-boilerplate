'use client';

import type {
  FloatingContext,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import type React from 'react';
import { createContext, useContext } from 'react';

type FloatingRefs = ReturnType<typeof useFloating>['refs'];
type InteractionHandlers = ReturnType<typeof useInteractions>;

export type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  refs: FloatingRefs;
  floatingStyles: React.CSSProperties;
  context: FloatingContext;
  isPositioned: boolean;
  getReferenceProps: InteractionHandlers['getReferenceProps'];
  getFloatingProps: InteractionHandlers['getFloatingProps'];
  getItemProps: InteractionHandlers['getItemProps'];
  activeIndex: number | null;
  listRef: React.MutableRefObject<(HTMLElement | null)[]>;
};

export const DropdownContext = createContext<DropdownContextValue | null>(null);

export function useDropdownContext(): DropdownContextValue {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error('Dropdown sub-components must be used inside <Dropdown>.');
  }
  return ctx;
}
