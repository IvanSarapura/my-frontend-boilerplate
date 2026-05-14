import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ToastProvider, useToast } from './toast-provider';

function ConsumesContext() {
  const { toasts } = useToast();
  return <div data-testid="count">{toasts.length}</div>;
}

describe('ToastProvider', () => {
  it('provides context to children — toasts starts empty', () => {
    render(
      <ToastProvider>
        <ConsumesContext />
      </ToastProvider>,
    );
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('useToast throws when called outside ToastProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<ConsumesContext />)).toThrow(
      'useToast must be used within ToastProvider',
    );
    spy.mockRestore();
  });
});
