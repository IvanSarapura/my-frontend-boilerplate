import '../globals.css';

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { HeadScripts } from '@/components/head-scripts';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { Toaster } from '@/components/ui/toaster';
import { defaultLocale, type Locale, locales } from '@/i18n/config';
import { env } from '@/lib/env';
import { buildAlternates, localeToOgLocale } from '@/lib/seo';

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
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: {
      default: env.NEXT_PUBLIC_APP_NAME,
      template: `%s | ${env.NEXT_PUBLIC_APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    alternates: buildAlternates(locale as Locale, ''),
    openGraph: {
      title: env.NEXT_PUBLIC_APP_NAME,
      description: APP_DESCRIPTION,
      type: 'website',
      locale:
        localeToOgLocale[locale as Locale] ?? localeToOgLocale[defaultLocale],
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
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* HeadScripts reads the nonce via headers(); keep in <Suspense> to
            preserve PPR. See README → proxy.ts. */}
        <Suspense fallback={null}>
          <HeadScripts
            appName={env.NEXT_PUBLIC_APP_NAME}
            appUrl={env.NEXT_PUBLIC_APP_URL}
            description={APP_DESCRIPTION}
            locale={locale}
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
              {/* div wraps children so pages can keep their own <main> without nesting;
                  tabIndex=-1 lets the skip link move focus into the region (WCAG 2.4.1) */}
              <div id="main-content" tabIndex={-1}>
                {children}
              </div>
              <Toaster />
            </QueryProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
