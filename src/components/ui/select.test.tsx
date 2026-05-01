import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Select } from './select';

describe('Select', () => {
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
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
    expect(screen.getAllByRole('option')).toHaveLength(2);
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
});
