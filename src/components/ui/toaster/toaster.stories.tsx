import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect, useRef } from 'react';

import { ToastProvider, useToast } from '@/components/providers/toast-provider';

import { Toaster } from './toaster';

const meta = {
  title: 'UI/Toaster',
  component: Toaster,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastControls() {
  const { addToast } = useToast();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <button
        type="button"
        onClick={() =>
          addToast({ title: 'Default notification', variant: 'default' })
        }
      >
        Show Default
      </button>
      <button
        type="button"
        onClick={() =>
          addToast({ title: 'Operation successful', variant: 'success' })
        }
      >
        Show Success
      </button>
      <button
        type="button"
        onClick={() =>
          addToast({ title: 'Something went wrong', variant: 'error' })
        }
      >
        Show Error
      </button>
      <button
        type="button"
        onClick={() =>
          addToast({
            title: 'Heads up',
            description: 'Please review your input.',
            variant: 'warning',
          })
        }
      >
        Show Warning
      </button>
      <Toaster />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <ToastControls />,
};

function PreloadedControls() {
  const { addToast } = useToast();
  const stableAddToast = useRef(addToast);
  useEffect(() => {
    stableAddToast.current({
      title: 'Default notification',
      variant: 'default',
    });
    stableAddToast.current({ title: 'Saved successfully', variant: 'success' });
    stableAddToast.current({ title: 'Something went wrong', variant: 'error' });
    stableAddToast.current({
      title: 'Heads up',
      description: 'Please review before submitting.',
      variant: 'warning',
    });
  }, []);
  return <Toaster />;
}

export const AllVariants: Story = {
  render: () => <PreloadedControls />,
};
