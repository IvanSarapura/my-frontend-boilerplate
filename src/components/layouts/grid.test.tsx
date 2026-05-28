import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Grid } from './grid';

describe('Grid', () => {
  it('renders children', () => {
    render(<Grid>Content</Grid>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies the default columns and gap', () => {
    render(<Grid data-testid="g">X</Grid>);
    expect(screen.getByTestId('g')).toHaveClass('grid', 'cols-3', 'gap-4');
  });

  it('applies the requested columns', () => {
    render(
      <Grid cols={4} data-testid="g">
        X
      </Grid>,
    );
    expect(screen.getByTestId('g')).toHaveClass('cols-4');
  });

  it('merges custom className', () => {
    render(
      <Grid className="extra" data-testid="g">
        X
      </Grid>,
    );
    expect(screen.getByTestId('g')).toHaveClass('grid', 'extra');
  });

  it('forwards HTML div attributes', () => {
    render(<Grid role="list">X</Grid>);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});
