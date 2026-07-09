import {
  defineConfig,
  devices,
  type ReporterDescription,
} from '@playwright/test';

// Annotate failures inline on the PR diff (CI only).
const ciReporters: ReporterDescription[] = process.env.CI ? [['github']] : [];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: [
    ['list'],
    ...ciReporters,
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // Capture evidence only when a test fails; the HTML report embeds both.
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // E2E runs against a production server (CI serves the prebuilt artifact;
    // local builds first). A server already on the URL is reused locally.
    command: process.env.CI
      ? 'npm run start'
      : 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    // Allow the local production build to finish before the server is expected.
    timeout: 120_000,
    // Test-only env to fully configure the production-mode server (satisfies
    // the strict production validation in src/lib/env.ts, resolves metadataBase).
    env: {
      NEXT_PUBLIC_APP_NAME: 'My App',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000', // must match `url` above
      NEXT_PUBLIC_API_ORIGIN: 'https://jsonplaceholder.typicode.com',
    },
  },
});
