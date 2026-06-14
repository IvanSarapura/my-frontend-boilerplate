import Link from 'next/link';
import type { ReactNode } from 'react';

import { cx } from '@/lib/utils';

import { Container } from './container';
import styles from './footer.module.css';
import { Grid } from './grid';
import { Stack } from './stack';
import type { Cols } from './types';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

interface FooterProps {
  /** Brand / wordmark slot. */
  brand?: ReactNode;
  /** Short description under the brand. */
  tagline?: ReactNode;
  /** Link columns — laid out in a responsive Grid (1 col → N). */
  columns?: FooterColumn[];
  /** Bottom legal row, e.g. a copyright line. */
  legal?: ReactNode;
  className?: string;
}

/** Responsive page footer. Server Component composing Container + Stack + Grid;
 * plain next/link for the column links (no active state needed). */
export function Footer({
  brand,
  tagline,
  columns = [],
  legal,
  className,
}: FooterProps) {
  // Grid columns track the count, clamped to the primitive's 2–4 range.
  const cols = Math.min(Math.max(columns.length, 2), 4) as Cols;

  return (
    <footer className={cx(styles.footer, className)}>
      <Container>
        <Stack gap={8}>
          {(brand || tagline) && (
            <div>
              {brand && <div className={styles.brand}>{brand}</div>}
              {tagline && <p className={styles.tagline}>{tagline}</p>}
            </div>
          )}

          {columns.length > 0 && (
            <Grid cols={cols}>
              {columns.map(column => (
                <section key={column.heading}>
                  <h2 className={styles.heading}>{column.heading}</h2>
                  <ul className={styles.list}>
                    {column.links.map(link => (
                      <li key={link.href}>
                        <Link href={link.href} className={styles.link}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </Grid>
          )}

          {legal && <div className={styles.legal}>{legal}</div>}
        </Stack>
      </Container>
    </footer>
  );
}
