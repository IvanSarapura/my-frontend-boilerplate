'use client';

import { useState } from 'react';

import { cx } from '@/lib/utils';

import styles from './avatar.module.css';
import { getInitials } from './get-initials';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
type AvatarShape = 'circle' | 'square';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export type AvatarProps = {
  src?: string | undefined;
  alt: string;
  name?: string | undefined;
  size?: AvatarSize | undefined;
  shape?: AvatarShape | undefined;
  status?: AvatarStatus | undefined;
  className?: string | undefined;
};

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  status,
  className,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const [lastSrc, setLastSrc] = useState(src);
  if (src !== lastSrc) {
    setLastSrc(src);
    setHasError(false);
  }

  const showImage = Boolean(src) && !hasError;

  return (
    <span
      role="img"
      aria-label={alt}
      className={cx(styles.avatar, styles[size], styles[shape], className)}
    >
      <span className={styles.media}>
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- Avatar accepts arbitrary external URLs; next/image would require per-domain config that is not the boilerplate's responsibility.
          <img
            src={src}
            alt=""
            className={styles.image}
            onError={() => setHasError(true)}
          />
        ) : (
          <span className={styles.initials} aria-hidden="true">
            {getInitials(name)}
          </span>
        )}
      </span>
      {status && (
        <span
          className={cx(styles.status, styles[`status-${status}`])}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
