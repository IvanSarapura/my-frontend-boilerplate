import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NotFound from './not-found';

describe('NotFound', () => {
  it('renders 404 message and link to home', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(
      screen.getByText('This page could not be found.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute(
      'href',
      '/',
    );
  });
});
