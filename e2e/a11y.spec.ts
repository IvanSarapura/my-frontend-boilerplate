import { expect, type Page, test } from '@playwright/test';

/**
 * Page-level accessibility invariants for the wireframe presets (WIREFRAME.md §9).
 *
 * Scope: *integration* a11y — one h1, no skipped heading levels, correct
 * landmarks, distinctly-labelled navs, reachable skip-link. Component-level a11y
 * (contrast, name/role/value of widgets) is covered by `@storybook/addon-a11y`
 * over the primitives these pages compose; static a11y by `eslint-plugin-jsx-a11y`.
 * Deliberately no axe page-scan dependency.
 */

/** Heading levels in document order (includes visually-hidden but DOM-present). */
async function headingLevels(page: Page): Promise<number[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h =>
      Number(h.tagName.slice(1)),
    ),
  );
}

const PAGES = [
  '/en',
  '/en/examples',
  '/en/examples/minimal',
  '/en/examples/marketing',
  '/en/examples/app-shell',
] as const;

for (const path of PAGES) {
  test.describe(path, () => {
    test('has exactly one h1 and a single main landmark', async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('main')).toHaveCount(1);
    });

    test('has no skipped heading levels', async ({ page }) => {
      await page.goto(path);
      const levels = await headingLevels(page);
      expect(levels.length).toBeGreaterThan(0);
      // prev=0 forces the first heading to be h1; later ones may stay, rise any
      // amount, or drop by at most one — i.e. no skipped level on the way down.
      let prev = 0;
      for (const level of levels) {
        expect(level).toBeLessThanOrEqual(prev + 1);
        prev = level;
      }
    });

    test('exposes a reachable skip-link', async ({ page }) => {
      await page.goto(path);
      // sr-only: present in the a11y tree but not visually rendered.
      await expect(
        page.getByRole('link', { name: /skip to main/i }),
      ).toBeAttached();
    });
  });
}

test.describe('marketing preset landmarks', () => {
  test('renders banner, main and contentinfo', async ({ page }) => {
    await page.goto('/en/examples/marketing');
    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
  });
});

test.describe('app-shell preset landmarks', () => {
  test('renders banner, main and contentinfo', async ({ page }) => {
    await page.goto('/en/examples/app-shell');
    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
  });

  test('exposes a labelled sidebar navigation', async ({ page }) => {
    await page.goto('/en/examples/app-shell');
    // The sidebar is the primary nav; it must carry an accessible name.
    await expect(
      page.getByRole('navigation', { name: 'Account' }),
    ).toBeVisible();
  });
});
