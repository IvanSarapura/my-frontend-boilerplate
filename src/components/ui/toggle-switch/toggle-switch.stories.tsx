import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MoonIcon } from '@/components/ui/icon';

import { ToggleSwitch } from './toggle-switch';

const meta = {
  title: 'UI/ToggleSwitch',
  component: ToggleSwitch,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['rounded', 'rectangular'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    labelPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
    },
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Enable notifications',
    variant: 'rounded',
    size: 'md',
  },
};

export const Rectangular: Story = {
  args: {
    label: 'Dark mode',
    variant: 'rectangular',
    size: 'md',
  },
};

export const LabelLeft: Story = {
  args: {
    label: 'Airplane mode',
    labelPosition: 'left',
    variant: 'rounded',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    label: 'Compact view',
    variant: 'rounded',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: 'High contrast',
    variant: 'rounded',
    size: 'lg',
  },
};

export const Checked: Story = {
  args: {
    label: 'Auto-save',
    variant: 'rounded',
    size: 'md',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Sync (unavailable)',
    variant: 'rounded',
    size: 'md',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Managed by admin',
    variant: 'rounded',
    size: 'md',
    disabled: true,
    defaultChecked: true,
  },
};

export const NoLabel: Story = {
  args: {
    variant: 'rounded',
    size: 'md',
    'aria-label': 'Toggle feature',
  },
};

/** A decorative icon can ride inside the sliding thumb (used by `ThemeSwitch`). */
export const WithThumbIcon: Story = {
  args: { label: 'Dark mode', variant: 'rounded', size: 'lg' },
  render: args => <ToggleSwitch {...args} icon={<MoonIcon />} />,
};
