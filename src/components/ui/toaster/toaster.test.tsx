import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  TOAST_DURATION_MS,
  ToastProvider,
  useToast,
} from '@/components/providers/toast-provider';
import es from '@/i18n/messages/es.json';

import { Toaster } from './toaster';

function TestHarness({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <Toaster />
    </ToastProvider>
  );
}

function TriggerButton({
  title,
  description,
  variant = 'default',
}: {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
}) {
  const { addToast } = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        addToast({
          title,
          variant,
          ...(description !== undefined ? { description } : {}),
        })
      }
    >
      Add Toast
    </button>
  );
}

describe('Toaster', () => {
  it('renders the notifications region', () => {
    render(
      <TestHarness>
        <></>
      </TestHarness>,
    );
    expect(
      screen.getByRole('region', { name: 'Notifications' }),
    ).toBeInTheDocument();
  });

  it('uses localized region and dismiss labels when provided', () => {
    render(
      <ToastProvider>
        <TriggerButton title="Hola" />
        <Toaster
          regionLabel={es.common.toastRegionLabel}
          dismissLabel={es.common.toastDismissLabel}
        />
      </ToastProvider>,
    );
    expect(
      screen.getByRole('region', { name: es.common.toastRegionLabel }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Add Toast' }));
    expect(
      screen.getByRole('button', { name: es.common.toastDismissLabel }),
    ).toBeInTheDocument();
  });

  it('renders no dismiss buttons by default', () => {
    render(
      <TestHarness>
        <></>
      </TestHarness>,
    );
    expect(
      screen.queryByRole('button', { name: 'Dismiss notification' }),
    ).not.toBeInTheDocument();
  });

  it('shows toast title when addToast is called', () => {
    render(
      <TestHarness>
        <TriggerButton title="Hello world" />
      </TestHarness>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Toast' }));
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('shows toast description when provided', () => {
    render(
      <TestHarness>
        <TriggerButton title="Alert" description="Please check your input" />
      </TestHarness>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Toast' }));
    expect(screen.getByText('Please check your input')).toBeInTheDocument();
  });

  it('dismiss button removes toast from DOM', () => {
    vi.useFakeTimers();
    render(
      <TestHarness>
        <TriggerButton title="Dismiss me" />
      </TestHarness>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Toast' }));
    expect(screen.getByText('Dismiss me')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Dismiss notification' }),
    );
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('applies the correct variant class for success toasts', () => {
    render(
      <TestHarness>
        <TriggerButton title="Done" variant="success" />
      </TestHarness>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Toast' }));
    expect(document.body.querySelector('.success')).toBeInTheDocument();
  });

  it('applies the correct variant class for error toasts', () => {
    render(
      <TestHarness>
        <TriggerButton title="Failed" variant="error" />
      </TestHarness>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Toast' }));
    expect(document.body.querySelector('.error')).toBeInTheDocument();
  });

  it('applies the correct variant class for warning toasts', () => {
    render(
      <TestHarness>
        <TriggerButton title="Warning" variant="warning" />
      </TestHarness>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Toast' }));
    expect(document.body.querySelector('.warning')).toBeInTheDocument();
  });

  it('exposes error toasts via an assertive alert role', () => {
    render(
      <TestHarness>
        <TriggerButton title="Boom" variant="error" />
      </TestHarness>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Toast' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Boom');
  });

  it('pauses the auto-dismiss timer while hovered and resumes on leave', () => {
    vi.useFakeTimers();
    render(
      <TestHarness>
        <TriggerButton title="Stay" />
      </TestHarness>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Toast' }));
    const toast = screen.getByText('Stay').closest('.toast') as HTMLElement;

    // mouseOver/mouseOut are what React translates into onMouseEnter/onMouseLeave.
    fireEvent.mouseOver(toast);
    act(() => {
      vi.advanceTimersByTime(TOAST_DURATION_MS * 3);
    });
    expect(screen.getByText('Stay')).toBeInTheDocument();

    fireEvent.mouseOut(toast, { relatedTarget: document.body });
    act(() => {
      vi.advanceTimersByTime(TOAST_DURATION_MS);
    });
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.queryByText('Stay')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('auto-removes toast after TOAST_DURATION_MS', () => {
    vi.useFakeTimers();
    render(
      <TestHarness>
        <TriggerButton title="Auto remove" />
      </TestHarness>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add Toast' }));
    expect(screen.getByText('Auto remove')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(TOAST_DURATION_MS);
    });
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.queryByText('Auto remove')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
