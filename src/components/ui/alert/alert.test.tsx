import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Alert } from './alert';

describe('Alert', () => {
  it('renders title and description', () => {
    render(
      <Alert variant="info" title="Heads up">
        Body text
      </Alert>,
    );
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('uses role="alert" for the error variant', () => {
    render(<Alert variant="error">Boom</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Boom');
  });

  it('uses role="status" for non-error variants', () => {
    render(<Alert variant="success">Saved</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('renders the icon by default', () => {
    const { container } = render(<Alert variant="info">Hi</Alert>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('hides the icon when icon={false}', () => {
    const { container } = render(
      <Alert variant="info" icon={false}>
        Hi
      </Alert>,
    );
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('does not render a close button when onClose is not provided', () => {
    render(<Alert variant="info">Hi</Alert>);
    expect(
      screen.queryByRole('button', { name: /dismiss/i }),
    ).not.toBeInTheDocument();
  });

  it('calls onClose when the dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Alert variant="info" onClose={onClose}>
        Hi
      </Alert>,
    );
    await user.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('applies the variant class', () => {
    const { container } = render(<Alert variant="warning">W</Alert>);
    expect(container.firstElementChild).toHaveClass('warning');
  });
});
