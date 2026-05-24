'use client';

import { useEffect } from 'react';

import { reportError } from '@/lib/observability';

/**
 * Last-resort boundary for errors thrown in the root layout itself. It replaces
 * the entire document, so it renders its own <html>/<body> and uses inline
 * styles only — globals.css and the design tokens are not guaranteed to be
 * loaded in this context. Only shown in production (in dev, Next renders its
 * error overlay instead).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, {
      source: 'global-error-boundary',
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          textAlign: 'center',
          color: '#171717',
          background: '#fff',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ margin: 0, color: '#6b6b6b' }}>
          {process.env.NODE_ENV === 'development'
            ? error.message
            : 'An unexpected error occurred. Please try again later.'}
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '0.6rem 1.4rem',
            fontSize: '1rem',
            fontWeight: 500,
            color: '#fff',
            background: '#0070f3',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
