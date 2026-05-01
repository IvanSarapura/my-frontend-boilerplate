import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from './card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(
      <Card variant="interactive">Interactive</Card>,
    );
    expect(container.firstChild).toHaveClass('interactive');
  });

  it('forwards HTML attributes', () => {
    render(<Card data-testid="my-card">Content</Card>);
    expect(screen.getByTestId('my-card')).toBeInTheDocument();
  });
});
