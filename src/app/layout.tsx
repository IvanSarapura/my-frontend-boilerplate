import './globals.css';

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <a href="#main-content" className="sr-only">
          Skip to main content
        </a>
        {/* div wraps children so pages can keep their own <main> without nesting */}
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
