import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label with correct htmlFor association', () => {
    render(<Textarea label="Bio" id="bio" />);
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
  });

  it('shows error message with role="alert"', () => {
    render(<Textarea label="Message" id="msg" error="Field is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Field is required');
  });

  it('sets aria-invalid="true" when error is present', () => {
    render(<Textarea label="Message" id="msg" error="Required" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('hides helper text when error is present', () => {
    render(
      <Textarea
        label="Field"
        id="field"
        error="Error shown"
        helper="Helper hidden"
      />,
    );
    expect(screen.queryByText('Helper hidden')).not.toBeInTheDocument();
  });

  it('shows helper text when no error', () => {
    render(<Textarea label="Username" id="username" helper="Must be unique" />);
    expect(screen.getByText('Must be unique')).toBeInTheDocument();
  });

  it('passes through the disabled prop', () => {
    render(<Textarea label="Disabled" id="disabled" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('forwards the name attribute to the textarea', () => {
    render(<Textarea label="Notes" name="notes" />);
    expect(screen.getByLabelText('Notes')).toHaveAttribute('name', 'notes');
  });

  it('gives each textarea sharing a name a unique id', () => {
    render(
      <>
        <Textarea label="One" name="dup" />
        <Textarea label="Two" name="dup" />
      </>,
    );
    const a = screen.getByLabelText('One');
    const b = screen.getByLabelText('Two');
    expect(a.id).toBeTruthy();
    expect(a.id).not.toBe(b.id);
  });

  it('aria-describedby points to error id when error is present', () => {
    render(<Textarea label="Field" id="field" error="Bad input" />);
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-describedby',
      'field-error',
    );
  });

  it('aria-describedby points to helper id when only helper is present', () => {
    render(<Textarea label="Field" id="field" helper="Hint text" />);
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-describedby',
      'field-helper',
    );
  });
});
