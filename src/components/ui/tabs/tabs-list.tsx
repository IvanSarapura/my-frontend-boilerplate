'use client';

import { useRovingFocus } from '@/hooks';
import { cx } from '@/lib/utils';

import { useTabsContext } from './context';
import styles from './tabs.module.css';

export type TabsListProps = {
  className?: string | undefined;
  children: React.ReactNode;
};

export function TabsList({ className, children }: TabsListProps) {
  const { orientation } = useTabsContext();
  const { containerRef, onKeyDown } = useRovingFocus<HTMLDivElement>({
    orientation,
    loop: true,
  });

  return (
    // Roving-focus container: keyboard is delegated from the focusable tabs via
    // bubbling, so the tablist itself must not be a tab stop (WAI-ARIA APG).
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      ref={containerRef}
      role="tablist"
      aria-orientation={orientation}
      onKeyDown={onKeyDown}
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
