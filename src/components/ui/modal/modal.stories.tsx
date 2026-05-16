import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/ui/button';

import { Modal } from './modal';

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
