import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from './input';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    helper: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    error: 'Please enter a valid email address.',
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
    helper: 'Must be unique and at least 3 characters.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    placeholder: 'Cannot edit',
    disabled: true,
  },
};
