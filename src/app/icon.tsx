import { ImageResponse } from 'next/og';

import { env } from '@/lib/env';

// Two sizes the PWA manifest references (see manifest.ts). Colors are the
// --accent / --color-on-accent tokens hardcoded — Satori can't read CSS vars.
export function generateImageMetadata() {
  return [
    { id: '192', size: { width: 192, height: 192 }, contentType: 'image/png' },
    { id: '512', size: { width: 512, height: 512 }, contentType: 'image/png' },
  ];
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const dim = (await id) === '512' ? 512 : 192;
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
        // ~20% safe-zone padding so the glyph survives maskable cropping.
        padding: dim * 0.2,
        background: '#0070f3',
        color: '#fff',
        fontSize: dim * 0.5,
        fontWeight: 700,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {initial}
    </div>,
    { width: dim, height: dim },
  );
}
