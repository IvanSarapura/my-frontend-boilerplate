import { ImageResponse } from 'next/og';

import { env } from '@/lib/env';

export const alt = env.NEXT_PUBLIC_APP_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#0a0a0a',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ededed',
        fontFamily: 'system-ui, sans-serif',
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: 72, fontWeight: 700, margin: 0 }}>
        {env.NEXT_PUBLIC_APP_NAME}
      </h1>
      <p style={{ fontSize: 28, color: '#888', margin: 0 }}>
        {env.NEXT_PUBLIC_APP_URL}
      </p>
    </div>,
    size,
  );
}
