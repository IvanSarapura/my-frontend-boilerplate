import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Footer } from './footer';

/**
 * Responsive page footer: brand + tagline, link columns (1 column on mobile,
 * fanning out to N on desktop via Grid), and a bottom legal row.
 */
const meta = {
  title: 'Layouts/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brand: 'Acme',
    tagline: 'A professional Next.js frontend boilerplate.',
    columns: [
      {
        heading: 'Product',
        links: [
          { href: '/features', label: 'Features' },
          { href: '/pricing', label: 'Pricing' },
          { href: '/changelog', label: 'Changelog' },
        ],
      },
      {
        heading: 'Company',
        links: [
          { href: '/about', label: 'About' },
          { href: '/blog', label: 'Blog' },
        ],
      },
      {
        heading: 'Legal',
        links: [
          { href: '/privacy', label: 'Privacy' },
          { href: '/terms', label: 'Terms' },
        ],
      },
    ],
    legal: '© 2026 Acme. All rights reserved.',
  },
};
