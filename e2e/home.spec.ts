import { expect, test } from '@playwright/test';

test('homepage has title and heading', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Test App|My App/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Frontend Boilerplate',
  );
});
