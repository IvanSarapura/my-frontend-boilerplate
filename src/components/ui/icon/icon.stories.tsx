import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon } from './icon';
import { type IconName, icons } from './icons';

const ICON_NAMES = Object.keys(icons) as IconName[];

const meta = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: ICON_NAMES,
    },
    size: {
      control: { type: 'number', min: 12, max: 64, step: 2 },
    },
    'aria-label': { control: 'text' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'chevron-down',
    size: 20,
  },
};

export const ChevronLeft: Story = {
  args: {
    name: 'chevron-left',
    size: 20,
    'aria-label': 'Previous',
  },
};

export const ChevronRight: Story = {
  args: {
    name: 'chevron-right',
    size: 20,
    'aria-label': 'Next',
  },
};

export const Large: Story = {
  args: {
    name: 'info',
    size: 48,
  },
};

export const WithAriaLabel: Story = {
  args: {
    name: 'close',
    size: 20,
    'aria-label': 'Close dialog',
  },
};

export const Gallery: Story = {
  args: { name: 'info', size: 24 },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '1rem',
        padding: '1rem',
      }}
    >
      {ICON_NAMES.map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Icon name={name} size={24} aria-label={name} />
          <code style={{ fontSize: 'var(--text-xs)' }}>{name}</code>
        </div>
      ))}
    </div>
  ),
};
