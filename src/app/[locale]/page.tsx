import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Hero } from '@/components/blocks';
import { Container } from '@/components/layouts';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

import styles from './page.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.home.title,
    description: dict.home.subtitle,
  };
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <main className={styles.main}>
      <Container size="prose">
        <Hero
          align="center"
          eyebrow={dict.home.eyebrow}
          title={dict.home.title}
          subtitle={dict.home.subtitle}
          actions={
            <>
              <Button variant="primary">{dict.home.ctaPrimary}</Button>
              <Button variant="secondary">{dict.home.ctaSecondary}</Button>
            </>
          }
        />
      </Container>
    </main>
  );
}
