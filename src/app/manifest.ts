import type { MetadataRoute } from 'next';

import { env } from '@/lib/env';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: env.NEXT_PUBLIC_APP_NAME,
    short_name: env.NEXT_PUBLIC_APP_NAME,
    description: 'A professional Next.js frontend boilerplate',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0070f3',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
