import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // `server-only` is supplied by Next.js at build time; standalone Vite
      // can't resolve it. Point it at an empty stub so server modules are
      // importable in jsdom tests. See src/mocks/server-only.ts.
      'server-only': path.resolve(__dirname, './src/mocks/server-only.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules', 'e2e/**'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    env: {
      NEXT_PUBLIC_APP_NAME: 'Test App',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    },
    coverage: {
      provider: 'v8',
      // css modules, stories, and mocks have no testable logic — skip them
      exclude: [
        '**/*.module.css',
        '**/*.stories.tsx',
        'src/mocks/**',
        '**/*.test.tsx',
        '**/*.spec.tsx',
        'e2e/**',
        'coverage/**',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
        // per-file: a green aggregate can hide files with 0% coverage
        perFile: true,
      },
    },
  },
});
