import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ButtonLink } from './button-link';

/**
 * A link that looks like a `Button`, for CTAs that navigate to a route (uses
 * `next/link`). Same `variant`/`size` API as `Button`; the rendered element is
 * an `<a>`, so it is keyboard-focusable and openable in a new tab.
 */
const meta = {
  title: 'UI/ButtonLink',
  component: ButtonLink,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof ButtonLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { href: '#', children: 'Get started', variant: 'primary', size: 'md' },
};

export const Secondary: Story = {
  args: { href: '#', children: 'Learn more', variant: 'secondary', size: 'md' },
};
