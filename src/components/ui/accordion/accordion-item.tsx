'use client';

import { useId } from 'react';

import { cx } from '@/lib/utils';

import styles from './accordion.module.css';
import { AccordionItemContext, useAccordionContext } from './context';

export type AccordionItemProps = {
  value: string;
  disabled?: boolean | undefined;
  className?: string | undefined;
  children: React.ReactNode;
};

export function AccordionItem({
  value,
  disabled = false,
  className,
  children,
}: AccordionItemProps) {
  const { openItems } = useAccordionContext();
  const reactId = useId();
  const triggerId = `accordion-trigger-${reactId}`;
  const contentId = `accordion-content-${reactId}`;
  const isOpen = openItems.has(value);

  const ctxValue = { value, isOpen, disabled, triggerId, contentId };

  return (
    <AccordionItemContext.Provider value={ctxValue}>
      <div
        className={cx(styles.item, isOpen && styles.itemOpen, className)}
        data-state={isOpen ? 'open' : 'closed'}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}
