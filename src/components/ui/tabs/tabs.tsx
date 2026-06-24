'use client';

import { useId, useState } from 'react';

import { cx } from '@/lib/utils';

import { TabsContext } from './context';
import styles from './tabs.module.css';

export type TabsProps = {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  className?: string | undefined;
  children: React.ReactNode;
};

export function Tabs({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
}: TabsProps) {
  const reactId = useId();
  const idPrefix = `tabs-${reactId}`;

  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue);
  const activeTab = isControlled ? controlledValue : internal;

  const setActiveTab = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const ctxValue = { activeTab, setActiveTab, orientation, idPrefix };

  return (
    <TabsContext.Provider value={ctxValue}>
      <div
        className={cx(
          styles.root,
          orientation === 'vertical' && styles.rootVertical,
          className,
        )}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}
