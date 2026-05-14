import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Tabs } from './tabs';
import { TabsContent } from './tabs-content';
import { TabsList } from './tabs-list';
import { TabsTrigger } from './tabs-trigger';

function ThreeTabs({
  defaultValue = 'one',
  disabledTwo = false,
  orientation = 'horizontal' as 'horizontal' | 'vertical',
}: {
  defaultValue?: string;
  disabledTwo?: boolean;
  orientation?: 'horizontal' | 'vertical';
} = {}) {
  return (
    <Tabs defaultValue={defaultValue} orientation={orientation}>
      <TabsList>
        <TabsTrigger value="one">Tab One</TabsTrigger>
        <TabsTrigger value="two" disabled={disabledTwo}>
          Tab Two
        </TabsTrigger>
        <TabsTrigger value="three">Tab Three</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Panel One</TabsContent>
      <TabsContent value="two">Panel Two</TabsContent>
      <TabsContent value="three">Panel Three</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders a tablist with the correct orientation', () => {
    render(<ThreeTabs />);
    expect(screen.getByRole('tablist', { hidden: true })).toHaveAttribute(
      'aria-orientation',
      'horizontal',
    );
  });

  it('renders tablist with vertical orientation', () => {
    render(<ThreeTabs orientation="vertical" />);
    expect(screen.getByRole('tablist', { hidden: true })).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });

  it('activates the defaultValue tab on mount', () => {
    render(<ThreeTabs defaultValue="two" />);
    expect(screen.getByRole('tab', { name: /tab two/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('inactive tabs have aria-selected="false"', () => {
    render(<ThreeTabs defaultValue="one" />);
    expect(screen.getByRole('tab', { name: /tab two/i })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tab', { name: /tab three/i })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('clicking a tab activates it', async () => {
    const user = userEvent.setup();
    render(<ThreeTabs />);
    await user.click(screen.getByRole('tab', { name: /tab two/i }));
    expect(screen.getByRole('tab', { name: /tab two/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: /tab one/i })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('shows the active panel and hides inactive ones', () => {
    render(<ThreeTabs defaultValue="one" />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel One');
    const allPanels = screen.getAllByRole('tabpanel', { hidden: true });
    const hidden = allPanels.filter((p) => p.hasAttribute('hidden'));
    expect(hidden).toHaveLength(2);
  });

  it('wires aria-controls and aria-labelledby between trigger and panel', () => {
    render(<ThreeTabs defaultValue="one" />);
    const tab = screen.getByRole('tab', { name: /tab one/i });
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  });

  it('active tab has tabIndex=0, inactive tabs have tabIndex=-1', () => {
    render(<ThreeTabs defaultValue="one" />);
    expect(screen.getByRole('tab', { name: /tab one/i })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByRole('tab', { name: /tab two/i })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('disabled tab does not respond to clicks', async () => {
    const user = userEvent.setup();
    render(<ThreeTabs disabledTwo />);
    const tab2 = screen.getByRole('tab', { name: /tab two/i });
    expect(tab2).toBeDisabled();
    await user.click(tab2);
    expect(tab2).toHaveAttribute('aria-selected', 'false');
  });

  it('ArrowRight moves focus without activating the next tab', async () => {
    const user = userEvent.setup();
    render(<ThreeTabs defaultValue="one" />);
    const tab1 = screen.getByRole('tab', { name: /tab one/i });
    const tab2 = screen.getByRole('tab', { name: /tab two/i });

    await user.click(tab1);
    await user.keyboard('{ArrowRight}');

    expect(document.activeElement).toBe(tab2);
    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(tab2).toHaveAttribute('aria-selected', 'false');
  });

  it('Enter activates the focused tab', async () => {
    const user = userEvent.setup();
    render(<ThreeTabs defaultValue="one" />);
    const tab2 = screen.getByRole('tab', { name: /tab two/i });

    await user.click(screen.getByRole('tab', { name: /tab one/i }));
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(tab2);

    await user.keyboard('{Enter}');
    expect(tab2).toHaveAttribute('aria-selected', 'true');
  });

  it('Home moves focus to the first tab', async () => {
    const user = userEvent.setup();
    render(<ThreeTabs defaultValue="three" />);
    await user.click(screen.getByRole('tab', { name: /tab three/i }));
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(
      screen.getByRole('tab', { name: /tab one/i }),
    );
  });

  it('End moves focus to the last tab', async () => {
    const user = userEvent.setup();
    render(<ThreeTabs />);
    await user.click(screen.getByRole('tab', { name: /tab one/i }));
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(
      screen.getByRole('tab', { name: /tab three/i }),
    );
  });

  it('controlled mode: calls onValueChange with the new value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Controlled() {
      const [val, setVal] = useState('a');
      return (
        <Tabs
          value={val}
          onValueChange={(v) => {
            setVal(v);
            onValueChange(v);
          }}
        >
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsTrigger value="b">B</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Panel A</TabsContent>
          <TabsContent value="b">Panel B</TabsContent>
        </Tabs>
      );
    }

    render(<Controlled />);
    await user.click(screen.getByRole('tab', { name: /^b$/i }));
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('tab', { name: /^b$/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('throws when a sub-component is used outside <Tabs>', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<TabsTrigger value="x">Orphan</TabsTrigger>)).toThrow(
      'Tabs sub-components must be used inside <Tabs>.',
    );
    spy.mockRestore();
  });
});
