import './globals.css';

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';

import { HeadScripts } from '@/components/head-scripts';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { Toaster } from '@/components/ui/toaster';
import { defaultLocale, locales } from '@/i18n/config';
import { env } from '@/lib/env';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const APP_DESCRIPTION = 'A professional Next.js frontend boilerplate';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: env.NEXT_PUBLIC_APP_NAME,
    template: `%s | ${env.NEXT_PUBLIC_APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  alternates: {
    canonical: '/',
    languages: {
      ...Object.fromEntries(locales.map(l => [l, `/${l}`])),
      'x-default': `/${defaultLocale}`,
    },
  },
  openGraph: {
    title: env.NEXT_PUBLIC_APP_NAME,
    description: APP_DESCRIPTION,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: env.NEXT_PUBLIC_APP_NAME,
    description: APP_DESCRIPTION,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          HeadScripts reads the CSP nonce via headers() — must stay inside
          <Suspense> so the layout shell remains pre-renderable (PPR).
          See src/components/head-scripts/head-scripts.tsx for rationale.
        */}
        <Suspense fallback={null}>
          <HeadScripts
            appName={env.NEXT_PUBLIC_APP_NAME}
            appUrl={env.NEXT_PUBLIC_APP_URL}
            description={APP_DESCRIPTION}
          />
        </Suspense>
      </head>
      <body>
        <a href="#main-content" className="sr-only">
          Skip to main content
        </a>
        <ThemeProvider>
          <ToastProvider>
            <QueryProvider>
              {/* div wraps children so pages can keep their own <main> without nesting */}
              <div id="main-content">{children}</div>
              <Toaster />
            </QueryProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
