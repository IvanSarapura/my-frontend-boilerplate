'use client';

import { cx } from '@/lib/utils';

import { useTabsContext } from './context';
import styles from './tabs.module.css';

type TabsContentProps = {
  value: string;
  className?: string | undefined;
  children: React.ReactNode;
};

export function TabsContent({ value, className, children }: TabsContentProps) {
  const { activeTab, idPrefix } = useTabsContext();

  const panelId = `${idPrefix}-panel-${value}`;
  const triggerId = `${idPrefix}-trigger-${value}`;
  const isActive = activeTab === value;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={triggerId}
      tabIndex={0}
      hidden={!isActive}
      className={cx(styles.panel, className)}
    >
      {children}
    </div>
  );
}
