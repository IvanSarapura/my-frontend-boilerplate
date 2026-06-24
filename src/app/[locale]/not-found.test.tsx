import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import NotFound from './not-found';

// Mock next/headers — controlled per test via mockCookieValue.
let mockCookieValue: string | undefined;

vi.mock('next/headers', () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) =>
        name === 'NEXT_LOCALE' && mockCookieValue !== undefined
          ? { value: mockCookieValue }
          : undefined,
    }),
}));

describe('NotFound', () => {
  beforeEach(() => {
    mockCookieValue = undefined;
  });

  it('renders the localized 404 copy for the cookie locale (es)', async () => {
    mockCookieValue = 'es';
    render(await NotFound());
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Volver al inicio' }),
    ).toHaveAttribute('href', '/es');
  });

  it('falls back to the default locale when the cookie is absent (en)', async () => {
    render(await NotFound());
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/en',
    );
  });
});
