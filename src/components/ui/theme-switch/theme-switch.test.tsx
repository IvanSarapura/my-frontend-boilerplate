import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  __resetThemeMemoryForTests,
  THEME_STORAGE_KEY,
  ThemeProvider,
} from '@/components/providers/theme-provider';

import { ThemeSwitch } from './theme-switch';

function installMatchMedia(initialMatches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: initialMatches,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    })),
  });
}

function renderSwitch(label?: string) {
  return render(
    <ThemeProvider>
      <ThemeSwitch {...(label !== undefined && { label })} />
    </ThemeProvider>,
  );
}

describe('ThemeSwitch', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    __resetThemeMemoryForTests();
    installMatchMedia(false);
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders a checkbox with the "Dark mode" accessible name', () => {
    renderSwitch();
    expect(
      screen.getByRole('checkbox', { name: 'Dark mode' }),
    ).toBeInTheDocument();
  });

  it('reflects the stored theme as the checked state', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    renderSwitch();
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('is unchecked in light mode', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    renderSwitch();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('resolves system to the OS preference (dark)', () => {
    installMatchMedia(true);
    window.localStorage.setItem(THEME_STORAGE_KEY, 'system');
    renderSwitch();
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('sets an explicit theme and data-theme attribute when toggled', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const user = userEvent.setup();
    renderSwitch();
    const input = screen.getByRole('checkbox');

    await user.click(input);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(input).toBeChecked();

    await user.click(input);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(input).not.toBeChecked();
  });

  it('supports a custom label', () => {
    renderSwitch('Tema oscuro');
    expect(
      screen.getByRole('checkbox', { name: 'Tema oscuro' }),
    ).toBeInTheDocument();
  });
});
