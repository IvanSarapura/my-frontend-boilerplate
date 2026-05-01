import './globals.css';

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { QueryProvider } from '@/components/providers/query-provider';
import { ToastProvider } from '@/components/ui/toast-context';
import { Toaster } from '@/components/ui/toaster';
import { env } from '@/lib/env';
import { generateWebsiteJsonLd } from '@/lib/json-ld';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateWebsiteJsonLd({
    name: env.NEXT_PUBLIC_APP_NAME,
    url: env.NEXT_PUBLIC_APP_URL,
    description: APP_DESCRIPTION,
  });

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main-content" className="sr-only">
          Skip to main content
        </a>
        <ToastProvider>
          <QueryProvider>
            {/* div wraps children so pages can keep their own <main> without nesting */}
            <div id="main-content">{children}</div>
            <Toaster />
          </QueryProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
