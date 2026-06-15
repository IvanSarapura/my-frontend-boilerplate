import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ThemeProvider } from '@/components/providers/theme-provider';

import { ThemeSwitch } from './theme-switch';

/**
 * Binary light/dark switch built on `ToggleSwitch`. Toggling it changes the
 * theme live (the canvas reads the `data-theme` attribute). For the tri-state
 * cycle including `system`, use `ThemeToggle`.
 */
const meta = {
  title: 'UI/ThemeSwitch',
  component: ThemeSwitch,
  tags: ['autodocs'],
  decorators: [
    Story => (
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
    labelPosition: {
      control: { type: 'inline-radio' },
      options: ['left', 'right'],
    },
    icons: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
  },
} satisfies Meta<typeof ThemeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Plain switch (no thumb glyph). */
export const Default: Story = {
  args: { label: 'Dark mode', size: 'md', labelPosition: 'right' },
};

/** Sun (light) / moon (dark) glyph inside the thumb. */
export const WithIcons: Story = {
  args: { label: 'Dark mode', size: 'md', labelPosition: 'right', icons: true },
};

export const LabelLeft: Story = {
  args: { label: 'Dark mode', size: 'md', labelPosition: 'left' },
};

/** Label hidden visually but kept as the accessible name — for compact spots
 *  like a header bar (the switch reads as icon-only). */
export const NoLabel: Story = {
  args: { label: 'Dark mode', size: 'md', hideLabel: true },
};

export const InToolbar: Story = {
  args: { label: 'Dark mode', size: 'sm' },
  render: args => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-4)',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--card-bg)',
      }}
    >
      <span style={{ fontSize: 'var(--text-sm)' }}>Appearance</span>
      <ThemeSwitch {...args} />
    </div>
  ),
};
