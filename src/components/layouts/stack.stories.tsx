import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Stack } from './stack';

/**
 * Vertical flow: stacks children in a column with a consistent gap from the
 * spacing scale (`2 | 4 | 6 | 8` → `var(--space-*)`).
 */
const meta = {
  title: 'Layouts/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    gap: { control: { type: 'select' }, options: [2, 4, 6, 8] },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tinted boxes that make the vertical rhythm visible. */
function Box({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: 'var(--space-4)',
        textAlign: 'center',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      {label}
    </div>
  );
}

const items = (
  <>
    <Box label="One" />
    <Box label="Two" />
    <Box label="Three" />
  </>
);

export const Default: Story = {
  args: { gap: 4, children: items },
};

export const Tight: Story = {
  args: { gap: 2, children: items },
};

export const Loose: Story = {
  args: { gap: 8, children: items },
};
