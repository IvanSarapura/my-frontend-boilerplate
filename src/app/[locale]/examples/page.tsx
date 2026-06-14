import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container, Grid, Stack } from '@/components/layouts';
import { Card } from '@/components/ui';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

import styles from './examples.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.examples.title,
    // Reference wireframes — keep them out of search.
    robots: { index: false, follow: false },
  };
}

export default async function ExamplesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const presets = [
    {
      href: `/${locale}/examples/minimal`,
      name: dict.examples.minimalName,
      description: dict.examples.minimalDesc,
    },
    {
      href: `/${locale}/examples/marketing`,
      name: dict.examples.marketingName,
      description: dict.examples.marketingDesc,
    },
    {
      href: `/${locale}/examples/app-shell`,
      name: dict.examples.appShellName,
      description: dict.examples.appShellDesc,
    },
  ];

  return (
    <main className={styles.main}>
      <Container>
        <Stack gap={8}>
          <Stack gap={4}>
            <h1>{dict.examples.title}</h1>
            <p className={styles.intro}>{dict.examples.intro}</p>
          </Stack>
          <Grid cols={3}>
            {presets.map(preset => (
              <Link
                key={preset.href}
                href={preset.href}
                className={styles.cardLink}
              >
                <Card variant="interactive">
                  <h2 className={styles.cardTitle}>{preset.name}</h2>
                  <p className={styles.cardDesc}>{preset.description}</p>
                  <span className={styles.view}>{dict.examples.view} →</span>
                </Card>
              </Link>
            ))}
          </Grid>
        </Stack>
      </Container>
    </main>
  );
}
