import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@/components/providers/theme-provider';

import MarketingPreset from './page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
  usePathname: vi.fn(() => '/en/examples/marketing'),
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
    hero: {
      eyebrow: 'New',
      title: 'Build your next idea',
      subtitle: 'A solid starting point.',
      ctaPrimary: 'Get started',
      ctaSecondary: 'Learn more',
    },
    features: {
      heading: 'Everything you need',
      items: [
        { title: 'Fast', description: 'a' },
        { title: 'Accessible', description: 'b' },
        { title: 'Zero deps', description: 'c' },
      ],
    },
    cta: { title: 'Ready?', subtitle: 'Ship now.', button: 'Start now' },
    footer: {
      tagline: 'A boilerplate.',
      product: 'Product',
      company: 'Company',
      legal: 'Legal',
      privacy: 'Privacy',
      terms: 'Terms',
      rights: 'All rights reserved.',
    },
  }),
}));

function renderPage(locale = 'en') {
  return MarketingPreset({ params: Promise.resolve({ locale }) }).then(jsx =>
    render(<ThemeProvider>{jsx}</ThemeProvider>),
  );
}

describe('Marketing preset page', () => {
  it('renders the header, hero and footer landmarks', async () => {
    await renderPage();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Build your next idea',
    );
  });

  it('renders the feature cards', async () => {
    await renderPage();
    expect(
      screen.getByRole('heading', { name: 'Everything you need' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Fast' })).toBeInTheDocument();
  });
});
