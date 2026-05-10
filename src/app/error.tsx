'use client';

import { useEffect } from 'react';

import styles from './error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: hook into Sentry before going live
    console.error('[Error boundary]', error);
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
