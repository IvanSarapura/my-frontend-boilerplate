import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MobileNav } from './mobile-nav';

/**
 * Resize the viewport below 768px to see the hamburger + off-canvas drawer;
 * at or above it the links flow inline.
 */
const meta = {
  title: 'Layouts/MobileNav',
  component: MobileNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof MobileNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Main navigation',
    children: (
      <>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </>
    ),
  },
};
