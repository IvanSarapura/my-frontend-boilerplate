import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Tooltip } from './tooltip';

describe('Tooltip', () => {
  it('does not render tooltip content by default', () => {
    render(
      <Tooltip content="Hint">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hover hint" delay={0}>
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Hover hint');
  });

  it('hides tooltip when pointer leaves the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hover hint" delay={0}>
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await user.unhover(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip when trigger receives focus', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Focus hint">
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('hides tooltip when trigger loses focus', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Focus hint">
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await user.tab();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('does not show tooltip when disabled', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hidden" disabled>
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('wires aria-describedby on trigger to tooltip id', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="ARIA hint" delay={0}>
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    const tooltip = screen.getByRole('tooltip');
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  });
});
