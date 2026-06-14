import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { NavLink } from './nav-link';

/**
 * Locale-aware link that marks itself active (`aria-current="page"`) on an exact
 * pathname match. In Storybook `usePathname()` defaults to `'/'`, so the Active
 * story uses `href="/"` to show the active state.
 */
const meta = {
  title: 'Layouts/NavLink',
  component: NavLink,
  tags: ['autodocs'],
} satisfies Meta<typeof NavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { href: '/about', children: 'About' },
};

export const Active: Story = {
  args: { href: '/', children: 'Home' },
};
