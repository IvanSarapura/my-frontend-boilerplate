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
});
