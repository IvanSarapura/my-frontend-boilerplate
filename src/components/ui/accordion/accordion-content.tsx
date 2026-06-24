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
      // Collapsed panel stays in the DOM (grid animation), so take it out of the
      // tab order + a11y tree until open. inert doesn't affect layout, so the
      // open/close animation is preserved (incl. prefers-reduced-motion).
      inert={!isOpen}
      className={cx(styles.content, isOpen && styles.contentOpen)}
    >
      <div className={styles.contentInner}>
        <div className={cx(styles.contentBody, className)}>{children}</div>
      </div>
    </div>
  );
}
