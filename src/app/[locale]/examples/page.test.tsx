import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ExamplesPage, { generateMetadata } from './page';

vi.mock('next/navigation', () => ({ notFound: vi.fn() }));

vi.mock('@/i18n/dictionaries', () => ({
  getDictionary: vi.fn().mockResolvedValue({
    examples: {
      title: 'Wireframe presets',
      intro: 'Pick one.',
      view: 'View preset',
      minimalName: 'Minimal',
      minimalDesc: 'Centered hero.',
      marketingName: 'Marketing',
      marketingDesc: 'Full landing.',
      portfolioName: 'Portfolio',
      portfolioDesc: 'Marketing layout, bare menu.',
      appShellName: 'App shell',
      appShellDesc: 'Dashboard base.',
    },
  }),
}));

describe('Examples index page', () => {
  it('renders the heading and a link per preset', async () => {
    render(await ExamplesPage({ params: Promise.resolve({ locale: 'en' }) }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Wireframe presets',
    );
    expect(screen.getByRole('link', { name: /Minimal/ })).toHaveAttribute(
      'href',
      '/en/examples/minimal',
    );
    expect(screen.getByRole('link', { name: /Portfolio/ })).toHaveAttribute(
      'href',
      '/en/examples/portfolio',
    );
    expect(screen.getByRole('link', { name: /App shell/ })).toHaveAttribute(
      'href',
      '/en/examples/app-shell',
    );
  });

  it('calls notFound for an unknown locale', async () => {
    const { notFound } = await import('next/navigation');
    await ExamplesPage({ params: Promise.resolve({ locale: 'fr' }) });
    expect(notFound).toHaveBeenCalled();
  });

  it('generateMetadata returns the translated title and marks the page noindex', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    });
    expect(meta.title).toBe('Wireframe presets');
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
