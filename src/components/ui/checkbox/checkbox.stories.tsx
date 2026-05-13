import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from './checkbox';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    label: { control: 'text' },
    error: { control: 'text' },
    helper: { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
    id: 'terms',
  },
};

export const Checked: Story = {
  args: {
    label: 'Subscribe to newsletter',
    id: 'newsletter',
    defaultChecked: true,
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Remember me',
    id: 'remember',
    helper: 'Stay signed in on this device for 30 days',
  },
};

export const WithError: Story = {
  args: {
    label: 'I agree to the terms',
    id: 'agree',
    error: 'You must accept the terms to continue',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled option',
    id: 'disabled',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Managed by admin',
    id: 'managed',
    disabled: true,
    defaultChecked: true,
  },
};

export const NoLabel: Story = {
  args: {
    id: 'standalone',
    'aria-label': 'Toggle option',
  },
};
