import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MobileNav } from './mobile-nav';

// matchMedia is polyfilled globally in vitest.setup.ts (matches: false), which
// is exactly the below-`md` viewport these tests exercise — no local mock needed.
function setup() {
  return render(
    <MobileNav label="Main">
      <a href="#a">Alpha</a>
      <a href="#b">Beta</a>
    </MobileNav>,
  );
}

describe('MobileNav', () => {
  it('renders a navigation landmark with the drawer collapsed', () => {
    setup();
    expect(
      screen.getByRole('navigation', { name: 'Main' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the navigation links', () => {
    setup();
    expect(screen.getByRole('link', { name: 'Alpha' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Beta' })).toBeInTheDocument();
  });

  it('opens the drawer when the hamburger is clicked', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('dialog', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('closes the drawer with the close button', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the drawer on Escape', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the drawer when the backdrop is clicked', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.pointerDown(screen.getByRole('dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the drawer on a rightward swipe of the panel', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const panel = screen.getByRole('dialog').firstElementChild!;

    fireEvent.touchStart(panel, { touches: [{ clientX: 80 }] });
    fireEvent.touchMove(panel, { touches: [{ clientX: 220 }] });
    fireEvent.touchEnd(panel);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
