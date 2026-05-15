import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  __resetThemeMemoryForTests,
  THEME_STORAGE_KEY,
  ThemeProvider,
} from '@/components/providers/theme-provider';

import { ThemeToggle } from './theme-toggle';

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

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle data-testid="toggle" />
    </ThemeProvider>,
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    __resetThemeMemoryForTests();
    installMatchMedia(false);
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders a button with an accessible label describing the current theme', () => {
    renderToggle();
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Current theme'),
    );
    expect(btn).toHaveAttribute('title', expect.stringContaining('Switch to'));
  });

  it('cycles light → dark → system → light on consecutive clicks', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const user = userEvent.setup();
    renderToggle();
    const btn = screen.getByRole('button');

    expect(btn).toHaveAccessibleName(/light/i);

    await user.click(btn);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(btn).toHaveAccessibleName(/dark/i);

    await user.click(btn);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
    expect(btn).toHaveAccessibleName(/system/i);

    await user.click(btn);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(btn).toHaveAccessibleName(/light/i);
  });

  it('updates the document data-theme attribute when toggled', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const user = userEvent.setup();
    renderToggle();
    await user.click(screen.getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('forwards additional click handlers without breaking the cycle', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const handler = vi.fn();
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle onClick={handler} />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('respects the size prop on the inner icon', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle size={32} />
      </ThemeProvider>,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
  });
});
