import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import MinimalPreset from './page';

vi.mock('next/navigation', () => ({ notFound: vi.fn() }));

vi.mock('@/i18n/dictionaries', () => ({
  getDictionary: vi.fn().mockResolvedValue({
    home: {
      eyebrow: 'Production-ready',
      title: 'Build faster',
      subtitle: 'A solid starting point.',
    },
    examples: { minimalName: 'Minimal' },
  }),
}));

describe('Minimal preset page', () => {
  it('renders a centered hero with the home copy and no CTAs', async () => {
    render(await MinimalPreset({ params: Promise.resolve({ locale: 'en' }) }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Build faster',
    );
    expect(screen.getByText('A solid starting point.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
