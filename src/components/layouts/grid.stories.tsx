import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Grid } from './grid';

/**
 * Mobile-first grid: a single column on small viewports, expanding to `cols`
 * (`2 | 3 | 4`) columns as the viewport grows. `gap` (`2 | 4 | 6 | 8`) controls
 * both row and column spacing. Resize the canvas to see the responsive collapse.
 */
const meta = {
  title: 'Layouts/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    cols: { control: { type: 'select' }, options: [2, 3, 4] },
    gap: { control: { type: 'select' }, options: [2, 4, 6, 8] },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tinted cells that make the column count + gap visible. */
function Cells({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            padding: 'var(--space-6)',
            textAlign: 'center',
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {i + 1}
        </div>
      ))}
    </>
  );
}

export const TwoColumns: Story = {
  args: { cols: 2, gap: 4, children: <Cells count={4} /> },
};

export const ThreeColumns: Story = {
  args: { cols: 3, gap: 4, children: <Cells count={6} /> },
};

export const FourColumns: Story = {
  args: { cols: 4, gap: 4, children: <Cells count={8} /> },
};
