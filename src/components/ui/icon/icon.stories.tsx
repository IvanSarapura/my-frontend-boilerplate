import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { IconBase } from './icon-base';
import { ICON_CATALOG } from './icons-registry.dev';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  InfoIcon,
} from './index';

const meta = {
  title: 'UI/Icon',
  component: IconBase,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tree-shakeable icon system. Import each icon as a named component (`import { CloseIcon } from "@/components/ui/icon"`). Only the icons referenced ship to the production bundle. `IconBase` is the shared SVG wrapper; consumers normally use the per-icon components below, not `IconBase` directly.',
      },
    },
  },
} satisfies Meta<typeof IconBase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ChevronDownIcon size={20} />,
};

export const ChevronLeft: Story = {
  render: () => <ChevronLeftIcon size={20} aria-label="Previous" />,
};

export const ChevronRight: Story = {
  render: () => <ChevronRightIcon size={20} aria-label="Next" />,
};

export const Large: Story = {
  render: () => <InfoIcon size={48} />,
};

export const WithAriaLabel: Story = {
  render: () => <CloseIcon size={20} aria-label="Close dialog" />,
};

export const Gallery: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '1rem',
        padding: '1rem',
      }}
    >
      {ICON_CATALOG.map(({ name, Component }) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Component size={24} aria-label={name} />
          <code style={{ fontSize: 'var(--text-xs)' }}>{name}</code>
        </div>
      ))}
    </div>
  ),
};
