import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ButtonLink } from './button-link';

describe('ButtonLink', () => {
  it('renders an anchor pointing at the href', () => {
    render(<ButtonLink href="/examples">Get started</ButtonLink>);
    const link = screen.getByRole('link', { name: 'Get started' });
    expect(link).toHaveAttribute('href', '/examples');
  });

  it('looks like a button (variant + size classes)', () => {
    const { rerender } = render(
      <ButtonLink href="/a" variant="primary" size="md">
        A
      </ButtonLink>,
    );
    expect(screen.getByRole('link')).toHaveClass('button', 'primary', 'md');

    rerender(
      <ButtonLink href="/b" variant="secondary" size="lg">
        B
      </ButtonLink>,
    );
    expect(screen.getByRole('link')).toHaveClass('secondary', 'lg');
  });

  it('merges a custom className', () => {
    render(
      <ButtonLink href="/c" className="custom">
        C
      </ButtonLink>,
    );
    expect(screen.getByRole('link')).toHaveClass('custom');
  });
});
