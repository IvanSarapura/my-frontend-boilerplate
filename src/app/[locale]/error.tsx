'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { defaultLocale, isLocale, type Locale } from '@/i18n/config';
import { reportError } from '@/lib/observability';

import styles from '../error.module.css';

// Duplicates common.error/errorDetail/tryAgain: error boundaries can't reach
// the server-only dictionary and must stay self-sufficient when rendering fails.
const messages: Record<
  Locale,
  { title: string; detail: string; retry: string }
> = {
  en: {
    title: 'Something went wrong',
    detail: 'An unexpected error occurred. Please try again later.',
    retry: 'Try again',
  },
  es: {
    title: 'Algo salió mal',
    detail: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    retry: 'Intentar de nuevo',
  },
};

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale: string }>();
  const locale =
    typeof params?.locale === 'string' && isLocale(params.locale)
      ? params.locale
      : defaultLocale;
  const t = messages[locale];

  useEffect(() => {
    reportError(error, {
      source: 'locale-error-boundary',
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t.title}</h1>
      <p className={styles.message}>
        {process.env.NODE_ENV === 'development' ? error.message : t.detail}
      </p>
      <button className={styles.action} onClick={reset}>
        {t.retry}
      </button>
    </div>
  );
}
