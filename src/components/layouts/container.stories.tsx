import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Container } from './container';

/**
 * Container centers content and applies the standard responsive gutters
 * (16 → 24 → 32px) so content never touches the viewport edge. The `size` prop
 * selects the max content width from the scale in globals.css:
 * `prose` (65ch, optimal reading measure) · `default` (1200px) ·
 * `wide` (1440px) · `bleed` (edge-to-edge — re-contain inner content with a
 * nested Container, see the Bleed story).
 */
const meta = {
  title: 'Layouts/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['prose', 'default', 'wide', 'bleed'],
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tinted box that makes the container's resolved width + gutters visible. */
function Demo({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: 'var(--space-6)',
        textAlign: 'center',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      {label}
    </div>
  );
}

export const Prose: Story = {
  args: {
    size: 'prose',
    children: <Demo label="prose · 65ch (reading width)" />,
  },
};

export const Default: Story = {
  args: { size: 'default', children: <Demo label="default · 1200px" /> },
};

export const Wide: Story = {
  args: { size: 'wide', children: <Demo label="wide · 1440px" /> },
};

/**
 * Full-bleed band: the outer Container has no max-width and no gutters, so its
 * background spans the viewport, while a nested Container re-centers and
 * gutter-pads the content.
 */
export const Bleed: Story = {
  args: {
    size: 'bleed',
    children: (
      <div
        style={{ paddingBlock: 'var(--space-8)', background: 'var(--card-bg)' }}
      >
        <Container>
          <Demo label="bleed band · inner content re-contained by a nested Container" />
        </Container>
      </div>
    ),
  },
};
