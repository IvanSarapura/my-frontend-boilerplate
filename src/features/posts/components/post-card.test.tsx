import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PostCard } from './post-card';

describe('PostCard', () => {
  it('renders title and body', () => {
    render(<PostCard title="Hello World" body="This is a post." />);
    expect(
      screen.getByRole('heading', { name: 'Hello World' }),
    ).toBeInTheDocument();
    expect(screen.getByText('This is a post.')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<PostCard title="T" body="B" className="custom" />);
    expect(screen.getByRole('article')).toHaveClass('custom');
  });

  it('does not render a link wrapper when href is omitted', () => {
    render(<PostCard title="T" body="B" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('wraps the article in a link when href is provided', () => {
    render(<PostCard title="T" body="B" href="/en/posts/1" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/en/posts/1');
    expect(link.querySelector('article')).not.toBeNull();
  });
});
