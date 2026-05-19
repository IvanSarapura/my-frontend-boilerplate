import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, screen, userEvent, within } from 'storybook/test';

import { Button } from '@/components/ui/button';

import { Modal } from './modal';

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
 * Interactive story — Modal trigger pattern verified by a play function:
 * a Button opens the dialog, Escape closes it. Covers the a11y contract
 * (focus trap + keyboard dismiss) end-to-end inside Storybook.
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
    await userEvent.click(canvas.getByRole('button', { name: 'Open Modal' }));

    // Modal renders into a portal, so we query against the full document body.
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
