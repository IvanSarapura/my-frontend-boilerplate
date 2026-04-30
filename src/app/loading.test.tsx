import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Loading from './loading';

describe('Loading', () => {
  it('renders loading spinner with accessible label', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
