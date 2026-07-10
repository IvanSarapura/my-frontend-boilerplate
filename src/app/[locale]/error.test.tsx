import { fireEvent, render, screen } from '@testing-library/react';
import { useParams } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorComponent from './error';

vi.mock('next/navigation', () => ({
  useParams: vi.fn(() => ({ locale: 'en' })),
}));

describe('Error boundary', () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ locale: 'en' });
  });
  it('renders error message and reset button', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
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
    consoleSpy.mockRestore();
  });

  it('calls reset when clicking the button', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');
    const reset = vi.fn();
    render(<ErrorComponent error={error} reset={reset} />);
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });

  it('reports error through the observability hook with boundary context', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('NODE_ENV', 'development');
    const error = Object.assign(new Error('Log test'), { digest: 'd-42' });
    render(<ErrorComponent error={error} reset={vi.fn()} />);
    expect(consoleSpy).toHaveBeenCalledWith('[observability]', {
      error,
      source: 'locale-error-boundary',
      digest: 'd-42',
    });
    vi.unstubAllEnvs();
    consoleSpy.mockRestore();
  });

  it('renders localized strings for the es locale', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('NODE_ENV', 'production');
    vi.mocked(useParams).mockReturnValue({ locale: 'es' });
    render(<ErrorComponent error={new Error('Test error')} reset={vi.fn()} />);
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Intentar de nuevo' }),
    ).toBeInTheDocument();
    vi.unstubAllEnvs();
    consoleSpy.mockRestore();
  });

  it('falls back to English for an unknown locale', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('NODE_ENV', 'production');
    vi.mocked(useParams).mockReturnValue({ locale: 'xx' });
    render(<ErrorComponent error={new Error('Test error')} reset={vi.fn()} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    vi.unstubAllEnvs();
    consoleSpy.mockRestore();
  });

  it('shows raw error message in development', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('NODE_ENV', 'development');
    const error = new Error('Detailed dev message');
    render(<ErrorComponent error={error} reset={vi.fn()} />);
    expect(screen.getByText('Detailed dev message')).toBeInTheDocument();
    vi.unstubAllEnvs();
    consoleSpy.mockRestore();
  });
});
