import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders a decorative element with aria-hidden', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstElementChild;
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the rect variant by default', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toHaveClass('rect');
  });

  it('applies the text variant', () => {
    const { container } = render(<Skeleton variant="text" />);
    expect(container.firstElementChild).toHaveClass('text');
  });

  it('applies the circle variant', () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(container.firstElementChild).toHaveClass('circle');
  });

  it('applies numeric width and height as inline styles', () => {
    const { container } = render(<Skeleton width={100} height={20} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe('100px');
    expect(el.style.height).toBe('20px');
  });

  it('applies string width and height as inline styles', () => {
    const { container } = render(<Skeleton width="50%" height="2rem" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe('50%');
    expect(el.style.height).toBe('2rem');
  });

  it('merges custom className', () => {
    const { container } = render(<Skeleton className="custom" />);
    expect(container.firstElementChild).toHaveClass('custom');
  });

  it('forwards custom inline style', () => {
    const { container } = render(<Skeleton style={{ opacity: 0.5 }} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.opacity).toBe('0.5');
  });
});
