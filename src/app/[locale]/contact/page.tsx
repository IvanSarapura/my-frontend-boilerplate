import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Container } from '@/components/layouts';
import { ContactForm } from '@/features/contact';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildAlternates } from '@/lib/seo';

import styles from './contact.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: dict.contact.title,
    description: dict.contact.subtitle,
    alternates: buildAlternates(locale as Locale, '/contact'),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <main className={styles.main}>
      <Container size="prose">
        <h1 className={styles.title}>{dict.contact.title}</h1>
        <p className={styles.subtitle}>{dict.contact.subtitle}</p>
        <ContactForm
          errorMessages={dict.errors.contact}
          labels={dict.contact}
        />
      </Container>
    </main>
  );
}
