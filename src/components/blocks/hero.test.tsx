import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Hero } from './hero';

describe('Hero', () => {
  it('renders the title as a level-1 heading', () => {
    render(<Hero title="Build faster" />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Build faster' }),
    ).toBeInTheDocument();
  });

  it('renders eyebrow, subtitle and actions', () => {
    render(
      <Hero
        eyebrow="New"
        title="Build faster"
        subtitle="A solid starting point."
        actions={<button>Get started</button>}
      />,
    );
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('A solid starting point.')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Get started' }),
    ).toBeInTheDocument();
  });

  it('applies the center variant and merges className', () => {
    render(<Hero title="Centered" align="center" className="extra" />);
    const el = screen.getByText('Centered').parentElement;
    expect(el).toHaveClass('hero', 'center', 'extra');
  });

  it('does not center by default', () => {
    render(<Hero title="Left" />);
    expect(screen.getByText('Left').parentElement).not.toHaveClass('center');
  });
});
