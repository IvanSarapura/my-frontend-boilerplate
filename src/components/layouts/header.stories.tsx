import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import { ThemeToggle } from '@/components/ui/theme-toggle';

import { Header } from './header';
import { NavLink } from './nav-link';

/**
 * Sticky page header. On desktop the links flow inline; below 768px they
 * collapse into the MobileNav hamburger + drawer (resize the viewport or use
 * the Mobile story). The `actions` slot here holds a ThemeToggle.
 */
const meta = {
  title: 'Layouts/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['md', 'lg'] },
    bareToggle: { control: 'boolean' },
  },
  decorators: [
    Story => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

const links = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export const Default: Story = {
  args: {
    brand: <NavLink href="/">Acme</NavLink>,
    links,
    actions: <ThemeToggle />,
  },
};

export const Mobile: Story = {
  args: Default.args,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

/** Larger mobile navbar — taller bar, bigger wordmark, 48px hamburger, and the
 *  ThemeSwitch (plain light/dark switch) in place of the ThemeToggle. */
export const MobileBig: Story = {
  args: {
    ...Default.args,
    size: 'lg',
    actions: <ThemeSwitch size="md" hideLabel />,
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

/** v2 of MobileBig — the hamburger is a bare icon (no button box), so its 28px
 *  SVG matches the 28px ThemeSwitch beside it. */
export const MobileBigBareMenu: Story = {
  args: {
    ...Default.args,
    size: 'lg',
    bareToggle: true,
    actions: <ThemeSwitch size="md" hideLabel />,
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
