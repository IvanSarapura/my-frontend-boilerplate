import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import path from 'path';
import { defineConfig } from 'vitest/config';

const alias = {
  '@': path.resolve(__dirname, './src'),
  // Vite can't resolve `server-only` (Next.js-only); alias to a stub so server
  // modules are importable in tests. See src/mocks/server-only.ts.
  'server-only': path.resolve(__dirname, './src/mocks/server-only.ts'),
};

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      // Files without testable logic.
      exclude: [
        '**/*.module.css',
        '**/*.stories.tsx',
        'src/mocks/**',
        '**/*.test.tsx',
        '**/*.spec.tsx',
        'e2e/**',
        'coverage/**',
        // Pure re-export barrels — no executable logic to cover.
        '**/index.ts',
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
    projects: [
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          exclude: ['node_modules', 'e2e/**'],
          css: { modules: { classNameStrategy: 'non-scoped' } },
          env: {
            NEXT_PUBLIC_APP_NAME: 'Test App',
            NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
          },
        },
      },
      {
        // Runs every story as a test in a real browser, applying the a11y
        // checks from preview.ts. Slower, so it's excluded from `npm test`
        // (unit only) and runs via `npm run test:storybook` / CI.
        plugins: [
          storybookTest({ configDir: path.join(__dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
