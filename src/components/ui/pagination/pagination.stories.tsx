import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Pagination } from './pagination';

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 0 } },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    boundaryCount: { control: { type: 'number', min: 0, max: 3 } },
    showFirstLast: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 4,
    onPageChange: () => {},
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 5,
    totalPages: 50,
    onPageChange: () => {},
  },
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 20,
    onPageChange: () => {},
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 20,
    totalPages: 20,
    onPageChange: () => {},
  },
};

export const WithFirstLast: Story = {
  args: {
    currentPage: 10,
    totalPages: 20,
    showFirstLast: true,
    onPageChange: () => {},
  },
};

export const LargerSiblings: Story = {
  args: {
    currentPage: 10,
    totalPages: 30,
    siblingCount: 2,
    onPageChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    disabled: true,
    onPageChange: () => {},
  },
};

export const Interactive: Story = {
  args: {
    currentPage: 1,
    totalPages: 12,
    onPageChange: () => {},
  },
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
          Current page: <strong>{page}</strong> / 12
        </div>
        <Pagination
          currentPage={page}
          totalPages={12}
          onPageChange={setPage}
          showFirstLast
        />
      </div>
    );
  },
};
