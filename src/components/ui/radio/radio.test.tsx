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
    screen.getAllByRole('radio').forEach((r) => expect(r).toBeDisabled());
  });
});
