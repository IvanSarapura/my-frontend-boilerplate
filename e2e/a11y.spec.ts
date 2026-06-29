import { expect, type Page, test } from '@playwright/test';

import { gotoOk } from './helpers';
import { ROUTES } from './routes';

/**
 * Page-level accessibility invariants for the wireframe presets (WIREFRAME.md §9).
 *
 * Scope: *integration* a11y — one h1, no skipped heading levels, correct
 * landmarks, distinctly-labelled navs, reachable skip-link. Component-level a11y
 * (contrast, name/role/value of widgets) is covered by `@storybook/addon-a11y`
 * over the primitives these pages compose; static a11y by `eslint-plugin-jsx-a11y`.
 * Deliberately no axe page-scan dependency.
 *
 * The ARIA-snapshot block below pins the *shape* of each page's accessibility
 * tree (landmark order + heading skeleton) in one readable assertion, so a
 * semantic regression the point-checks above would miss still trips a test.
 * Snapshots stay structural: heading copy is matched with /.+/, only stable
 * landmark/nav names are pinned literally.
 */

/** Heading levels in document order (includes visually-hidden but DOM-present). */
async function headingLevels(page: Page): Promise<number[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h =>
      Number(h.tagName.slice(1)),
    ),
  );
}

const A11Y_PAGES = [
  ROUTES.home,
  ROUTES.examples,
  ROUTES.minimal,
  ROUTES.marketing,
  ROUTES.appShell,
] as const;

for (const path of A11Y_PAGES) {
  test.describe(path, () => {
    test('has exactly one h1 and a single main landmark', async ({ page }) => {
      await gotoOk(page, path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('main')).toHaveCount(1);
    });

    test('has no skipped heading levels', async ({ page }) => {
      await gotoOk(page, path);
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
      await gotoOk(page, path);
      // sr-only: present in the a11y tree but not visually rendered.
      await expect(
        page.getByRole('link', { name: /skip to main/i }),
      ).toBeAttached();
    });
  });
}

// These landmark blocks assert what the ARIA snapshots below cannot: exact
// counts (no duplicate landmarks) and visibility. Keep both — they are
// complementary, not redundant.
test.describe('marketing preset landmarks', () => {
  test('renders banner, main and contentinfo', async ({ page }) => {
    await gotoOk(page, ROUTES.marketing);
    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
  });
});

test.describe('app-shell preset landmarks', () => {
  test('renders banner, main and contentinfo', async ({ page }) => {
    await gotoOk(page, ROUTES.appShell);
    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
  });

  test('exposes a labelled sidebar navigation', async ({ page }) => {
    await gotoOk(page, ROUTES.appShell);
    // The sidebar is the primary nav; it must carry an accessible name.
    await expect(
      page.getByRole('navigation', { name: 'Account' }),
    ).toBeVisible();
  });
});

// Written out per-route (not looped): `--update-snapshots` only regenerates
// literal inline templates at each call site, so the assertions cannot be
// factored into a loop without breaking baseline tooling.
test.describe('accessibility tree (ARIA snapshots)', () => {
  test('/en matches its landmark/heading skeleton', async ({ page }) => {
    await gotoOk(page, ROUTES.home);
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - main:
        - heading /.+/ [level=1]
    `);
  });

  test('/en/examples matches its landmark/heading skeleton', async ({
    page,
  }) => {
    await gotoOk(page, ROUTES.examples);
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - main:
        - heading /.+/ [level=1]
        - link:
          - heading /.+/ [level=2]
        - link:
          - heading /.+/ [level=2]
        - link:
          - heading /.+/ [level=2]
        - link:
          - heading /.+/ [level=2]
    `);
  });

  test('/en/examples/minimal matches its landmark/heading skeleton', async ({
    page,
  }) => {
    await gotoOk(page, ROUTES.minimal);
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - main:
        - heading /.+/ [level=1]
        - heading /.+/ [level=2]
        - heading /.+/ [level=2]
    `);
  });

  test('/en/examples/marketing matches its landmark/heading skeleton', async ({
    page,
  }) => {
    await gotoOk(page, ROUTES.marketing);
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - banner:
        - navigation "Main navigation"
      - main:
        - heading /.+/ [level=1]
        - heading /.+/ [level=2]
        - heading /.+/ [level=3]
        - heading /.+/ [level=3]
        - heading /.+/ [level=3]
        - heading /.+/ [level=2]
      - contentinfo:
        - heading /.+/ [level=2]
        - heading /.+/ [level=2]
        - heading /.+/ [level=2]
    `);
  });

  test('/en/examples/app-shell matches its landmark/heading skeleton', async ({
    page,
  }) => {
    await gotoOk(page, ROUTES.appShell);
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - banner:
        - link "Acme"
      - complementary:
        - navigation "Account"
      - main:
        - heading /.+/ [level=1]
        - heading /.+/ [level=2]
        - heading /.+/ [level=2]
      - contentinfo
    `);
  });
});
