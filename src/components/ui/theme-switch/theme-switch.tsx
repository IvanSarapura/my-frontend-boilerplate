'use client';

import { useTheme } from '@/components/providers/theme-provider';
import { MoonIcon, SunIcon } from '@/components/ui/icon';
import { ToggleSwitch } from '@/components/ui/toggle-switch';

type ThemeSwitchSize = 'sm' | 'md' | 'lg';

interface ThemeSwitchProps {
  /** Visible label / accessible name for the switch. */
  label?: string;
  size?: ThemeSwitchSize;
  /** `outlined` = transparent track + theme-adaptive ring/thumb (`--foreground`);
   * `outlined-max` is the same with a thicker 1.5px ring. */
  variant?: 'rounded' | 'outlined' | 'outlined-max';
  labelPosition?: 'left' | 'right';
  /** Show a sun/moon glyph inside the thumb (off by default → plain switch). */
  icons?: boolean;
  /** Hide the visible label, keeping it as the accessible name (`aria-label`).
   * For compact spots like a header bar. */
  hideLabel?: boolean;
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
  variant = 'rounded',
  labelPosition = 'right',
  icons = false,
  hideLabel = false,
  className,
}: ThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <ToggleSwitch
      variant={variant}
      size={size}
      labelPosition={labelPosition}
      className={className}
      checked={isDark}
      icon={icons ? isDark ? <MoonIcon /> : <SunIcon /> : undefined}
      onChange={e => setTheme(e.target.checked ? 'dark' : 'light')}
      // Hidden label stays the accessible name via aria-label (ToggleSwitch
      // forwards it to the input), matching the icon-only ThemeToggle pattern.
      {...(hideLabel ? { 'aria-label': label } : { label })}
    />
  );
}
