'use client';

import { cx } from '@/lib/utils';

import { useTabsContext } from './context';
import styles from './tabs.module.css';

type TabsListProps = {
  className?: string | undefined;
  children: React.ReactNode;
};

export function TabsList({ className, children }: TabsListProps) {
  const { orientation } = useTabsContext();

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cx(
        styles.list,
        orientation === 'vertical' && styles.listVertical,
        className,
      )}
    >
      {children}
    </div>
  );
}
