import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './modal';
import { ModalBody } from './modal-body';
import { ModalFooter } from './modal-footer';
import { ModalHeader } from './modal-header';

describe('Modal', () => {
  it('uses the default close-button label and allows overriding it', () => {
    const { rerender } = render(
      <Modal open title="T" onClose={vi.fn()}>
        body
      </Modal>,
    );
    expect(
      screen.getByRole('button', { name: 'Close dialog' }),
    ).toBeInTheDocument();

    rerender(
      <Modal open title="T" onClose={vi.fn()} closeLabel="Cerrar diálogo">
        body
      </Modal>,
    );
    expect(
      screen.getByRole('button', { name: 'Cerrar diálogo' }),
    ).toBeInTheDocument();
  });

  it('renders when open', () => {
    render(
      <Modal open title="Test Modal" onClose={vi.fn()}>
        Modal content
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal open={false} title="Hidden" onClose={vi.fn()}>
        Content
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal open title="T" onClose={onClose}>
        C
      </Modal>,
    );
    const overlay = screen.getByRole('dialog');
    await userEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal open title="T" onClose={onClose}>
        C
      </Modal>,
    );
    await userEvent.click(screen.getByLabelText('Close dialog'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape key', () => {
    const onClose = vi.fn();
    render(
      <Modal open title="T" onClose={onClose}>
        C
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal open title="T" onClose={onClose}>
        C
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders focusable elements inside the dialog', () => {
    const onClose = vi.fn();
    render(
      <Modal open title="T" onClose={onClose}>
        <button type="button">Action</button>
      </Modal>,
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Modal
        open
        title="T"
        onClose={vi.fn()}
        footer={<button type="button">Save</button>}
      >
        Content
      </Modal>,
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('wraps Tab forward: from last focusable element back to first', () => {
    render(
      <Modal open title="T" onClose={vi.fn()}>
        <button type="button">Inner</button>
      </Modal>,
    );
    // Focusable order: "Close dialog" (index 0), "Inner" (index 1)
    screen.getByRole('button', { name: 'Inner' }).focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
    expect(document.activeElement).toBe(screen.getByLabelText('Close dialog'));
  });

  it('wraps Shift+Tab backward: from first focusable element to last', () => {
    render(
      <Modal open title="T" onClose={vi.fn()}>
        <button type="button">Inner</button>
      </Modal>,
    );
    screen.getByLabelText('Close dialog').focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Inner' }),
    );
  });

  it('does not trap Tab when focus is not on the last element', () => {
    render(
      <Modal open title="T" onClose={vi.fn()}>
        <button type="button">Inner</button>
      </Modal>,
    );
    // "Close dialog" is the first focusable, not the last → Tab should not wrap.
    const close = screen.getByLabelText('Close dialog');
    close.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
    expect(document.activeElement).toBe(close);
  });

  it('restores focus to the previously focused element on close', () => {
    const { rerender } = render(
      <>
        <button type="button">Opener</button>
        <Modal open={false} title="T" onClose={vi.fn()}>
          C
        </Modal>
      </>,
    );
    const opener = screen.getByRole('button', { name: 'Opener' });
    opener.focus();
    expect(document.activeElement).toBe(opener);

    rerender(
      <>
        <button type="button">Opener</button>
        <Modal open title="T" onClose={vi.fn()}>
          C
        </Modal>
      </>,
    );
    rerender(
      <>
        <button type="button">Opener</button>
        <Modal open={false} title="T" onClose={vi.fn()}>
          C
        </Modal>
      </>,
    );
    expect(document.activeElement).toBe(opener);
  });

  describe('compound API', () => {
    it('renders ModalHeader/Body/Footer composition when title is omitted', () => {
      render(
        <Modal open onClose={vi.fn()}>
          <ModalHeader>
            <h2>Composed Title</h2>
          </ModalHeader>
          <ModalBody>Composed body content</ModalBody>
          <ModalFooter>
            <button type="button">Action</button>
          </ModalFooter>
        </Modal>,
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Composed Title')).toBeInTheDocument();
      expect(screen.getByText('Composed body content')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Action' }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });

    it('wires aria-labelledby to the ModalHeader wrapper in compound mode', () => {
      render(
        <Modal open onClose={vi.fn()}>
          <ModalHeader>Accessible Name</ModalHeader>
          <ModalBody>Body</ModalBody>
        </Modal>,
      );
      const dialog = screen.getByRole('dialog');
      const labelledBy = dialog.getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();
      const header = document.getElementById(labelledBy!);
      expect(header).not.toBeNull();
      expect(header).toHaveTextContent('Accessible Name');
    });

    it('throws if ModalHeader is rendered outside <Modal>', () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      expect(() => render(<ModalHeader>orphan</ModalHeader>)).toThrow(
        /must be rendered inside <Modal>/,
      );
      consoleError.mockRestore();
    });
  });
});
