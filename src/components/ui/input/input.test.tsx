import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Input } from './input';

describe('Input', () => {
  it('renders label and input', () => {
    render(<Input label="Email" id="email" placeholder="you@example.com" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });

  it('displays helper text when no error', () => {
    render(<Input label="Username" helper="Must be unique" />);
    expect(screen.getByText('Must be unique')).toBeInTheDocument();
  });

  it('forwards HTML attributes', () => {
    render(<Input label="Name" id="name" disabled />);
    expect(screen.getByLabelText('Name')).toBeDisabled();
  });

  it('associates label with input via htmlFor', () => {
    render(<Input label="Password" name="password" type="password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'name',
      'password',
    );
  });
});
