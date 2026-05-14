'use client';

import { useCallback, useId, useMemo, useState } from 'react';

import { cx } from '@/lib/utils';

import { TabsContext } from './context';
import styles from './tabs.module.css';

type TabsProps = {
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

  const setActiveTab = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const ctxValue = useMemo(
    () => ({ activeTab, setActiveTab, orientation, idPrefix }),
    [activeTab, setActiveTab, orientation, idPrefix],
  );

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
