import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastProvider } from '@/components/providers/toast-provider';

import type { ContactState } from '../actions';
import { ContactForm } from './contact-form';

// Mock the server action so the component can be tested in isolation.
// useActionState passes (prevState, formData) and expects a Promise<ContactState>.
const submitMock =
  vi.fn<(prev: ContactState | null, fd: FormData) => Promise<ContactState>>();

vi.mock('../actions', () => ({
  submitContactAction: (prev: ContactState | null, fd: FormData) =>
    submitMock(prev, fd),
}));

const ERROR_MESSAGES = {
  nameMin: 'Name must be at least 2 characters',
  emailInvalid: 'Please enter a valid email address',
  messageMin: 'Message must be at least 10 characters',
};

function renderForm() {
  return render(
    <ToastProvider>
      <ContactForm errorMessages={ERROR_MESSAGES} />
    </ToastProvider>,
  );
}

describe('ContactForm', () => {
  beforeEach(() => {
    submitMock.mockReset();
  });

  it('renders three labeled fields and a submit button', () => {
    renderForm();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('surfaces server-side field errors returned by the action', async () => {
    submitMock.mockResolvedValueOnce({
      success: false,
      errors: { email: ['Please enter a valid email address'] },
    });

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.type(
      screen.getByLabelText('Message'),
      'A perfectly long enough message.',
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('Please enter a valid email address'),
    ).toBeInTheDocument();
    expect(submitMock).toHaveBeenCalledOnce();
  });

  it('clears the form and surfaces a success toast on a successful submit', async () => {
    submitMock.mockResolvedValueOnce({
      success: true,
      message: 'Thank you! Your message has been sent.',
    });

    const user = userEvent.setup();
    renderForm();

    const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const messageInput = screen.getByLabelText(
      'Message',
    ) as HTMLTextAreaElement;

    await user.type(nameInput, 'Jane');
    await user.type(emailInput, 'jane@example.com');
    await user.type(messageInput, 'Long enough message body.');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });
  });
});
