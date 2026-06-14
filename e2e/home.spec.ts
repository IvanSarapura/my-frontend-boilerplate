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

test('the "Get started" CTA navigates to the examples gallery', async ({
  page,
}) => {
  await page.goto('/en');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/\/en\/examples$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
