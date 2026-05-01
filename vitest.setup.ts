import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// server-only throws in non-server environments; mock it so Server Component
// modules can be imported in jsdom tests without crashing.
vi.mock('server-only', () => ({}));

afterEach(cleanup);
