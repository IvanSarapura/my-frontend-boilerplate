import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Select } from './select';

describe('Select', () => {
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
  ];

  it('renders trigger with placeholder', () => {
    render(
      <Select options={options} onChange={vi.fn()} placeholder="Pick one" />,
    );
    expect(screen.getByRole('button')).toHaveTextContent('Pick one');
  });

  it('opens menu on click', async () => {
    render(<Select options={options} onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('calls onChange when an option is selected', async () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('option', { name: 'Option B' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('closes menu on Escape', async () => {
    render(<Select options={options} onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('navigates options with ArrowDown and ArrowUp', async () => {
    render(<Select options={options} onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button'));
    const opts = screen.getAllByRole('option');

    await userEvent.keyboard('{ArrowDown}');
    expect(opts[0]).toHaveClass('focused');

    await userEvent.keyboard('{ArrowDown}');
    expect(opts[1]).toHaveClass('focused');

    await userEvent.keyboard('{ArrowUp}');
    expect(opts[0]).toHaveClass('focused');
  });

  it('selects focused option on Enter', async () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('a');
  });
});
