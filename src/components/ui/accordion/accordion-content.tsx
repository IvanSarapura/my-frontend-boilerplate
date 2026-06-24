'use client';

import { cx } from '@/lib/utils';

import styles from './accordion.module.css';
import { useAccordionItemContext } from './context';

export type AccordionContentProps = {
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
      <div className={styles.contentInner}>
        <div className={cx(styles.contentBody, className)}>{children}</div>
      </div>
    </div>
  );
}
