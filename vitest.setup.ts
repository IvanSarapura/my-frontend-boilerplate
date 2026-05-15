import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from './src/mocks/node';

// server-only throws in non-server environments; mock it so Server Component
// modules can be imported in jsdom tests without crashing.
vi.mock('server-only', () => ({}));

// jsdom does not implement matchMedia. Provide a no-op polyfill so hooks and
// components that read prefers-color-scheme (theme provider, useMediaQuery)
// work deterministically in tests. Tests can override per-case with vi.fn.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());
