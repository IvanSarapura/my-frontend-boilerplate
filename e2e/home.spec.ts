import { expect, test } from '@playwright/test';

test('root redirects to default locale /en', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en/);
});

test('/en homepage has heading', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Frontend Boilerplate',
  );
});

test('/es homepage has Spanish heading', async ({ page }) => {
  await page.goto('/es');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Boilerplate Frontend',
  );
});
