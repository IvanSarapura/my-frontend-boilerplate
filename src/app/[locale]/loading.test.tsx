import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Loading from './loading';

describe('Loading', () => {
  it('renders loading spinner with accessible label', () => {
    render(<Loading />);
    // The wrapper region and the Spinner each expose role="status".
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
