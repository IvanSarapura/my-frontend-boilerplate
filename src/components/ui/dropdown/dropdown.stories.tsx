import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  InfoIcon,
} from '@/components/ui/icon';

import { Dropdown } from './dropdown';
import { DropdownContent } from './dropdown-content';
import { DropdownItem } from './dropdown-item';
import { DropdownSeparator } from './dropdown-separator';
import { DropdownTrigger } from './dropdown-trigger';

const meta = {
  title: 'UI/DropdownMenu',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const PLACEHOLDER_ARGS = { children: null };

export const Default: Story = {
  args: PLACEHOLDER_ARGS,
  render: () => (
    <div style={{ padding: '2rem' }}>
      <Dropdown>
        <DropdownTrigger>Options</DropdownTrigger>
        <DropdownContent>
          <DropdownItem onSelect={() => alert('Edit')}>Edit</DropdownItem>
          <DropdownItem onSelect={() => alert('Duplicate')}>
            Duplicate
          </DropdownItem>
          <DropdownItem onSelect={() => alert('Delete')}>Delete</DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  ),
};

export const WithDisabledItem: Story = {
  args: PLACEHOLDER_ARGS,
  render: () => (
    <div style={{ padding: '2rem' }}>
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownContent>
          <DropdownItem onSelect={() => alert('View')}>View</DropdownItem>
          <DropdownItem disabled>Edit (unavailable)</DropdownItem>
          <DropdownItem onSelect={() => alert('Delete')}>Delete</DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  ),
};

export const WithSeparator: Story = {
  args: PLACEHOLDER_ARGS,
  render: () => (
    <div style={{ padding: '2rem' }}>
      <Dropdown>
        <DropdownTrigger>Account</DropdownTrigger>
        <DropdownContent>
          <DropdownItem onSelect={() => alert('Profile')}>Profile</DropdownItem>
          <DropdownItem onSelect={() => alert('Settings')}>
            Settings
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem onSelect={() => alert('Sign out')}>
            Sign out
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  ),
};

export const WithIcons: Story = {
  args: PLACEHOLDER_ARGS,
  render: () => (
    <div style={{ padding: '2rem' }}>
      <Dropdown>
        <DropdownTrigger>
          <ChevronDownIcon size={16} />
          More actions
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem onSelect={() => alert('Info')}>
            <InfoIcon size={14} />
            Details
          </DropdownItem>
          <DropdownItem onSelect={() => alert('Check')}>
            <CheckIcon size={14} />
            Mark done
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem onSelect={() => alert('Close')}>
            <CloseIcon size={14} />
            Dismiss
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  ),
};

export const AlignEnd: Story = {
  args: PLACEHOLDER_ARGS,
  render: () => (
    <div
      style={{ padding: '2rem', display: 'flex', justifyContent: 'flex-end' }}
    >
      <Dropdown placement="bottom-end">
        <DropdownTrigger>More</DropdownTrigger>
        <DropdownContent>
          <DropdownItem>Report</DropdownItem>
          <DropdownItem>Block</DropdownItem>
          <DropdownItem>Hide</DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  ),
};
