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

  it('closes the menu on an outside mousedown', async () => {
    render(<Select options={options} onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('keeps the menu open on a mousedown inside the wrapper', async () => {
    render(<Select options={options} onChange={vi.fn()} />);
    const trigger = screen.getByRole('button');
    await userEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.mouseDown(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('marks the option matching the value prop as selected', async () => {
    render(<Select options={options} value="b" onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button'));
    const optionB = screen.getByRole('option', { name: 'Option B' });
    expect(optionB).toHaveAttribute('aria-selected', 'true');
    expect(optionB).toHaveClass('selected');
  });

  it('does not select anything on Enter when no option is focused', async () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button'));
    // focusedIndex is -1, so the keydown handler's Enter branch is a no-op.
    await userEvent.keyboard('{Enter}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('links the error message via aria-describedby', () => {
    render(<Select options={options} onChange={vi.fn()} error="Required" />);
    const describedBy = screen
      .getByRole('button')
      .getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(screen.getByText('Required')).toHaveAttribute('id', describedBy);
  });

  it('generates unique error ids across instances', () => {
    render(
      <>
        <Select options={options} onChange={vi.fn()} error="First error" />
        <Select options={options} onChange={vi.fn()} error="Second error" />
      </>,
    );
    const [first, second] = screen.getAllByRole('button');
    const firstId = first?.getAttribute('aria-describedby');
    const secondId = second?.getAttribute('aria-describedby');
    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).not.toBe(secondId);
  });
});
