import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FeatureGrid } from '@/components/blocks';
import { Container, Footer, Header, NavLink } from '@/components/layouts';
import { ThemeToggle } from '@/components/ui';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

import styles from './app-shell.module.css';

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

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const sidebarLinks = [
    { href: `/${locale}/examples/app-shell`, label: dict.nav.home },
    { href: `/${locale}/examples/marketing`, label: dict.nav.features },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <>
      <Header
        brand={<NavLink href={`/${locale}`}>Acme</NavLink>}
        links={navLinks}
        actions={<ThemeToggle />}
        navLabel={dict.nav.label}
        menuLabel={dict.nav.openMenu}
        closeLabel={dict.nav.closeMenu}
      />

      <Container>
        <div className={styles.shell}>
          <aside>
            <nav aria-label={dict.examples.appShellName}>
              <ul className={styles.sidebarList}>
                {sidebarLinks.map(link => (
                  <li key={link.href}>
                    <NavLink href={link.href} className={styles.sidebarLink}>
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className={styles.content}>
            <h1>{dict.examples.appShellName}</h1>
            <p className={styles.intro}>{dict.examples.appShellDesc}</p>
            <h2 className={styles.sectionHeading}>{dict.features.heading}</h2>
            <FeatureGrid features={dict.features.items} cols={2} />
          </main>
        </div>
      </Container>

      <Footer brand="Acme" legal={`© Acme · ${dict.footer.rights}`} />
    </>
  );
}
