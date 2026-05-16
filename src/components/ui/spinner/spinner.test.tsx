import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './spinner';

describe('Spinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has role="status" for accessibility', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('announces "Loading" by default', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAccessibleName('Loading');
  });

  it('announces a custom label', () => {
    render(<Spinner label="Saving changes" />);
    expect(screen.getByRole('status')).toHaveAccessibleName('Saving changes');
  });

  it('renders the SVG as aria-hidden', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies sm size class', () => {
    render(<Spinner size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('sm');
  });

  it('applies md size class by default', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveClass('md');
  });

  it('applies lg size class', () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('lg');
  });

  it('applies muted variant class', () => {
    render(<Spinner variant="muted" />);
    expect(screen.getByRole('status')).toHaveClass('muted');
  });

  it('applies white variant class', () => {
    render(<Spinner variant="white" />);
    expect(screen.getByRole('status')).toHaveClass('white');
  });

  it('does not add a variant class for default variant', () => {
    render(<Spinner variant="default" />);
    const el = screen.getByRole('status');
    expect(el).not.toHaveClass('default');
  });

  it('forwards custom className', () => {
    render(<Spinner className="my-class" />);
    expect(screen.getByRole('status')).toHaveClass('my-class');
  });
});
