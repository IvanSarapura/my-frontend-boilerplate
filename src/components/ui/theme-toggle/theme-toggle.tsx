'use client';

import type { ButtonHTMLAttributes } from 'react';

import type { Theme } from '@/components/providers/theme-provider';
import { useTheme } from '@/components/providers/theme-provider';
import type { IconName } from '@/components/ui/icon';
import { Icon } from '@/components/ui/icon';
import { cx } from '@/lib/utils';

import styles from './theme-toggle.module.css';

type ThemeToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'aria-label'
> & {
  size?: number;
};

const CYCLE: Record<Theme, Theme> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

const ICON: Record<Theme, IconName> = {
  light: 'sun',
  dark: 'moon',
  system: 'monitor',
};

const LABEL: Record<Theme, string> = {
  light: 'Current theme: light. Switch to dark.',
  dark: 'Current theme: dark. Switch to system.',
  system: 'Current theme: system. Switch to light.',
};

export function ThemeToggle({
  size = 20,
  className,
  onClick,
  ...props
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const label = LABEL[theme];

  return (
    <button
      type="button"
      className={cx(styles.toggle, className)}
      aria-label={label}
      title={label}
      onClick={(e) => {
        setTheme(CYCLE[theme]);
        onClick?.(e);
      }}
      {...props}
    >
      <Icon name={ICON[theme]} size={size} />
    </button>
  );
}
