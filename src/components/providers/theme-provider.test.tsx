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
import { LEGACY_THEME_STORAGE_KEY } from './theme-storage-key';

type MatchMediaMock = ReturnType<typeof createMatchMediaMock>;

function createMatchMediaMock(initialMatches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const state = { matches: initialMatches };
  const matchMedia = vi.fn((query: string) => ({
    // Live getter mirrors the real MediaQueryList (its `matches` updates as the
    // media state changes), so a cached MediaQueryList still reflects emit().
    get matches() {
      return state.matches;
    },
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

  it('falls back to the legacy key so an existing preference survives (P3-02)', () => {
    window.localStorage.setItem(LEGACY_THEME_STORAGE_KEY, 'dark');
    installMatchMedia(createMatchMediaMock(false));
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
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

  it('only re-reads on storage events for its own key', () => {
    installMatchMedia(createMatchMediaMock(false));
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('system');

    // Another tab wrote the stored theme, but the storage event names an
    // unrelated key → ignore it (no re-read), so the theme stays 'system'.
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'unrelated' }));
    });
    expect(screen.getByTestId('theme')).toHaveTextContent('system');

    // A storage event for our own key syncs the value across tabs.
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: THEME_STORAGE_KEY }),
      );
    });
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
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
