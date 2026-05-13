'use client';

import { createContext, useContext } from 'react';

export type AccordionContextValue = {
  type: 'single' | 'multiple';
  openItems: Set<string>;
  toggle: (value: string) => void;
};

export const AccordionContext = createContext<AccordionContextValue | null>(
  null,
);

export function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error(
      'Accordion sub-components must be used inside <Accordion>.',
    );
  }
  return ctx;
}

export type AccordionItemContextValue = {
  value: string;
  isOpen: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
};

export const AccordionItemContext =
  createContext<AccordionItemContextValue | null>(null);

export function useAccordionItemContext() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error(
      'AccordionTrigger and AccordionContent must be used inside <AccordionItem>.',
    );
  }
  return ctx;
}
