import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Stack } from './stack';

describe('Stack', () => {
  it('renders children', () => {
    render(<Stack>Content</Stack>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies the default gap', () => {
    render(<Stack data-testid="s">X</Stack>);
    expect(screen.getByTestId('s')).toHaveClass('stack', 'gap-4');
  });

  it('applies the requested gap', () => {
    render(
      <Stack gap={8} data-testid="s">
        X
      </Stack>,
    );
    expect(screen.getByTestId('s')).toHaveClass('gap-8');
  });

  it('merges custom className', () => {
    render(
      <Stack className="extra" data-testid="s">
        X
      </Stack>,
    );
    expect(screen.getByTestId('s')).toHaveClass('stack', 'extra');
  });

  it('forwards HTML div attributes', () => {
    render(<Stack role="list">X</Stack>);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});
