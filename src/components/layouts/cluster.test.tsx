import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Cluster } from './cluster';

describe('Cluster', () => {
  it('renders children', () => {
    render(<Cluster>Content</Cluster>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies the default gap', () => {
    render(<Cluster data-testid="c">X</Cluster>);
    expect(screen.getByTestId('c')).toHaveClass('cluster', 'gap-4');
  });

  it('applies the requested gap', () => {
    render(
      <Cluster gap={2} data-testid="c">
        X
      </Cluster>,
    );
    expect(screen.getByTestId('c')).toHaveClass('gap-2');
  });

  it('merges custom className', () => {
    render(
      <Cluster className="extra" data-testid="c">
        X
      </Cluster>,
    );
    expect(screen.getByTestId('c')).toHaveClass('cluster', 'extra');
  });

  it('forwards HTML div attributes', () => {
    render(<Cluster role="toolbar">X</Cluster>);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });
});
