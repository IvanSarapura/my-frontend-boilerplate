import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { FeatureGrid } from './feature-grid';

/**
 * Responsive grid of feature cards — 1 column on mobile, fanning out to `cols`
 * on desktop (Grid + Card).
 */
const meta = {
  title: 'Blocks/FeatureGrid',
  component: FeatureGrid,
  tags: ['autodocs'],
} satisfies Meta<typeof FeatureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    features: [
      {
        title: 'Mobile-first',
        description: 'Responsive layouts that hold up from 320px upward.',
      },
      {
        title: 'Accessible',
        description: 'WCAG AA contrast, focus rings and 44px touch targets.',
      },
      {
        title: 'Zero UI deps',
        description: 'Built on tokens and CSS Modules — no framework lock-in.',
      },
    ],
  },
};
