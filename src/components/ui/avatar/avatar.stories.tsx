import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Avatar } from './avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    shape: {
      control: { type: 'select' },
      options: ['circle', 'square'],
    },
    status: {
      control: { type: 'select' },
      options: [undefined, 'online', 'offline', 'away', 'busy'],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_IMG =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop';

export const WithImage: Story = {
  args: {
    src: SAMPLE_IMG,
    alt: 'Ada Lovelace',
    name: 'Ada Lovelace',
    size: 'md',
  },
};

export const FallbackInitials: Story = {
  args: {
    alt: 'Grace Hopper',
    name: 'Grace Hopper',
    size: 'md',
  },
};

export const BrokenImage: Story = {
  args: {
    src: 'https://this-domain-does-not-exist.invalid/avatar.png',
    alt: 'Margaret Hamilton',
    name: 'Margaret Hamilton',
    size: 'md',
  },
};

export const NoName: Story = {
  args: {
    alt: 'Anonymous user',
    size: 'md',
  },
};

export const Square: Story = {
  args: {
    src: SAMPLE_IMG,
    alt: 'Ada Lovelace',
    name: 'Ada Lovelace',
    shape: 'square',
    size: 'lg',
  },
};

export const Sizes: Story = {
  args: { alt: '', name: 'Ada Lovelace' },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar alt="Small" name="Ada Lovelace" size="sm" />
      <Avatar alt="Medium" name="Ada Lovelace" size="md" />
      <Avatar alt="Large" name="Ada Lovelace" size="lg" />
      <Avatar alt="Extra large" name="Ada Lovelace" size="xl" />
    </div>
  ),
};

export const WithStatus: Story = {
  args: {
    src: SAMPLE_IMG,
    alt: 'Ada Lovelace',
    name: 'Ada Lovelace',
    size: 'lg',
    status: 'online',
  },
};

export const StatusGrid: Story = {
  args: { alt: '', name: 'Ada Lovelace', size: 'lg' },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <Avatar alt="Online" name="Online User" size="lg" status="online" />
      <Avatar alt="Away" name="Away User" size="lg" status="away" />
      <Avatar alt="Busy" name="Busy User" size="lg" status="busy" />
      <Avatar alt="Offline" name="Offline User" size="lg" status="offline" />
    </div>
  ),
};

export const Group: Story = {
  args: { alt: '', name: 'Group' },
  render: () => (
    <div style={{ display: 'inline-flex' }}>
      <Avatar alt="Ada" name="Ada Lovelace" size="md" />
      <Avatar alt="Grace" name="Grace Hopper" size="md" className="overlap" />
      <Avatar
        alt="Margaret"
        name="Margaret Hamilton"
        size="md"
        className="overlap"
      />
      <Avatar
        alt="Katherine"
        name="Katherine Johnson"
        size="md"
        className="overlap"
      />
    </div>
  ),
};
