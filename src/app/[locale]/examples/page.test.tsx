import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ExamplesPage from './page';

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
});
