import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Badge variant="success">S</Badge>);
    expect(screen.getByText('S')).toHaveClass('success');

    rerender(<Badge variant="error">E</Badge>);
    expect(screen.getByText('E')).toHaveClass('error');
  });

  it('merges custom className', () => {
    render(<Badge className="custom">X</Badge>);
    expect(screen.getByText('X')).toHaveClass('custom');
  });
});
