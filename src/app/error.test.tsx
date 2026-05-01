import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ErrorComponent from './error';

describe('Error boundary', () => {
  it('renders error message and reset button', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const error = new Error('Test error');
    const reset = vi.fn();
    render(<ErrorComponent error={error} reset={reset} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('An unexpected error occurred. Please try again later.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();
    vi.unstubAllEnvs();
  });

  it('calls reset when clicking the button', () => {
    const error = new Error('Test error');
    const reset = vi.fn();
    render(<ErrorComponent error={error} reset={reset} />);
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('logs error to console', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Log test');
    render(<ErrorComponent error={error} reset={vi.fn()} />);
    expect(consoleSpy).toHaveBeenCalledWith('[Error boundary]', error);
    consoleSpy.mockRestore();
  });
});
