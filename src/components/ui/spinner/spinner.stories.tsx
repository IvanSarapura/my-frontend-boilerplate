import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Spinner } from './spinner';

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'muted', 'white'],
    },
    label: { control: 'text' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 'md', variant: 'default' },
};

export const Muted: Story = {
  args: { size: 'md', variant: 'muted' },
};

export const White: Story = {
  args: { size: 'md', variant: 'white' },
  decorators: [
    (Story) => (
      <div
        style={{
          background: '#171717',
          borderRadius: '8px',
          padding: '2rem',
          display: 'inline-flex',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const AllSizes: Story = {
  args: { variant: 'default' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
    </div>
  ),
};

export const AllVariants: Story = {
  args: { size: 'md' },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Spinner {...args} variant="default" />
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
          default
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Spinner {...args} variant="muted" />
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
          muted
        </span>
      </div>
      <div
        style={{
          background: '#171717',
          borderRadius: '8px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Spinner {...args} variant="white" />
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
          white
        </span>
      </div>
    </div>
  ),
};

export const InlineInButton: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <button
        disabled
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-medium)',
          cursor: 'not-allowed',
          opacity: 0.7,
        }}
      >
        <Spinner size="sm" variant="white" label="Saving" />
        Saving…
      </button>
      <button
        disabled
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'transparent',
          color: 'var(--foreground)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-medium)',
          cursor: 'not-allowed',
          opacity: 0.7,
        }}
      >
        <Spinner size="sm" variant="muted" label="Loading" />
        Loading…
      </button>
    </div>
  ),
};

export const CustomLabel: Story = {
  args: { size: 'md', variant: 'default', label: 'Uploading file…' },
};
