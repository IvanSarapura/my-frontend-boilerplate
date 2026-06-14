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

  it('applies the default size when none is given', () => {
    render(<Container data-testid="c">X</Container>);
    expect(screen.getByTestId('c')).toHaveClass('container', 'default');
  });

  it.each(['prose', 'wide', 'bleed'] as const)(
    'applies the requested size: %s',
    size => {
      render(
        <Container size={size} data-testid="c">
          X
        </Container>,
      );
      expect(screen.getByTestId('c')).toHaveClass('container', size);
    },
  );

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
