import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import LocalePage from './page';

vi.mock('./dictionaries', () => ({
  getDictionary: vi.fn().mockResolvedValue({
    home: { title: 'Frontend Boilerplate', subtitle: 'Next.js · TypeScript' },
    common: {},
    posts: {},
  }),
}));

describe('Locale home page', () => {
  it('renders the main heading with translated title', async () => {
    const jsx = await LocalePage({
      params: Promise.resolve({ locale: 'en' }),
    });
    render(jsx);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Frontend Boilerplate',
    );
  });

  it('renders the subtitle', async () => {
    const jsx = await LocalePage({
      params: Promise.resolve({ locale: 'en' }),
    });
    render(jsx);
    expect(screen.getByText('Next.js · TypeScript')).toBeInTheDocument();
  });
});
