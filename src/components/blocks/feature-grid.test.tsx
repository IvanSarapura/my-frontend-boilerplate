import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeatureGrid } from './feature-grid';

const features = [
  { title: 'Fast', description: 'Ships in minutes.' },
  { title: 'Accessible', description: 'WCAG AA by default.' },
];

describe('FeatureGrid', () => {
  it('renders a heading and description per feature', () => {
    render(<FeatureGrid features={features} />);
    expect(screen.getByRole('heading', { name: 'Fast' })).toBeInTheDocument();
    expect(screen.getByText('Ships in minutes.')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Accessible' }),
    ).toBeInTheDocument();
  });

  it('renders an icon when provided', () => {
    render(
      <FeatureGrid
        features={[
          {
            title: 'Iconned',
            description: 'Has an icon.',
            icon: <svg data-testid="icon" aria-hidden="true" />,
          },
        ]}
      />,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies the default columns and merges className', () => {
    render(<FeatureGrid features={features} className="extra" />);
    const grid = screen.getByRole('heading', { name: 'Fast' }).closest('.grid');
    expect(grid).toHaveClass('grid', 'cols-3', 'extra');
  });
});
