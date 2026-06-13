/* eslint-disable jsx-a11y/interactive-supports-focus, jsx-a11y/no-noninteractive-tabindex --
   Synthetic test harnesses: minimal roving containers (role=tablist) and focusable filler elements
   exist only to drive the hook. Production a11y is covered by each real widget's own tests. */
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { useRovingFocus } from './use-roving-focus';

type Orientation = 'horizontal' | 'vertical' | 'both';

type HarnessProps = {
  orientation?: Orientation;
  loop?: boolean;
  itemSelector?: string;
  manageTabIndex?: boolean;
  onMove?: (item: HTMLElement) => void;
  labels?: string[];
  disabledLabels?: string[];
  ariaDisabledLabels?: string[];
  initialTabIndex?: boolean;
};

function Harness({
  labels = ['One', 'Two', 'Three'],
  disabledLabels = [],
  ariaDisabledLabels = [],
  initialTabIndex = false,
  ...options
}: HarnessProps) {
  const { containerRef, onKeyDown } = useRovingFocus<HTMLDivElement>(options);
  return (
    <div ref={containerRef} role="tablist" onKeyDown={onKeyDown}>
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          role="tab"
          disabled={disabledLabels.includes(label)}
          aria-disabled={ariaDisabledLabels.includes(label) || undefined}
          tabIndex={initialTabIndex ? (i === 0 ? 0 : -1) : undefined}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

describe('useRovingFocus', () => {
  it('moves focus with Right/Left in horizontal orientation', async () => {
    render(<Harness />);
    const [one, two] = screen.getAllByRole('tab');
    one!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(two).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(one).toHaveFocus();
  });

  it('uses Up/Down in vertical orientation and ignores Left/Right', async () => {
    render(<Harness orientation="vertical" />);
    const [one, two] = screen.getAllByRole('tab');
    one!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(one).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(two).toHaveFocus();
  });

  it('responds to all four arrows in "both" orientation', async () => {
    render(<Harness orientation="both" />);
    const [one, two] = screen.getAllByRole('tab');
    one!.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(two).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(one).toHaveFocus();
  });

  it('wraps around when loop is enabled (default)', async () => {
    render(<Harness />);
    const tabs = screen.getAllByRole('tab');
    tabs[2]!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[0]).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(tabs[2]).toHaveFocus();
  });

  it('clamps at the edges when loop is false', async () => {
    render(<Harness loop={false} />);
    const tabs = screen.getAllByRole('tab');
    tabs[2]!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[2]).toHaveFocus();
    tabs[0]!.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(tabs[0]).toHaveFocus();
  });

  it('jumps to first/last with Home/End', async () => {
    render(<Harness />);
    const tabs = screen.getAllByRole('tab');
    tabs[1]!.focus();
    await userEvent.keyboard('{End}');
    expect(tabs[2]).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(tabs[0]).toHaveFocus();
  });

  it('skips items disabled via the default selector', async () => {
    render(<Harness disabledLabels={['Two']} />);
    screen.getByText('One').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByText('Three')).toHaveFocus();
  });

  it('honors a custom itemSelector (aria-disabled)', async () => {
    render(
      <Harness
        itemSelector={'[role="tab"]:not([aria-disabled="true"])'}
        ariaDisabledLabels={['Two']}
      />,
    );
    screen.getByText('One').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByText('Three')).toHaveFocus();
  });

  it('ignores arrows off the tracked items but still honors Home/End', async () => {
    function Mixed() {
      const { containerRef, onKeyDown } = useRovingFocus<HTMLDivElement>();
      return (
        <div ref={containerRef} role="tablist" onKeyDown={onKeyDown}>
          <span data-testid="outside" tabIndex={0}>
            x
          </span>
          <button type="button" role="tab">
            One
          </button>
          <button type="button" role="tab">
            Two
          </button>
        </div>
      );
    }
    render(<Mixed />);
    screen.getByTestId('outside').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByTestId('outside')).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByText('Two')).toHaveFocus();
  });

  it('does not throw when there are no navigable items', async () => {
    function Empty() {
      const { containerRef, onKeyDown } = useRovingFocus<HTMLDivElement>();
      return (
        <div ref={containerRef} role="tablist" onKeyDown={onKeyDown}>
          <span data-testid="filler" tabIndex={0}>
            filler
          </span>
        </div>
      );
    }
    render(<Empty />);
    screen.getByTestId('filler').focus();
    await userEvent.keyboard('{ArrowRight}{Home}{End}');
    expect(screen.getByTestId('filler')).toHaveFocus();
  });

  it('manages the roving tabindex when manageTabIndex is true', async () => {
    render(<Harness manageTabIndex />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    tabs[0]!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute('tabindex', '0');
    expect(tabs[0]).toHaveAttribute('tabindex', '-1');
  });

  it('leaves tabindex untouched in the default selection-driven mode', async () => {
    render(<Harness initialTabIndex />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    tabs[0]!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveFocus();
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
  });

  it('calls onMove with the destination item', async () => {
    const onMove = vi.fn();
    render(<Harness onMove={onMove} />);
    const tabs = screen.getAllByRole('tab');
    tabs[0]!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onMove).toHaveBeenCalledWith(tabs[1]);
  });

  it('prevents default only for keys it handles', () => {
    render(<Harness />);
    const tabs = screen.getAllByRole('tab');
    tabs[0]!.focus();
    // fireEvent returns false when preventDefault was called.
    expect(fireEvent.keyDown(tabs[0]!, { key: 'ArrowRight' })).toBe(false);
    expect(fireEvent.keyDown(tabs[0]!, { key: 'Enter' })).toBe(true);
  });

  it('returns a stable shape without touching the DOM during render', () => {
    const { result } = renderHook(() => useRovingFocus());
    expect(result.current.containerRef).toBeDefined();
    expect(typeof result.current.onKeyDown).toBe('function');
  });
});
