import { expect, test } from '@playwright/test';

test('contact form: happy path on /en submits and shows success toast', async ({
  page,
}) => {
  await page.goto('/en/contact');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contact');

  await page.getByLabel('Name').fill('Jane Doe');
  await page.getByLabel('Email').fill('jane@example.com');
  await page
    .getByLabel('Message')
    .fill('Long enough message body for validation.');

  await page.getByRole('button', { name: /^submit$/i }).click();

  // Success toast is announced via aria-live polite. Asserting the
  // user-facing message keeps the test tied to the contract, not internals.
  await expect(
    page.getByText('Thank you! Your message has been sent.'),
  ).toBeVisible();

  // Form is reset client-side after a successful Server Action.
  await expect(page.getByLabel('Name')).toHaveValue('');
  await expect(page.getByLabel('Email')).toHaveValue('');
  await expect(page.getByLabel('Message')).toHaveValue('');
});

test('contact form: client-side validation blocks an empty submit', async ({
  page,
}) => {
  await page.goto('/en/contact');

  await page.getByRole('button', { name: /^submit$/i }).click();

  // RHF + zodResolver displays these messages without round-tripping to the server.
  await expect(
    page.getByText('Name must be at least 2 characters'),
  ).toBeVisible();
  await expect(
    page.getByText('Please enter a valid email address'),
  ).toBeVisible();
  await expect(
    page.getByText('Message must be at least 10 characters'),
  ).toBeVisible();

  // The success toast must NOT appear — the action never reached the server.
  await expect(
    page.getByText('Thank you! Your message has been sent.'),
  ).toBeHidden();
});

test('contact form: validation errors render in Spanish on /es', async ({
  page,
}) => {
  await page.goto('/es/contact');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contacto');

  await page.getByLabel('Name').fill('Juan');
  await page.getByLabel('Email').fill('not-an-email');
  await page.getByLabel('Message').fill('Mensaje suficientemente largo.');

  await page.getByRole('button', { name: /^submit$/i }).click();

  // Confirms the Zod factory pattern wired through the locale cookie
  // produces translated error messages end-to-end.
  await expect(
    page.getByText('Por favor ingresa un correo electrónico válido'),
  ).toBeVisible();
});
