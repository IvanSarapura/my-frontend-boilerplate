import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Cluster, Container, Footer, NavLink } from '@/components/layouts';
import { Badge, ThemeToggle } from '@/components/ui';
import {
  HomeIcon,
  InfoIcon,
  PersonIcon,
  SettingsIcon,
} from '@/components/ui/icon';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

import styles from './app-shell.module.css';
import { SettingsForm } from './settings-form';

// Captured at build, not per request — keeps the page statically prerenderable
// under Cache Components. Refreshes on each rebuild/deploy.
const copyrightYear = new Date().getFullYear();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.examples.appShellName,
    robots: { index: false, follow: false },
  };
}

export default async function AppShellPreset({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const t = dict.examples.appShell;

  const navItems = [
    { label: t.nav.overview, href: '#overview', Icon: HomeIcon },
    { label: t.nav.profile, href: '#profile', Icon: PersonIcon },
    // Active item points at this page; the rest are wireframe stubs.
    {
      label: t.nav.settings,
      href: `/${locale}/examples/app-shell`,
      Icon: SettingsIcon,
    },
    { label: t.nav.help, href: '#help', Icon: InfoIcon },
  ];

  return (
    <>
      <header className={styles.topbar}>
        <Container>
          <div className={styles.topbarInner}>
            <NavLink href={`/${locale}`} className={styles.brand}>
              Acme
            </NavLink>
            <div className={styles.topbarActions}>
              <ThemeToggle />
            </div>
          </div>
        </Container>
      </header>

      <Container>
        <div className={styles.shell}>
          <aside className={styles.sidebar}>
            <nav aria-label={t.navLabel}>
              <ul className={styles.navList}>
                {navItems.map(item => (
                  <li key={item.label}>
                    <NavLink href={item.href} className={styles.navLink}>
                      <item.Icon size={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className={styles.content}>
            <div className={styles.pageHeader}>
              <Cluster gap={2}>
                <h1 className={styles.title}>{t.title}</h1>
                <Badge variant="primary">{t.badge}</Badge>
              </Cluster>
              <p className={styles.subtitle}>{t.subtitle}</p>
            </div>

            <SettingsForm labels={t} />
          </main>
        </div>
      </Container>

      <Footer
        brand="Acme"
        legal={`© ${copyrightYear} Acme · ${dict.footer.rights}`}
      />
    </>
  );
}
