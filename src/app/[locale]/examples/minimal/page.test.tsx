import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import MinimalPreset, { generateMetadata } from './page';

vi.mock('next/navigation', () => ({ notFound: vi.fn() }));

vi.mock('@/i18n/dictionaries', () => ({
  getDictionary: vi.fn().mockResolvedValue({
    home: {
      eyebrow: 'Production-ready',
      title: 'Build faster',
      subtitle: 'A solid starting point.',
      highlights: [
        { title: 'Developer experience', description: 'Tight feedback loop.' },
        { title: 'Production ready', description: 'Ship with confidence.' },
      ],
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

  it('renders a two-column highlights section below the hero', async () => {
    render(await MinimalPreset({ params: Promise.resolve({ locale: 'en' }) }));
    expect(
      screen.getByRole('heading', { level: 2, name: 'Developer experience' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Production ready' }),
    ).toBeInTheDocument();
  });

  it('generateMetadata returns the translated title and marks the page noindex', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    });
    expect(meta.title).toBe('Minimal');
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it('calls notFound for an unknown locale', async () => {
    const { notFound } = await import('next/navigation');
    await MinimalPreset({ params: Promise.resolve({ locale: 'fr' }) });
    expect(notFound).toHaveBeenCalled();
  });
});
