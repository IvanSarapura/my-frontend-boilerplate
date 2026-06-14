import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NavLink } from './nav-link';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

describe('NavLink', () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue('/');
  });

  it('renders a link with its text and href', () => {
    render(<NavLink href="/en/contact">Contact</NavLink>);
    const link = screen.getByRole('link', { name: 'Contact' });
    expect(link).toHaveAttribute('href', '/en/contact');
  });

  it('marks the link active when the pathname matches exactly', () => {
    vi.mocked(usePathname).mockReturnValue('/en/contact');
    render(<NavLink href="/en/contact">Contact</NavLink>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('active');
  });

  it('is not active when the pathname differs', () => {
    vi.mocked(usePathname).mockReturnValue('/en/posts');
    render(<NavLink href="/en/contact">Contact</NavLink>);
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('aria-current');
    expect(link).not.toHaveClass('active');
  });

  it('does not treat a nested route as active (exact match only)', () => {
    vi.mocked(usePathname).mockReturnValue('/en/posts/1');
    render(<NavLink href="/en/posts">Posts</NavLink>);
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
  });

  it('merges custom className', () => {
    render(
      <NavLink href="/en" className="extra">
        Home
      </NavLink>,
    );
    expect(screen.getByRole('link')).toHaveClass('link', 'extra');
  });

  it('forwards anchor attributes', () => {
    render(
      <NavLink href="/en" data-testid="n" rel="nofollow">
        Home
      </NavLink>,
    );
    expect(screen.getByTestId('n')).toHaveAttribute('rel', 'nofollow');
  });
});
