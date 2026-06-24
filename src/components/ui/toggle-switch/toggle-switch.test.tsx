import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ToggleSwitch } from './toggle-switch';

describe('ToggleSwitch', () => {
  it('exposes the switch role to assistive tech', () => {
    render(<ToggleSwitch aria-label="Toggle" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders label text and associates it with the input', () => {
    render(<ToggleSwitch label="Dark mode" id="dark-mode" />);
    expect(screen.getByLabelText('Dark mode')).toBeInTheDocument();
  });

  it('toggles checked state when clicked', async () => {
    const user = userEvent.setup();
    render(<ToggleSwitch label="Notifications" id="notif" />);
    const input = screen.getByRole('switch');
    expect(input).not.toBeChecked();
    await user.click(input);
    expect(input).toBeChecked();
  });

  it('renders as checked when defaultChecked is set', () => {
    render(<ToggleSwitch label="Auto-save" id="autosave" defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('is not interactive when disabled', () => {
    render(<ToggleSwitch label="Sync" id="sync" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('forwards arbitrary HTML attributes to the underlying input', () => {
    render(
      <ToggleSwitch label="Feature" id="feature" data-tracking="ts-feature" />,
    );
    expect(screen.getByRole('switch')).toHaveAttribute(
      'data-tracking',
      'ts-feature',
    );
  });

  it('renders the label before the switch when labelPosition is "left"', () => {
    render(<ToggleSwitch label="Dark mode" id="dm" labelPosition="left" />);
    const label = screen.getByText('Dark mode');
    const input = screen.getByRole('switch');
    expect(label).toBeInTheDocument();
    // DOCUMENT_POSITION_FOLLOWING (4) means input comes after the label.
    expect(
      label.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('uses name as fallback id when id is not provided', () => {
    render(<ToggleSwitch label="Theme" name="theme" />);
    expect(screen.getByLabelText('Theme')).toHaveAttribute('id', 'theme');
  });

  it('applies the outlined variant class to the track', () => {
    const { container } = render(
      <ToggleSwitch aria-label="Toggle" variant="outlined" />,
    );
    expect(container.querySelector('.outlined')).toBeInTheDocument();
  });

  it('applies the outlined-max variant class to the track', () => {
    const { container } = render(
      <ToggleSwitch aria-label="Toggle" variant="outlined-max" />,
    );
    expect(container.querySelector('.outlined-max')).toBeInTheDocument();
  });

  it('renders a decorative icon inside the thumb when provided', () => {
    render(
      <ToggleSwitch label="Theme" icon={<svg data-testid="thumb-icon" />} />,
    );
    expect(screen.getByTestId('thumb-icon')).toBeInTheDocument();
  });
});
