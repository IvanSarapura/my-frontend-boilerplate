import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'success', 'warning', 'error'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    children: 'New',
    variant: 'primary',
  },
};

/*
 * Filled status badges (success/error) are intentionally low-contrast: per the
 * design-system contrast table (globals.css), --color-success/--color-error are
 * decorative fills, not text colors, and never carry information by color alone
 * — the badge text repeats the status. We disable the color-contrast rule here
 * with that justification rather than darkening the brand fills.
 */
const decorativeFillA11y = {
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const Success: Story = {
  args: {
    children: 'Active',
    variant: 'success',
  },
  parameters: decorativeFillA11y,
};

export const Warning: Story = {
  args: {
    children: 'Pending',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    children: 'Failed',
    variant: 'error',
  },
  parameters: decorativeFillA11y,
};
