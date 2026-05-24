import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import GlobalError from './global-error';

describe('GlobalError boundary', () => {
  it('renders the generic message and reset button in production', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('NODE_ENV', 'production');
    render(<GlobalError error={new Error('boom')} reset={vi.fn()} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('An unexpected error occurred. Please try again later.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();
    vi.unstubAllEnvs();
    consoleSpy.mockRestore();
  });

  it('calls reset when clicking the button', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const reset = vi.fn();
    render(<GlobalError error={new Error('boom')} reset={reset} />);
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });

  it('reports the error through the observability hook with boundary context', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('NODE_ENV', 'development');
    const error = Object.assign(new Error('Log test'), { digest: 'd-99' });
    render(<GlobalError error={error} reset={vi.fn()} />);
    expect(consoleSpy).toHaveBeenCalledWith('[observability]', {
      error,
      source: 'global-error-boundary',
      digest: 'd-99',
    });
    vi.unstubAllEnvs();
    consoleSpy.mockRestore();
  });

  it('shows the raw error message in development', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('NODE_ENV', 'development');
    render(
      <GlobalError error={new Error('Detailed dev message')} reset={vi.fn()} />,
    );
    expect(screen.getByText('Detailed dev message')).toBeInTheDocument();
    vi.unstubAllEnvs();
    consoleSpy.mockRestore();
  });
});
