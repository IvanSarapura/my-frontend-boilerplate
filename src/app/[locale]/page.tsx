import { notFound } from 'next/navigation';

import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';

import styles from '../page.module.css';
import { getDictionary } from './dictionaries';

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
