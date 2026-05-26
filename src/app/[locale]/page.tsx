import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

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
      <h1 className={styles.title}>{dict.home.title}</h1>
      <p className={styles.subtitle}>{dict.home.subtitle}</p>
    </main>
  );
}
