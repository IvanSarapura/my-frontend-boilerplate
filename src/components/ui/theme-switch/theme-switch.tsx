'use client';

import { useTheme } from '@/components/providers/theme-provider';
import { ToggleSwitch } from '@/components/ui/toggle-switch';

type ThemeSwitchSize = 'sm' | 'md' | 'lg';

interface ThemeSwitchProps {
  /** Visible label / accessible name for the switch. */
  label?: string;
  size?: ThemeSwitchSize;
  labelPosition?: 'left' | 'right';
  className?: string;
}

/**
 * Binary light/dark switch built on `ToggleSwitch`. Reflects the *effective*
 * theme (`system` resolves to light/dark) and, when toggled, sets an explicit
 * mode. For the tri-state cycle (incl. `system`) use `ThemeToggle` instead.
 */
export function ThemeSwitch({
  label = 'Dark mode',
  size = 'md',
  labelPosition = 'right',
  className,
}: ThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <ToggleSwitch
      label={label}
      size={size}
      labelPosition={labelPosition}
      className={className}
      checked={resolvedTheme === 'dark'}
      onChange={e => setTheme(e.target.checked ? 'dark' : 'light')}
    />
  );
}
