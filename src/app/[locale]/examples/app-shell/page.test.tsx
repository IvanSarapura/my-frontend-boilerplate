import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@/components/providers/theme-provider';

import AppShellPreset, { generateMetadata } from './page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
  usePathname: vi.fn(() => '/en/examples/app-shell'),
}));

vi.mock('@/i18n/dictionaries', () => ({
  getDictionary: vi.fn().mockResolvedValue({
    examples: {
      appShellName: 'App shell',
      appShell: {
        navLabel: 'Account',
        nav: {
          overview: 'Overview',
          profile: 'Profile',
          settings: 'Settings',
          help: 'Help',
        },
        title: 'Settings',
        badge: 'Pro',
        subtitle: 'Manage your account.',
        profileTitle: 'Profile',
        nameLabel: 'Display name',
        nameValue: 'Ada Lovelace',
        emailLabel: 'Email',
        emailValue: 'ada@example.com',
        prefsTitle: 'Preferences',
        notif1: 'Email notifications',
        notif2: 'Weekly digest',
        saveAction: 'Save changes',
      },
    },
    footer: { rights: 'All rights reserved.' },
  }),
}));

function renderPage(locale = 'en') {
  return AppShellPreset({ params: Promise.resolve({ locale }) }).then(jsx =>
    render(<ThemeProvider>{jsx}</ThemeProvider>),
  );
}

describe('App-shell preset page', () => {
  it('renders the topbar, sidebar nav and settings heading', async () => {
    await renderPage();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Account' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Settings',
    );
  });

  it('renders the settings cards (valid h1→h2 order) and controls', async () => {
    await renderPage();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Profile' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Preferences' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Display name')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Save changes' }),
    ).toBeInTheDocument();
  });

  it('marks the current sidebar link active', async () => {
    await renderPage();
    const active = screen
      .getAllByRole('link')
      .find(el => el.getAttribute('href') === '/en/examples/app-shell');
    expect(active).toHaveAttribute('aria-current', 'page');
  });

  it('generateMetadata returns the translated title and marks the page noindex', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    });
    expect(meta.title).toBe('App shell');
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it('calls notFound for an unknown locale', async () => {
    const { notFound } = await import('next/navigation');
    await AppShellPreset({ params: Promise.resolve({ locale: 'fr' }) });
    expect(notFound).toHaveBeenCalled();
  });
});
