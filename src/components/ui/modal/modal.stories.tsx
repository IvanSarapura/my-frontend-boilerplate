import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, screen, userEvent, within } from 'storybook/test';

import { Button } from '@/components/ui/button';

import { Modal } from './modal';
import { ModalBody } from './modal-body';
import { ModalFooter } from './modal-footer';
import { ModalHeader } from './modal-header';

const SCROLLABLE_BODY = Array.from(
  { length: 10 },
  (_, i) =>
    `Section ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. ` +
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ' +
    'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit ' +
    'in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
);

const meta = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    title: 'Confirm Action',
    children: 'Are you sure you want to proceed? This action cannot be undone.',
    onClose: () => {},
    footer: (
      <>
        <Button variant="secondary" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={() => {}}>Confirm</Button>
      </>
    ),
  },
};

export const Destructive: Story = {
  args: {
    open: true,
    title: 'Delete Item',
    children:
      'This will permanently delete the item and all associated data. This action cannot be undone.',
    onClose: () => {},
    footer: (
      <>
        <Button variant="secondary" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={() => {}}>Delete</Button>
      </>
    ),
  },
};

export const WithoutFooter: Story = {
  args: {
    open: true,
    title: 'Information',
    children:
      'This modal presents information only and requires no action from the user.',
    onClose: () => {},
  },
};

export const Scrollable: Story = {
  args: {
    open: true,
    title: 'Terms and Conditions',
    onClose: () => {},
    footer: (
      <>
        <Button variant="secondary" onClick={() => {}}>
          Decline
        </Button>
        <Button onClick={() => {}}>Accept</Button>
      </>
    ),
    children: (
      <>
        {SCROLLABLE_BODY.map((paragraph, i) => (
          <p key={i} style={{ marginBottom: '1rem' }}>
            {paragraph}
          </p>
        ))}
      </>
    ),
  },
};

/**
 * Compound API — same dialog assembled from ModalHeader/Body/Footer slots
 * instead of the `title` and `footer` shortcut props. Use this shape when
 * you need a non-trivial header (badge, icon, multi-line subtitle) or when
 * the footer layout diverges from the default right-aligned button row.
 */
export const Compound: Story = {
  args: {
    open: true,
    onClose: () => {},
    children: null,
  },
  render: () => (
    <Modal open onClose={() => {}}>
      <ModalHeader>
        <h2>Update available</h2>
      </ModalHeader>
      <ModalBody>
        A new version of the app is ready. Reloading applies the update and
        preserves your unsaved changes.
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={() => {}}>
          Later
        </Button>
        <Button onClick={() => {}}>Reload</Button>
      </ModalFooter>
    </Modal>
  ),
};

/**
 * Interactive story — Modal trigger pattern verified by a play function:
 * a Button opens the dialog, Escape closes it. Covers the a11y contract
 * (focus trap + keyboard dismiss + background `inert`) end-to-end in a real
 * browser, where `inert` is actually enforced (unlike jsdom).
 */
export const Interactive: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Open Modal</Button>
          <Modal
            open={open}
            title="Confirm action"
            onClose={() => setOpen(false)}
            footer={
              <>
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Confirm</Button>
              </>
            }
          >
            Press Escape or click Cancel to close.
          </Modal>
        </>
      );
    }
    return <Demo />;
  },
  args: {
    open: false,
    title: '',
    children: null,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Capture the trigger before opening: once the dialog is open the
    // background is inert and drops out of the accessibility tree, so a
    // role query would no longer find it.
    const trigger = canvas.getByRole('button', { name: 'Open Modal' });
    await userEvent.click(trigger);

    // Modal renders into a portal, so we query against the full document body.
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // A11Y-3: the background is inert while open — the trigger cannot take
    // focus (a real browser enforces this).
    trigger.focus();
    expect(trigger).not.toHaveFocus();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // ...and the background is interactive again once the dialog closes.
    trigger.focus();
    expect(trigger).toHaveFocus();
  },
};
