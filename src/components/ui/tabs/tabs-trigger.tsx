'use client';

import { cx } from '@/lib/utils';

import { useTabsContext } from './context';
import styles from './tabs.module.css';

export type TabsTriggerProps = {
  value: string;
  disabled?: boolean | undefined;
  className?: string | undefined;
  children: React.ReactNode;
};

export function TabsTrigger({
  value,
  disabled = false,
  className,
  children,
}: TabsTriggerProps) {
  const { activeTab, setActiveTab, orientation, idPrefix } = useTabsContext();

  const triggerId = `${idPrefix}-trigger-${value}`;
  const panelId = `${idPrefix}-panel-${value}`;
  const isActive = activeTab === value;

  // Arrow/Home/End live in TabsList (useRovingFocus). Tabs use manual
  // activation, so only Enter/Space select here; preventDefault stops the native
  // button click from firing selection a second time.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      setActiveTab(value);
    }
  };

  return (
    <button
      type="button"
      role="tab"
      id={triggerId}
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={cx(
        styles.trigger,
        isActive && styles.triggerActive,
        orientation === 'vertical' && styles.triggerVertical,
        className,
      )}
      onClick={() => {
        if (!disabled) setActiveTab(value);
      }}
      onKeyDown={handleKeyDown}
    >
      {children}
    </button>
  );
}
