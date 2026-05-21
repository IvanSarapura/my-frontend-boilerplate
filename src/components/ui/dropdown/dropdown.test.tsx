import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Dropdown } from './dropdown';
import { DropdownContent } from './dropdown-content';
import { DropdownItem } from './dropdown-item';
import { DropdownSeparator } from './dropdown-separator';
import { DropdownTrigger } from './dropdown-trigger';

function BasicDropdown({
  onSelect,
  disabledSecond = false,
}: {
  onSelect?: () => void;
  disabledSecond?: boolean;
}) {
  return (
    <Dropdown>
      <DropdownTrigger>Open</DropdownTrigger>
      <DropdownContent>
        <DropdownItem onSelect={onSelect}>Item One</DropdownItem>
        <DropdownItem disabled={disabledSecond} onSelect={onSelect}>
          Item Two
        </DropdownItem>
        <DropdownItem onSelect={onSelect}>Item Three</DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

describe('Dropdown', () => {
  it('renders trigger and hides menu by default', () => {
    render(<BasicDropdown />);
    expect(screen.getByRole('button', { name: /open/i })).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('trigger has aria-haspopup="menu"', () => {
    render(<BasicDropdown />);
    expect(screen.getByRole('button', { name: /open/i })).toHaveAttribute(
      'aria-haspopup',
      'menu',
    );
  });

  it('opens menu on trigger click', async () => {
    const user = userEvent.setup();
    render(<BasicDropdown />);
    await user.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('trigger has aria-expanded="true" when open', async () => {
    const user = userEvent.setup();
    render(<BasicDropdown />);
    await user.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByRole('button', { name: /open/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('closes menu when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<BasicDropdown />);
    await user.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes menu on second trigger click', async () => {
    const user = userEvent.setup();
    render(<BasicDropdown />);
    await user.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('clicking an item calls onSelect and closes the menu', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<BasicDropdown onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: /open/i }));
    await user.click(screen.getByRole('menuitem', { name: /item one/i }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('disabled item does not call onSelect', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<BasicDropdown onSelect={onSelect} disabledSecond />);
    await user.click(screen.getByRole('button', { name: /open/i }));
    const disabledItem = screen.getByRole('menuitem', { name: /item two/i });
    expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
    await user.click(disabledItem);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('ArrowDown moves focus to the next item', async () => {
    const user = userEvent.setup();
    render(<BasicDropdown />);
    await user.click(screen.getByRole('button', { name: /open/i }));
    await user.keyboard('{ArrowDown}');
    const items = screen.getAllByRole('menuitem');
    expect(document.activeElement).toBe(items[0]);
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(items[1]);
  });

  it('renders DropdownSeparator with role="separator"', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger>Open</DropdownTrigger>
        <DropdownContent>
          <DropdownItem>One</DropdownItem>
          <DropdownSeparator />
          <DropdownItem>Two</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    await user.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('controlled mode: onOpenChange is called with the next open state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Dropdown
          open={open}
          onOpenChange={v => {
            setOpen(v);
            onOpenChange(v);
          }}
        >
          <DropdownTrigger>Open</DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: /open/i }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('throws when a sub-component is used outside <Dropdown>', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<DropdownItem>Orphan</DropdownItem>)).toThrow(
      'Dropdown sub-components must be used inside <Dropdown>.',
    );
    spy.mockRestore();
  });
});
