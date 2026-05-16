import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ThemeProvider } from '@/components/providers/theme-provider';

import { ThemeToggle } from './theme-toggle';

const meta = {
  title: 'UI/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 'md' },
};

export const AllSizes: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <ThemeToggle size="sm" />
      <ThemeToggle size="md" />
      <ThemeToggle size="lg" />
    </div>
  ),
};

export const InToolbar: Story = {
  args: { size: 'sm' },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: 'center',
        padding: 'var(--space-3)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--card-bg)',
      }}
    >
      <span style={{ fontSize: 'var(--text-sm)' }}>Appearance</span>
      <ThemeToggle {...args} />
    </div>
  ),
};
