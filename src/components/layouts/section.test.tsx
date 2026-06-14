import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Section } from './section';

describe('Section', () => {
  it('renders children', () => {
    render(<Section>Content</Section>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders a semantic <section> element', () => {
    render(<Section data-testid="s">X</Section>);
    expect(screen.getByTestId('s').tagName).toBe('SECTION');
  });

  it('applies the section class', () => {
    render(<Section data-testid="s">X</Section>);
    expect(screen.getByTestId('s')).toHaveClass('section');
  });

  it('applies the muted surface when requested', () => {
    render(
      <Section surface="muted" data-testid="s">
        X
      </Section>,
    );
    expect(screen.getByTestId('s')).toHaveClass('section', 'muted');
  });

  it('does not apply a surface class by default', () => {
    render(<Section data-testid="s">X</Section>);
    expect(screen.getByTestId('s')).not.toHaveClass('muted');
  });

  it('merges custom className', () => {
    render(
      <Section className="extra" data-testid="s">
        X
      </Section>,
    );
    expect(screen.getByTestId('s')).toHaveClass('section', 'extra');
  });

  it('exposes a region role when given an accessible name', () => {
    render(<Section aria-label="Features">X</Section>);
    expect(
      screen.getByRole('region', { name: 'Features' }),
    ).toBeInTheDocument();
  });
});
