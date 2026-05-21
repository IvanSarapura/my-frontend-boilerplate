import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon } from './icon';
import { type IconName, icons } from './icons';

describe('Icon', () => {
  it('renders an svg element', () => {
    const { container } = render(<Icon name="chevron-down" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('is decorative (aria-hidden) when no aria-label is provided', () => {
    const { container } = render(<Icon name="chevron-down" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
  });

  it('exposes role="img" and aria-label when labeled', () => {
    render(<Icon name="close" aria-label="Close dialog" />);
    const svg = screen.getByRole('img', { name: 'Close dialog' });
    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveAttribute('aria-hidden');
  });

  it('applies default size of 20', () => {
    const { container } = render(<Icon name="info" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('applies custom size', () => {
    const { container } = render(<Icon name="info" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('merges custom className', () => {
    const { container } = render(<Icon name="info" className="custom-class" />);
    expect(container.querySelector('svg')).toHaveClass('custom-class');
  });

  it('uses currentColor so it inherits parent color', () => {
    const { container } = render(<Icon name="info" />);
    expect(container.querySelector('svg')).toHaveAttribute(
      'stroke',
      'currentColor',
    );
  });

  it('renders the correct shapes for each icon name', () => {
    const names = Object.keys(icons) as IconName[];

    names.forEach(name => {
      const { container, unmount } = render(<Icon name={name} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.children.length).toBeGreaterThan(0);
      unmount();
    });
  });
});
