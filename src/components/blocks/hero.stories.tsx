import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/ui';

import { Hero } from './hero';

/**
 * Hero block: eyebrow + display headline + subtitle + CTA cluster. Use
 * `align="center"` for the Minimal preset; `start` (default) for marketing.
 */
const meta = {
  title: 'Blocks/Hero',
  component: Hero,
  tags: ['autodocs'],
  argTypes: {
    align: { control: { type: 'inline-radio' }, options: ['start', 'center'] },
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

const content = {
  eyebrow: 'Production-ready',
  title: 'Build your next idea, faster',
  subtitle:
    'A professional, accessible and responsive starting point — ready to adapt to your brand.',
  actions: (
    <>
      <Button variant="primary">Get started</Button>
      <Button variant="secondary">Learn more</Button>
    </>
  ),
};

export const Default: Story = {
  args: { ...content, align: 'start' },
};

export const Centered: Story = {
  args: { ...content, align: 'center' },
};
