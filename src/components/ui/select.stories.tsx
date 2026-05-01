import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Select } from './select';

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'one', label: 'Option One' },
  { value: 'two', label: 'Option Two' },
  { value: 'three', label: 'Option Three' },
];

export const Default: Story = {
  args: {
    label: 'Choose an option',
    options,
    placeholder: 'Select...',
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    label: 'Required field',
    options,
    error: 'Please select a valid option.',
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    options,
    disabled: true,
    onChange: () => {},
  },
};
