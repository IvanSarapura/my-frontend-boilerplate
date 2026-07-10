import { ImageResponse } from 'next/og';

import { env } from '@/lib/env';

// Apple touch icon standard size. Solid background (no transparency/maskable).
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  const initial =
    env.NEXT_PUBLIC_APP_NAME.trim().charAt(0).toUpperCase() || 'A';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Token values --accent / --color-on-accent, hardcoded for Satori.
        background: '#0070f3',
        color: '#fff',
        fontSize: 96,
        fontWeight: 700,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {initial}
    </div>,
    size,
  );
}
