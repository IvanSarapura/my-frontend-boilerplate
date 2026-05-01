import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Container } from './container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Content</Container>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies container class', () => {
    render(<Container data-testid="c">X</Container>);
    expect(screen.getByTestId('c')).toHaveClass('container');
  });

  it('merges custom className', () => {
    render(
      <Container className="extra" data-testid="c">
        X
      </Container>,
    );
    const el = screen.getByTestId('c');
    expect(el).toHaveClass('container');
    expect(el).toHaveClass('extra');
  });

  it('forwards HTML div attributes', () => {
    render(
      <Container id="main" role="main">
        X
      </Container>,
    );
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
  });
});
