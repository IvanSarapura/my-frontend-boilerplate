'use client';

import { useRef } from 'react';

import { cx } from '@/lib/utils';

import { useTabsContext } from './context';
import styles from './tabs.module.css';

type TabsTriggerProps = {
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
  const triggerRef = useRef<HTMLButtonElement>(null);

  const triggerId = `${idPrefix}-trigger-${value}`;
  const panelId = `${idPrefix}-panel-${value}`;
  const isActive = activeTab === value;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const list = triggerRef.current?.closest('[role="tablist"]');
    const triggers = Array.from(
      list?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([disabled])',
      ) ?? [],
    );
    const idx = triggers.indexOf(triggerRef.current!);
    const isHorizontal = orientation === 'horizontal';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

    if (e.key === nextKey) {
      e.preventDefault();
      triggers[(idx + 1) % triggers.length]?.focus();
    } else if (e.key === prevKey) {
      e.preventDefault();
      triggers[(idx - 1 + triggers.length) % triggers.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      triggers[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      triggers[triggers.length - 1]?.focus();
    } else if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      setActiveTab(value);
    }
  };

  return (
    <button
      ref={triggerRef}
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
