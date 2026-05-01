import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Card } from './card';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'interactive'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem' }}>
          Card Title
        </h3>
        <p style={{ margin: 0, color: 'var(--muted)' }}>
          This is a default card with padding and border radius.
        </p>
      </>
    ),
    variant: 'default',
  },
};

export const Outlined: Story = {
  args: {
    children: 'Outlined card without background.',
    variant: 'outlined',
  },
};

export const Interactive: Story = {
  args: {
    children: 'Hover over this card to see the shadow effect.',
    variant: 'interactive',
    onClick: () => {},
  },
};
