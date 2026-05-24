'use client';

import { useEffect } from 'react';

import { reportError } from '@/lib/observability';

import styles from '../error.module.css';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, {
      source: 'locale-error-boundary',
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.message}>
        {process.env.NODE_ENV === 'development'
          ? error.message
          : 'An unexpected error occurred. Please try again later.'}
      </p>
      <button className={styles.action} onClick={reset}>
        Try again
      </button>
    </div>
  );
}
