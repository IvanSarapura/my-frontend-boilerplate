import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="primary">P</Button>);
    expect(screen.getByRole('button')).toHaveClass('primary');

    rerender(<Button variant="secondary">S</Button>);
    expect(screen.getByRole('button')).toHaveClass('secondary');

    rerender(<Button variant="ghost">G</Button>);
    expect(screen.getByRole('button')).toHaveClass('ghost');
  });

  it('applies size classes', () => {
    const { rerender } = render(<Button size="sm">S</Button>);
    expect(screen.getByRole('button')).toHaveClass('sm');

    rerender(<Button size="lg">L</Button>);
    expect(screen.getByRole('button')).toHaveClass('lg');
  });

  it('defaults to type="button" so it never submits a form implicitly', () => {
    render(<Button>Open menu</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('respects an explicit type="submit"', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('forwards HTML button attributes', () => {
    render(
      <Button disabled aria-label="save">
        Save
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'save' });
    expect(btn).toBeDisabled();
  });

  it('merges custom className', () => {
    render(<Button className="custom">X</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });

  it('applies icon variant class', () => {
    render(
      <Button variant="icon" aria-label="back">
        <svg data-testid="child-icon" />
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'back' });
    expect(btn).toHaveClass('icon');
    expect(screen.getByTestId('child-icon')).toBeInTheDocument();
  });
});
