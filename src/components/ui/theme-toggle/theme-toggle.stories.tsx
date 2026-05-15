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
    size: { control: { type: 'number', min: 12, max: 48, step: 2 } },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 20 },
};

export const Large: Story = {
  args: { size: 32 },
};

export const InToolbar: Story = {
  args: { size: 20 },
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
