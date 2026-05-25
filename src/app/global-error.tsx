'use client';

import { useEffect } from 'react';

import { reportError } from '@/lib/observability';

// Last-resort boundary for errors in the root layout. It replaces the whole
// document, so it ships its own <html>/<body> and inline styles (globals.css
// may not be loaded). Production only; dev shows Next's error overlay.
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
