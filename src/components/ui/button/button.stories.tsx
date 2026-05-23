import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  InfoIcon,
} from '@/components/ui/icon';

import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'icon'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Button',
    variant: 'ghost',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    children: 'Small',
    variant: 'primary',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large',
    variant: 'primary',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
};

export const IconChevronLeft: Story = {
  args: {
    children: <ChevronLeftIcon />,
    variant: 'icon',
    size: 'md',
    'aria-label': 'Previous page',
  },
};

export const IconClose: Story = {
  args: {
    children: <CloseIcon />,
    variant: 'icon',
    size: 'md',
    'aria-label': 'Close',
  },
};

export const IconSmall: Story = {
  args: {
    children: <ChevronRightIcon size={16} />,
    variant: 'icon',
    size: 'sm',
    'aria-label': 'Next',
  },
};

export const IconLarge: Story = {
  args: {
    children: <InfoIcon size={24} />,
    variant: 'icon',
    size: 'lg',
    'aria-label': 'More info',
  },
};
