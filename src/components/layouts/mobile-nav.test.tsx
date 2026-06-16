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

  it('renders a bare hamburger (no button chrome) but keeps it operable', () => {
    render(
      <MobileNav label="Main" bareToggle>
        <a href="#a">Alpha</a>
      </MobileNav>,
    );
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveClass('toggle', 'bare');
    // Enlarged glyph for optical parity with an adjacent ThemeSwitch.
    expect(toggle.querySelector('svg')).toHaveAttribute('width', '48');
    fireEvent.click(toggle);
    expect(screen.getByRole('dialog', { name: 'Main' })).toBeInTheDocument();
  });

  it('scales up the hamburger and icon in the lg size', () => {
    render(
      <MobileNav label="Main" size="lg">
        <a href="#a">Alpha</a>
      </MobileNav>,
    );
    expect(screen.getByRole('navigation', { name: 'Main' })).toHaveClass('lg');
    // ICON_SIZE.lg drives the menu glyph dimensions (24 → 28).
    const icon = screen
      .getByRole('button', { name: 'Open menu' })
      .querySelector('svg');
    expect(icon).toHaveAttribute('width', '28');
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

  it('locks body scroll while the drawer is open and restores it on close', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });

  it('inerts the page background while open but keeps the dialog and its ancestors live', () => {
    // jsdom reflects the `inert` property but does not enforce its behaviour;
    // real pointer/focus blocking is covered by the Playwright e2e suite.
    const background = document.createElement('div');
    document.body.appendChild(background);

    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const dialog = screen.getByRole('dialog', { name: 'Main' });

    expect(background.inert).toBe(true); // page content behind the drawer
    expect(dialog.inert).toBeFalsy(); // the dialog itself stays interactive
    expect(dialog.parentElement?.inert).toBeFalsy(); // ...and its <nav> ancestor
    // The hamburger is a sibling of the overlay, so it goes inert too; closing
    // still works via the in-drawer close button, Esc, backdrop or swipe.
    expect(screen.getByRole('button', { name: 'Open menu' }).inert).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(background.inert).toBeFalsy();
    background.remove();
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
