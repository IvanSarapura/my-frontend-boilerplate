import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@/components/providers/theme-provider';

import AppShellPreset from './page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
  usePathname: vi.fn(() => '/en/examples/app-shell'),
}));

vi.mock('@/i18n/dictionaries', () => ({
  getDictionary: vi.fn().mockResolvedValue({
    nav: {
      label: 'Main navigation',
      home: 'Home',
      features: 'Features',
      pricing: 'Pricing',
      contact: 'Contact',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    examples: {
      appShellName: 'App shell',
      appShellDesc: 'A base for dashboards.',
    },
    features: {
      heading: 'Everything you need',
      items: [
        { title: 'Fast', description: 'a' },
        { title: 'Accessible', description: 'b' },
        { title: 'Zero deps', description: 'c' },
      ],
    },
    footer: { rights: 'All rights reserved.' },
  }),
}));

function renderPage(locale = 'en') {
  return AppShellPreset({ params: Promise.resolve({ locale }) }).then(jsx =>
    render(<ThemeProvider>{jsx}</ThemeProvider>),
  );
}

describe('App-shell preset page', () => {
  it('renders header, sidebar nav and main content', async () => {
    await renderPage();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'App shell' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'App shell',
    );
  });

  it('introduces the feature grid with an h2 (no heading-order gap)', async () => {
    await renderPage();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Everything you need' }),
    ).toBeInTheDocument();
  });

  it('marks the current sidebar link active', async () => {
    await renderPage();
    const active = screen
      .getAllByRole('link')
      .find(el => el.getAttribute('href') === '/en/examples/app-shell');
    expect(active).toHaveAttribute('aria-current', 'page');
  });
});
