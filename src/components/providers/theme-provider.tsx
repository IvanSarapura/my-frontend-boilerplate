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

// Module-scoped fallback so theme changes survive when localStorage is blocked
// (private browsing, strict cookie policies). It also avoids returning a fresh
// 'system' from getSnapshot when storage is unreadable, which would mask a
// just-applied in-memory change. Updated by writeStoredTheme().
let memoryTheme: Theme = 'system';

function readStoredTheme(): Theme {
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
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function getMediaSnapshot(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

const SERVER_THEME: Theme = 'system';
const SERVER_SYSTEM_DARK = false;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore keeps SSR and CSR consistent (server snapshot is the
  // neutral 'system' baseline; after hydration we switch to the real stored
  // value with no setState-in-effect anti-patterns).
  const theme = useSyncExternalStore(
    subscribeTheme,
    readStoredTheme,
    () => SERVER_THEME,
  );

  const systemPrefersDark = useSyncExternalStore(
    subscribeMedia,
    getMediaSnapshot,
    () => SERVER_SYSTEM_DARK,
  );

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;

  // Effect = the valid place to mutate the external DOM (document attribute).
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

// Test-only: reset the module-scoped fallback between cases so order of tests
// does not leak preferences. Not exported from the package barrel.
export function __resetThemeMemoryForTests() {
  memoryTheme = 'system';
}
