import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Container } from './container';
import { Section } from './section';

/**
 * Section standardizes vertical rhythm between page bands
 * (`padding-block: --section-py`, fluid 40 → 80px). Nest a `<Container>` inside
 * for gutters. `surface="muted"` paints a full-width background band — combine
 * it with an inner Container for the full-bleed pattern (see MutedBand).
 */
const meta = {
  title: 'Layouts/Section',
  component: Section,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    surface: {
      control: { type: 'select' },
      options: ['none', 'muted'],
    },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tinted box that makes the section's padding + container width visible. */
function Demo({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: 'var(--space-6)',
        textAlign: 'center',
        background: 'var(--background)',
        border: '1px dashed var(--card-border)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      {label}
    </div>
  );
}

export const Default: Story = {
  args: {
    children: (
      <Container>
        <Demo label="section · default rhythm · content in a Container" />
      </Container>
    ),
  },
};

/**
 * Full-bleed band: the muted background spans the viewport while the inner
 * Container re-centers and gutter-pads the content.
 */
export const MutedBand: Story = {
  args: {
    surface: 'muted',
    children: (
      <Container>
        <Demo label="muted band · full-width background, contained content" />
      </Container>
    ),
  },
};

/** Two stacked sections show the vertical rhythm between bands. */
export const Rhythm: Story = {
  render: () => (
    <>
      <Section>
        <Container>
          <Demo label="section one" />
        </Container>
      </Section>
      <Section surface="muted">
        <Container>
          <Demo label="section two (muted)" />
        </Container>
      </Section>
    </>
  ),
};
