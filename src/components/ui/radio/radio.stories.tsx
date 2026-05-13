import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Radio } from './radio';
import { RadioGroup } from './radio-group';

const meta = {
  title: 'UI/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    error: { control: 'text' },
    helper: { control: 'text' },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'plan',
    label: 'Choose a plan',
    defaultValue: 'pro',
    children: null,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="free" label="Free" />
      <Radio value="pro" label="Pro" />
      <Radio value="enterprise" label="Enterprise" />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  args: {
    name: 'size',
    label: 'T-shirt size',
    orientation: 'horizontal',
    defaultValue: 'M',
    children: null,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="S" label="Small" />
      <Radio value="M" label="Medium" />
      <Radio value="L" label="Large" />
      <Radio value="XL" label="X-Large" />
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  args: {
    name: 'color',
    label: 'Pick a color (controlled)',
    children: null,
  },
  render: (args) => {
    const [value, setValue] = useState('blue');
    return (
      <RadioGroup {...args} value={value} onChange={setValue}>
        <Radio value="red" label="Red" />
        <Radio value="green" label="Green" />
        <Radio value="blue" label="Blue" />
      </RadioGroup>
    );
  },
};

export const WithHelper: Story = {
  args: {
    name: 'notifications',
    label: 'Notification frequency',
    helper: 'You can change this at any time in settings',
    defaultValue: 'daily',
    children: null,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="realtime" label="Realtime" />
      <Radio value="daily" label="Daily digest" />
      <Radio value="weekly" label="Weekly summary" />
    </RadioGroup>
  ),
};

export const WithError: Story = {
  args: {
    name: 'consent',
    label: 'Data sharing consent',
    error: 'Please choose an option to continue',
    children: null,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="accept" label="Accept" />
      <Radio value="reject" label="Reject" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  args: {
    name: 'tier',
    label: 'Subscription tier',
    disabled: true,
    defaultValue: 'basic',
    children: null,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="basic" label="Basic" />
      <Radio value="premium" label="Premium" />
    </RadioGroup>
  ),
};
