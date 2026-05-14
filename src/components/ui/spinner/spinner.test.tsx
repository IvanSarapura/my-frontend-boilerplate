import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './spinner';

describe('Spinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has aria-hidden="true" always', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies md size by default', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveStyle({ width: '2rem', height: '2rem' });
  });

  it('applies sm size', () => {
    const { container } = render(<Spinner size="sm" />);
    expect(container.firstChild).toHaveStyle({ width: '1rem', height: '1rem' });
  });

  it('applies lg size', () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.firstChild).toHaveStyle({ width: '3rem', height: '3rem' });
  });

  it('forwards custom className', () => {
    const { container } = render(<Spinner className="my-class" />);
    expect(container.firstChild).toHaveClass('my-class');
  });
});
