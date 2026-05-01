import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from './src/mocks/node';

// server-only throws in non-server environments; mock it so Server Component
// modules can be imported in jsdom tests without crashing.
vi.mock('server-only', () => ({}));

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());
