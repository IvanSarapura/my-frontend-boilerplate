'use client';

import { useTheme } from '@/components/providers/theme-provider';
import { MoonIcon, SunIcon } from '@/components/ui/icon';
import { ToggleSwitch } from '@/components/ui/toggle-switch';

type ThemeSwitchSize = 'sm' | 'md' | 'lg';

interface ThemeSwitchProps {
  /** Visible label / accessible name for the switch. */
  label?: string;
  size?: ThemeSwitchSize;
  labelPosition?: 'left' | 'right';
  /** Show a sun/moon glyph inside the thumb (off by default → plain switch). */
  icons?: boolean;
  className?: string;
}

/**
 * Binary light/dark switch built on `ToggleSwitch`. Reflects the *effective*
 * theme (`system` resolves to light/dark) and, when toggled, sets an explicit
 * mode. By default it's a plain switch; set `icons` to show a sun (light) /
 * moon (dark) glyph in the thumb. For the tri-state cycle (incl. `system`) use
 * `ThemeToggle` instead.
 */
export function ThemeSwitch({
  label = 'Dark mode',
  size = 'md',
  labelPosition = 'right',
  icons = false,
  className,
}: ThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <ToggleSwitch
      label={label}
      size={size}
      labelPosition={labelPosition}
      className={className}
      checked={isDark}
      icon={icons ? isDark ? <MoonIcon /> : <SunIcon /> : undefined}
      onChange={e => setTheme(e.target.checked ? 'dark' : 'light')}
    />
  );
}
