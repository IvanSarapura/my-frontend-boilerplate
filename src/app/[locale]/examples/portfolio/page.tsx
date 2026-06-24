import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FeatureGrid, Hero } from '@/components/blocks';
import {
  Container,
  Footer,
  Header,
  NavLink,
  Section,
} from '@/components/layouts';
import { Button, ThemeSwitch } from '@/components/ui';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

import styles from './portfolio.module.css';

// Captured at build, not per request — keeps the page statically prerenderable
// under Cache Components. Refreshes on each rebuild/deploy.
const copyrightYear = new Date().getFullYear();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: dict.examples.portfolioName,
    robots: { index: false, follow: false },
  };
}

export default async function PortfolioPreset({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  const dict = await getDictionary(locale);

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: '#features', label: dict.nav.features },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  // Placeholder hrefs (#) are wireframe stubs — wire them to real routes.
  const footerColumns = [
    {
      heading: dict.footer.product,
      links: [
        { href: '#features', label: dict.nav.features },
        { href: '#', label: dict.nav.pricing },
      ],
    },
    {
      heading: dict.footer.company,
      links: [{ href: `/${locale}/contact`, label: dict.nav.contact }],
    },
    {
      heading: dict.footer.legal,
      links: [
        { href: '#', label: dict.footer.privacy },
        { href: '#', label: dict.footer.terms },
      ],
    },
  ];

  return (
    <>
      <Header
        brand={<NavLink href={`/${locale}`}>Acme</NavLink>}
        links={navLinks}
        actions={<ThemeSwitch variant="outlined-max" size="md" hideLabel />}
        navLabel={dict.nav.label}
        menuLabel={dict.nav.openMenu}
        closeLabel={dict.nav.closeMenu}
        size="lg"
        bareToggle
      />

      <main>
        <Section>
          <Container>
            <Hero
              eyebrow={dict.hero.eyebrow}
              title={dict.hero.title}
              subtitle={dict.hero.subtitle}
              actions={
                <>
                  <Button variant="primary">{dict.hero.ctaPrimary}</Button>
                  <Button variant="secondary">{dict.hero.ctaSecondary}</Button>
                </>
              }
            />
          </Container>
        </Section>

        <Section id="features">
          <Container>
            <h2 className={styles.sectionHeading}>{dict.features.heading}</h2>
            <FeatureGrid features={dict.features.items} />
          </Container>
        </Section>

        <Section surface="muted">
          <Container>
            <div className={styles.cta}>
              <h2>{dict.cta.title}</h2>
              <p className={styles.ctaText}>{dict.cta.subtitle}</p>
              <Button variant="primary">{dict.cta.button}</Button>
            </div>
          </Container>
        </Section>
      </main>

      <Footer
        brand="Acme"
        tagline={dict.footer.tagline}
        columns={footerColumns}
        legal={`© ${copyrightYear} Acme · ${dict.footer.rights}`}
      />
    </>
  );
}
