import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { IconBase } from './icon-base';

describe('IconBase', () => {
  it('renders an svg element', () => {
    const { container } = render(
      <IconBase>
        <path d="M0 0h24v24H0z" />
      </IconBase>,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('is decorative (aria-hidden) when no aria-label is provided', () => {
    const { container } = render(
      <IconBase>
        <path d="M0 0" />
      </IconBase>,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
  });

  it('exposes role="img" and aria-label when labeled', () => {
    render(
      <IconBase aria-label="Close dialog">
        <path d="M0 0" />
      </IconBase>,
    );
    const svg = screen.getByRole('img', { name: 'Close dialog' });
    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveAttribute('aria-hidden');
  });

  it('applies default size of 20', () => {
    const { container } = render(
      <IconBase>
        <path d="M0 0" />
      </IconBase>,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('applies custom size', () => {
    const { container } = render(
      <IconBase size={32}>
        <path d="M0 0" />
      </IconBase>,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('merges custom className', () => {
    const { container } = render(
      <IconBase className="custom-class">
        <path d="M0 0" />
      </IconBase>,
    );
    expect(container.querySelector('svg')).toHaveClass('custom-class');
  });

  it('uses currentColor so it inherits parent color', () => {
    const { container } = render(
      <IconBase>
        <path d="M0 0" />
      </IconBase>,
    );
    expect(container.querySelector('svg')).toHaveAttribute(
      'stroke',
      'currentColor',
    );
  });
});
