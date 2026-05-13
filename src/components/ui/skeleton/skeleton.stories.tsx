import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Skeleton } from './skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'circle', 'rect'],
    },
    width: { control: 'text' },
    height: { control: 'text' },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    variant: 'text',
    width: 240,
  },
};

export const Circle: Story = {
  args: {
    variant: 'circle',
    width: 48,
    height: 48,
  },
};

export const Rectangle: Story = {
  args: {
    variant: 'rect',
    width: 320,
    height: 160,
  },
};

export const CardSkeleton: Story = {
  args: { variant: 'rect' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        width: 320,
        padding: '1rem',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <Skeleton variant="rect" height={160} />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
    </div>
  ),
};

export const ListSkeleton: Story = {
  args: { variant: 'rect' },
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      aria-busy="true"
      aria-label="Loading list"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <Skeleton variant="circle" width={40} height={40} />
          <div style={{ flex: 1, display: 'grid', gap: '0.4rem' }}>
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="70%" />
          </div>
        </div>
      ))}
    </div>
  ),
};
