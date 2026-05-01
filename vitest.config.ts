import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
      // CSS Modules contain no executable JavaScript logic; including them
      // artificially dilutes coverage metrics. Stories, mocks, and test files
      // are also excluded as they are not production code.
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
        // Enforce per file so a single well-covered file cannot mask
        // another with 0% coverage.
        perFile: true,
      },
    },
  },
});
