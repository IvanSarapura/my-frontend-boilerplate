import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  __resetThemeMemoryForTests,
  type Theme,
  THEME_STORAGE_KEY,
  ThemeProvider,
  useTheme,
} from './theme-provider';

type MatchMediaMock = ReturnType<typeof createMatchMediaMock>;

function createMatchMediaMock(initialMatches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const state = { matches: initialMatches };
  const matchMedia = vi.fn((query: string) => ({
    matches: state.matches,
    media: query,
    onchange: null,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
      listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
      listeners.delete(cb),
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }));
  return {
    matchMedia,
    emit(matches: boolean) {
      state.matches = matches;
      listeners.forEach(cb =>
        cb({ matches } as unknown as MediaQueryListEvent),
      );
    },
  };
}

function installMatchMedia(mock: MatchMediaMock) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: mock.matchMedia,
  });
}

function Probe() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>set-dark</button>
      <button onClick={() => setTheme('light')}>set-light</button>
      <button onClick={() => setTheme('system')}>set-system</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    __resetThemeMemoryForTests();
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    __resetThemeMemoryForTests();
  });

  it('defaults to system when no preference is stored', () => {
    installMatchMedia(createMatchMediaMock(false));
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('rehydrates from localStorage on mount', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    installMatchMedia(createMatchMediaMock(false));
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('persists theme changes to localStorage and applies data-theme', async () => {
    installMatchMedia(createMatchMediaMock(false));
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    await user.click(screen.getByText('set-dark'));
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');

    await user.click(screen.getByText('set-system'));
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('reflects system preference changes when theme is system', async () => {
    const mock = createMatchMediaMock(false);
    installMatchMedia(mock);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    act(() => mock.emit(true));
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('ignores corrupted localStorage values', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'octopus');
    installMatchMedia(createMatchMediaMock(true));
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('survives localStorage being unavailable', async () => {
    installMatchMedia(createMatchMediaMock(false));
    const getSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('blocked');
      });
    const setSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('blocked');
      });
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    await user.click(screen.getByText('set-light'));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    getSpy.mockRestore();
    setSpy.mockRestore();
  });

  it('useTheme throws when called outside ThemeProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    function Bare() {
      useTheme();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(
      'useTheme must be used within ThemeProvider',
    );
    spy.mockRestore();
  });

  it('accepts the full Theme union exhaustively', () => {
    const values: Theme[] = ['light', 'dark', 'system'];
    expect(values).toHaveLength(3);
  });
});
