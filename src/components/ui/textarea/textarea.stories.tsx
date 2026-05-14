import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Textarea } from './textarea';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    helper: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Write something…',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a short description',
    id: 'description',
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    helper: 'Maximum 200 characters.',
    id: 'bio',
  },
};

export const WithError: Story = {
  args: {
    label: 'Message',
    placeholder: 'Your message',
    error: 'Message cannot be empty.',
    id: 'message',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    placeholder: 'Cannot edit',
    disabled: true,
    id: 'disabled-textarea',
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Terms',
    value: 'These terms are read-only and cannot be edited.',
    readOnly: true,
    id: 'terms',
  },
};
