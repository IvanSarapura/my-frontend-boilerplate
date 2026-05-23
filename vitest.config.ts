import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import path from 'path';
import { defineConfig } from 'vitest/config';

const alias = {
  '@': path.resolve(__dirname, './src'),
  // `server-only` is supplied by Next.js at build time; standalone Vite
  // can't resolve it. Point it at an empty stub so server modules are
  // importable in jsdom tests. See src/mocks/server-only.ts.
  'server-only': path.resolve(__dirname, './src/mocks/server-only.ts'),
};

export default defineConfig({
  test: {
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
        // Runs every story as a test in a real browser. addon-vitest (>=10.3)
        // auto-applies the preview annotations and the addon-a11y checks, so
        // with `a11y.test: 'error'` in preview.ts, accessibility violations
        // fail this project — no manual setup file needed. Browser-dependent
        // and slower, so it is excluded from `npm test` (unit only) and runs
        // via `npm run test:storybook` / CI. See https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
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
