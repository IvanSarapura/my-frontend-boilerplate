'use client';

import { cx } from '@/lib/utils';

import styles from './accordion.module.css';
import { useAccordionItemContext } from './context';

type AccordionContentProps = {
  className?: string | undefined;
  children: React.ReactNode;
};

export function AccordionContent({
  className,
  children,
}: AccordionContentProps) {
  const { isOpen, triggerId, contentId } = useAccordionItemContext();

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      className={cx(styles.content, isOpen && styles.contentOpen)}
    >
      <div className={cx(styles.contentInner, className)}>{children}</div>
    </div>
  );
}
