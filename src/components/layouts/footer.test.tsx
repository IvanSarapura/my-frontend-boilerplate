import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Footer } from './footer';

const columns = [
  {
    heading: 'Product',
    links: [
      { href: '/en/features', label: 'Features' },
      { href: '/en/pricing', label: 'Pricing' },
    ],
  },
  {
    heading: 'Company',
    links: [{ href: '/en/about', label: 'About' }],
  },
];

describe('Footer', () => {
  it('renders a contentinfo landmark', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders brand and tagline', () => {
    render(<Footer brand="Acme" tagline="We build things." />);
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('We build things.')).toBeInTheDocument();
  });

  it('renders a heading and links per column', () => {
    render(<Footer columns={columns} />);
    expect(
      screen.getByRole('heading', { name: 'Product' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute(
      'href',
      '/en/features',
    );
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/en/about',
    );
  });

  it('renders the legal slot', () => {
    render(<Footer legal="© 2026 Acme" />);
    expect(screen.getByText('© 2026 Acme')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<Footer className="extra" />);
    expect(screen.getByRole('contentinfo')).toHaveClass('footer', 'extra');
  });

  it('renders without columns', () => {
    render(<Footer brand="Acme" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
