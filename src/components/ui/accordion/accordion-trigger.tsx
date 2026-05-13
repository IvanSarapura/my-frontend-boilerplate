'use client';

import { Icon } from '@/components/ui/icon';
import { cx } from '@/lib/utils';

import styles from './accordion.module.css';
import { useAccordionContext, useAccordionItemContext } from './context';

type AccordionTriggerProps = {
  className?: string | undefined;
  children: React.ReactNode;
};

export function AccordionTrigger({
  className,
  children,
}: AccordionTriggerProps) {
  const { toggle } = useAccordionContext();
  const { value, isOpen, disabled, triggerId, contentId } =
    useAccordionItemContext();

  return (
    <button
      type="button"
      id={triggerId}
      className={cx(styles.trigger, className)}
      onClick={() => toggle(value)}
      disabled={disabled}
      aria-expanded={isOpen}
      aria-controls={contentId}
    >
      <span className={styles.triggerLabel}>{children}</span>
      <Icon
        name="chevron-down"
        size={18}
        className={cx(styles.chevron, isOpen && styles.chevronOpen)}
      />
    </button>
  );
}
