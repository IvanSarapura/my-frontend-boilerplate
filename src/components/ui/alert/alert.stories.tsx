import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Alert } from './alert';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error'],
    },
    icon: { control: 'boolean' },
    title: { control: 'text' },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Heads up',
    children: 'A new version of the boilerplate is available.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'All set',
    children: 'Your changes have been saved successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Be careful',
    children: 'This action will overwrite your previous configuration.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Something went wrong',
    children: 'Unable to load the requested resource. Please try again.',
  },
};

export const TitleOnly: Story = {
  args: {
    variant: 'info',
    title: 'Server maintenance scheduled for Sunday 02:00 UTC.',
  },
};

export const DescriptionOnly: Story = {
  args: {
    variant: 'success',
    children: 'Profile updated.',
  },
};

export const NoIcon: Story = {
  args: {
    variant: 'info',
    title: 'Minimal',
    icon: false,
    children: 'Same alert without the leading icon.',
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'warning',
    title: 'Heads up',
    children: 'Click the X to dismiss this alert.',
  },
  render: args => {
    const [open, setOpen] = useState(true);
    if (!open) return <button onClick={() => setOpen(true)}>Show alert</button>;
    return <Alert {...args} onClose={() => setOpen(false)} />;
  },
};

export const LongDescription: Story = {
  args: {
    variant: 'info',
    title: 'Release notes',
    children: (
      <>
        We added <strong>3 new primitives</strong> to the design system: Alert,
        Avatar, and Pagination. The build remains zero-config and the new
        components reuse the existing Icon, Button, and token system.
      </>
    ),
  },
};
