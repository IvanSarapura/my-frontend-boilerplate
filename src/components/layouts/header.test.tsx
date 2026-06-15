import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Header } from './header';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

const links = [
  { href: '/en', label: 'Home' },
  { href: '/en/contact', label: 'Contact' },
];

describe('Header', () => {
  it('renders a banner landmark', () => {
    render(<Header brand="Acme" />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the brand slot', () => {
    render(<Header brand={<span>Acme</span>} />);
    expect(screen.getByText('Acme')).toBeInTheDocument();
  });

  it('renders a nav link per item', () => {
    render(<Header brand="Acme" links={links} />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/en',
    );
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/en/contact',
    );
  });

  it('renders the actions slot', () => {
    render(<Header brand="Acme" actions={<button>Sign in</button>} />);
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders the mobile menu toggle from MobileNav', () => {
    render(<Header brand="Acme" links={links} menuLabel="Open menu" />);
    expect(
      screen.getByRole('button', { name: 'Open menu' }),
    ).toBeInTheDocument();
  });

  it('applies the lg size class to the banner', () => {
    render(<Header brand="Acme" size="lg" />);
    expect(screen.getByRole('banner')).toHaveClass('header', 'lg');
  });

  it('forwards bareToggle to the hamburger button', () => {
    render(<Header brand="Acme" bareToggle menuLabel="Open menu" />);
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveClass(
      'bare',
    );
  });
});
