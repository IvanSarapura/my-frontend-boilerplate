import { expect, type Page } from '@playwright/test';

/**
 * Navigate and fail loudly if the route does not resolve (e.g. a stale build
 * serving a 404), so content assertions never run against the wrong page.
 */
export async function gotoOk(page: Page, path: string): Promise<void> {
  const response = await page.goto(path);
  expect(response?.status(), `navigation to ${path}`).toBeLessThan(400);
}
