import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // E2E always runs against a production server — the industry standard: it
    // exercises what actually ships and has no dev-only HMR (whose teardown
    // logs a benign ECONNRESET). CI serves the prebuilt `.next` artifact;
    // locally we build first. A server already running on the URL is reused
    // (start `npm run build && npm start` once to iterate without rebuilding).
    command: process.env.CI
      ? 'npm run start'
      : 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    // Allow the local production build to finish before the server is expected.
    timeout: 120_000,
  },
});
