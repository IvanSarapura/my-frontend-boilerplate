import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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
        <button type="button">Cancel</button>
        <button type="button">Confirm</button>
      </>
    ),
  },
};
