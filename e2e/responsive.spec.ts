import { expect, test } from '@playwright/test';

/**
 * Mobile-first invariants (RESPONSIVE.md §10.1). Across the canonical viewport
 * matrix, real pages must never scroll horizontally and their main heading must
 * stay visible. Nav-collapse assertions are intentionally omitted: MobileNav is
 * a library primitive and is not wired into the app shell yet.
 */
const VIEWPORTS = [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1024, height: 768 },
  { name: 'Desktop Wide', width: 1280, height: 800 },
] as const;

const PAGES = [
  '/en',
  '/en/contact',
  '/en/posts',
  '/en/examples/minimal',
  '/en/examples/marketing',
  '/en/examples/app-shell',
] as const;

for (const vp of VIEWPORTS) {
  test.describe(`${vp.name} (${vp.width}px)`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const path of PAGES) {
      test(`${path} renders without horizontal overflow`, async ({ page }) => {
        await page.goto(path);

        // Content is reachable and laid out.
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

        // The page never forces a sideways scroll.
        const overflows = await page.evaluate(() => {
          const el = document.documentElement;
          return el.scrollWidth > el.clientWidth;
        });
        expect(overflows).toBe(false);
      });
    }
  });
}
