import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar } from './avatar';

describe('Avatar', () => {
  it('renders an image when src is provided', () => {
    render(
      <Avatar
        src="https://example.com/a.png"
        alt="Ada Lovelace"
        name="Ada Lovelace"
      />,
    );
    const img = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(img).toBeInTheDocument();
    expect(img.querySelector('img')).toHaveAttribute(
      'src',
      'https://example.com/a.png',
    );
  });

  it('falls back to initials when no src is provided', () => {
    render(<Avatar alt="Grace Hopper" name="Grace Hopper" />);
    expect(screen.getByText('GH')).toBeInTheDocument();
  });

  it('falls back to initials when the image fails to load', () => {
    render(
      <Avatar
        src="https://broken.invalid/x.png"
        alt="Margaret Hamilton"
        name="Margaret Hamilton"
      />,
    );
    const img = screen.getByRole('img', { name: 'Margaret Hamilton' });
    const inner = img.querySelector('img');
    expect(inner).toBeInTheDocument();

    fireEvent.error(inner!);

    expect(screen.getByText('MH')).toBeInTheDocument();
  });

  it('uses "?" when neither src nor name is provided', () => {
    render(<Avatar alt="Unknown user" />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('renders a status indicator when status is provided', () => {
    const { container } = render(<Avatar alt="A" name="A" status="online" />);
    expect(container.querySelector('.status-online')).toBeInTheDocument();
  });

  it('does not render a status indicator when status is omitted', () => {
    const { container } = render(<Avatar alt="A" name="A" />);
    expect(
      container.querySelector('[class*="status-"]'),
    ).not.toBeInTheDocument();
  });

  it('applies the size class', () => {
    const { container } = render(<Avatar alt="A" name="A" size="xl" />);
    expect(container.firstElementChild).toHaveClass('xl');
  });

  it('applies the shape class', () => {
    const { container } = render(<Avatar alt="A" name="A" shape="square" />);
    expect(container.firstElementChild).toHaveClass('square');
  });

  it('exposes alt as the accessible name on the wrapper', () => {
    render(<Avatar alt="Custom label" name="Ada Lovelace" />);
    expect(
      screen.getByRole('img', { name: 'Custom label' }),
    ).toBeInTheDocument();
  });
});
