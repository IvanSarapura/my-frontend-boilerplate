import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tooltip } from './tooltip';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
      ],
    },
    delay: { control: { type: 'number' } },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const PLACEHOLDER_ARGS = { content: '', children: <span /> };

export const Default: Story = {
  args: PLACEHOLDER_ARGS,
  render: () => (
    <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
      <Tooltip content="This is a helpful tooltip" delay={0}>
        <button>Hover over me</button>
      </Tooltip>
    </div>
  ),
};

export const Placements: Story = {
  args: PLACEHOLDER_ARGS,
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '3rem',
        padding: '4rem',
      }}
    >
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <div
          key={placement}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Tooltip
            content={`Placement: ${placement}`}
            placement={placement}
            delay={0}
          >
            <button style={{ padding: '0.5rem 1.5rem' }}>{placement}</button>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};

export const WithDelay: Story = {
  args: PLACEHOLDER_ARGS,
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '1.5rem',
        padding: '3rem',
        justifyContent: 'center',
      }}
    >
      <Tooltip content="Instant — no delay" delay={0}>
        <button>0 ms</button>
      </Tooltip>
      <Tooltip content="Standard delay — 300 ms" delay={300}>
        <button>300 ms</button>
      </Tooltip>
      <Tooltip content="Slow delay — 800 ms" delay={800}>
        <button>800 ms</button>
      </Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  args: PLACEHOLDER_ARGS,
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '1.5rem',
        padding: '3rem',
        justifyContent: 'center',
      }}
    >
      <Tooltip content="This tooltip is active" delay={0}>
        <button>Active tooltip</button>
      </Tooltip>
      <Tooltip content="This tooltip is disabled" disabled>
        <button>No tooltip (disabled)</button>
      </Tooltip>
    </div>
  ),
};
