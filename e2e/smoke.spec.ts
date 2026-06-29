import { expect, test } from '@playwright/test';

import { ROUTES } from './routes';

test('health endpoint returns ok', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.status).toBe('ok');
  expect(typeof body.timestamp).toBe('string');
});

test('unknown locale returns 404', async ({ page }) => {
  const response = await page.goto('/fr');
  expect(response?.status()).toBe(404);
});

test('page has no accessibility violations on skip-link', async ({ page }) => {
  await page.goto(ROUTES.home);
  const skipLink = page.getByRole('link', { name: /skip to main/i });
  await expect(skipLink).toBeAttached();
});
