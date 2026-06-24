import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Radio } from './radio';
import { RadioGroup } from './radio-group';

function Group({
  onChange,
  defaultValue,
  error,
  disabled,
}: {
  onChange?: (v: string) => void;
  defaultValue?: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <RadioGroup
      name="plan"
      label="Plan"
      onChange={onChange}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(error !== undefined ? { error } : {})}
      {...(disabled !== undefined ? { disabled } : {})}
    >
      <Radio value="free" label="Free" />
      <Radio value="pro" label="Pro" />
    </RadioGroup>
  );
}

describe('Radio + RadioGroup', () => {
  it('renders the group with radiogroup role and labels', () => {
    render(<Group />);
    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('selecting one deselects the others', async () => {
    const user = userEvent.setup();
    render(<Group />);
    const [free, pro] = screen.getAllByRole('radio') as HTMLInputElement[];

    await user.click(free!);
    expect(free).toBeChecked();
    expect(pro).not.toBeChecked();

    await user.click(pro!);
    expect(pro).toBeChecked();
    expect(free).not.toBeChecked();
  });

  it('honors defaultValue', () => {
    render(<Group defaultValue="pro" />);
    const [, pro] = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(pro).toBeChecked();
  });

  it('fires onChange with the selected value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Group onChange={onChange} />);
    await user.click(screen.getByLabelText('Pro'));
    expect(onChange).toHaveBeenCalledWith('pro');
  });

  it('supports controlled mode', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState('free');
      return (
        <RadioGroup name="x" label="X" value={value} onChange={setValue}>
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
        </RadioGroup>
      );
    }

    render(<Controlled />);
    const [, pro] = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(pro).not.toBeChecked();
    await user.click(pro!);
    expect(pro).toBeChecked();
  });

  it('renders error message with role="alert" and marks group invalid', () => {
    render(<Group error="Required" />);
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('shows helper text and links via aria-describedby', () => {
    render(
      <RadioGroup name="x" label="X" helper="Pick wisely">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(screen.getByText('Pick wisely')).toBeInTheDocument();
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-describedby');
  });

  it('disables all radios when group is disabled', () => {
    render(<Group disabled />);
    screen.getAllByRole('radio').forEach(r => expect(r).toBeDisabled());
  });

  it('works standalone outside a RadioGroup as an uncontrolled input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Radio name="standalone" value="a" label="A" onChange={onChange} />);
    const radio = screen.getByRole('radio') as HTMLInputElement;
    expect(radio).toHaveAttribute('name', 'standalone');
    expect(radio).not.toBeChecked();

    await user.click(radio);
    expect(onChange).toHaveBeenCalled();
    expect(radio).toBeChecked();
  });

  it('gives each standalone radio a unique generated id', () => {
    render(
      <>
        <Radio name="dup" value="a" label="A" />
        <Radio name="dup" value="a" label="B" />
      </>,
    );
    const a = screen.getByLabelText('A');
    const b = screen.getByLabelText('B');
    expect(a.id).toBeTruthy();
    expect(a.id).not.toBe(b.id);
  });

  it('applies className to the label root, not the inner box', () => {
    const { container } = render(
      <Radio name="x" value="a" label="A" className="custom" />,
    );
    expect(container.querySelector('label')).toHaveClass('custom');
    expect(container.querySelector('.box')).not.toHaveClass('custom');
  });

  it('omits aria-labelledby when no label is provided', () => {
    render(
      <RadioGroup name="x">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).not.toHaveAttribute(
      'aria-labelledby',
    );
  });

  it('applies the horizontal orientation class', () => {
    const { container } = render(
      <RadioGroup name="x" label="X" orientation="horizontal">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(container.querySelector('.horizontal')).toBeInTheDocument();
  });
});
