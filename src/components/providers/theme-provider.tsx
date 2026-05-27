'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

export const THEME_STORAGE_KEY = 'theme';
const THEME_ATTRIBUTE = 'data-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';
const THEME_CHANGE_EVENT = 'theme:change';

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Fallback so theme changes survive when localStorage is blocked (private
// browsing). Updated by writeStoredTheme().
let memoryTheme: Theme = 'system';

// Lazy singleton: matchMedia returns a fresh object per call, but
// useSyncExternalStore reads snapshots repeatedly. `.matches` is a live getter,
// so reusing one MediaQueryList is correct and avoids re-instantiation.
let darkMql: MediaQueryList | null = null;
const getDarkMql = () => (darkMql ??= window.matchMedia(DARK_QUERY));

function readStoredTheme(): Theme {
  /* v8 ignore next -- SSR guard; window is always defined under jsdom */
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      memoryTheme = stored;
      return stored;
    }
  } catch {
    // Reading failed — fall back to the in-memory value below.
  }
  return memoryTheme;
}

function writeStoredTheme(theme: Theme) {
  memoryTheme = theme;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Persisting failed — memoryTheme still reflects the new value.
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function subscribeTheme(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function subscribeMedia(callback: () => void) {
  const media = getDarkMql();
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function getMediaSnapshot(): boolean {
  return getDarkMql().matches;
}

const SERVER_THEME: Theme = 'system';
const SERVER_SYSTEM_DARK = false;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore keeps SSR/CSR consistent: server renders the neutral
  // 'system' baseline, hydration switches to the real stored value.
  const theme = useSyncExternalStore(
    subscribeTheme,
    readStoredTheme,
    /* v8 ignore next -- SSR hydration baseline; not invoked under jsdom */
    () => SERVER_THEME,
  );

  const systemPrefersDark = useSyncExternalStore(
    subscribeMedia,
    getMediaSnapshot,
    /* v8 ignore next -- SSR hydration baseline; not invoked under jsdom */
    () => SERVER_SYSTEM_DARK,
  );

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;

  // Effect is the right place to mutate the DOM attribute.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute(THEME_ATTRIBUTE);
    } else {
      root.setAttribute(THEME_ATTRIBUTE, theme);
    }
  }, [theme]);

  const setTheme = useCallback((next: Theme) => writeStoredTheme(next), []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

// Test-only: reset module-scoped state between cases (theme fallback + cached
// MediaQueryList). Not exported from the barrel.
export function __resetThemeMemoryForTests() {
  memoryTheme = 'system';
  darkMql = null;
}
