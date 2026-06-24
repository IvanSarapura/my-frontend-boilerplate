import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Cluster } from './cluster';

/**
 * Horizontal flow that wraps: rows of actions, badges or tags. Children flow in
 * a row and wrap to the next line, separated by a gap from the spacing scale
 * (`2 | 4 | 6 | 8`).
 */
const meta = {
  title: 'Layouts/Cluster',
  component: Cluster,
  tags: ['autodocs'],
  argTypes: {
    gap: { control: { type: 'select' }, options: [2, 4, 6, 8] },
  },
} satisfies Meta<typeof Cluster>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pill-shaped chips that make the horizontal gap + wrapping visible. */
function Chip({ label }: { label: string }) {
  return (
    <span
      style={{
        padding: 'var(--space-2) var(--space-4)',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-full)',
      }}
    >
      {label}
    </span>
  );
}

const items = (
  <>
    {['Design', 'Engineering', 'Product', 'Marketing', 'Sales', 'Support'].map(
      label => (
        <Chip key={label} label={label} />
      ),
    )}
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
