import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders a checkbox input', () => {
    render(<Checkbox aria-label="Accept" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor', () => {
    render(<Checkbox label="Terms" id="terms" />);
    expect(screen.getByLabelText('Terms')).toBeInTheDocument();
  });

  it('toggles checked state on click', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Newsletter" id="news" />);
    const input = screen.getByRole('checkbox');
    expect(input).not.toBeChecked();
    await user.click(input);
    expect(input).toBeChecked();
  });

  it('renders as checked when defaultChecked is set', () => {
    render(<Checkbox label="Agree" id="agree" defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('is not interactive when disabled', () => {
    render(<Checkbox label="Sync" id="sync" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('shows error message and sets aria-invalid', () => {
    render(<Checkbox label="Agree" id="agree" error="Required field" />);
    const input = screen.getByRole('checkbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'agree-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
  });

  it('shows helper text and links it via aria-describedby', () => {
    render(<Checkbox label="Remember" id="remember" helper="30 days" />);
    expect(screen.getByText('30 days')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-describedby',
      'remember-helper',
    );
  });

  it('hides helper when error is present', () => {
    render(
      <Checkbox
        label="Test"
        id="test"
        helper="Helpful text"
        error="Error text"
      />,
    );
    expect(screen.queryByText('Helpful text')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Error text');
  });

  it('uses name as fallback id when id is omitted', () => {
    render(<Checkbox label="Theme" name="theme" />);
    expect(screen.getByLabelText('Theme')).toHaveAttribute('id', 'theme');
  });

  it('forwards arbitrary HTML attributes to the underlying input', () => {
    render(<Checkbox label="Field" id="field" data-tracking="cb-field" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'data-tracking',
      'cb-field',
    );
  });
});
