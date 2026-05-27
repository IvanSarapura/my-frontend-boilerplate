import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ToggleSwitch } from './toggle-switch';

describe('ToggleSwitch', () => {
  it('renders a checkbox input', () => {
    render(<ToggleSwitch aria-label="Toggle" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders label text and associates it with the input', () => {
    render(<ToggleSwitch label="Dark mode" id="dark-mode" />);
    expect(screen.getByLabelText('Dark mode')).toBeInTheDocument();
  });

  it('toggles checked state when clicked', async () => {
    const user = userEvent.setup();
    render(<ToggleSwitch label="Notifications" id="notif" />);
    const input = screen.getByRole('checkbox');
    expect(input).not.toBeChecked();
    await user.click(input);
    expect(input).toBeChecked();
  });

  it('renders as checked when defaultChecked is set', () => {
    render(<ToggleSwitch label="Auto-save" id="autosave" defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('is not interactive when disabled', () => {
    render(<ToggleSwitch label="Sync" id="sync" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('forwards arbitrary HTML attributes to the underlying input', () => {
    render(
      <ToggleSwitch label="Feature" id="feature" data-tracking="ts-feature" />,
    );
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'data-tracking',
      'ts-feature',
    );
  });

  it('renders the label before the switch when labelPosition is "left"', () => {
    render(<ToggleSwitch label="Dark mode" id="dm" labelPosition="left" />);
    const label = screen.getByText('Dark mode');
    const input = screen.getByRole('checkbox');
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
});
