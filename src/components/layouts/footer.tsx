import Link from 'next/link';
import type { ReactNode } from 'react';

import { cx } from '@/lib/utils';

import { Container } from './container';
import styles from './footer.module.css';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

interface FooterProps {
  brand?: ReactNode;
  /** Short description under the brand. */
  tagline?: ReactNode;
  /** Link columns — laid out in a responsive Grid (1 col → N). */
  columns?: FooterColumn[];
  /** Bottom legal row, e.g. a copyright line. */
  legal?: ReactNode;
  className?: string;
}

/** Responsive page footer. Server Component; brand leads a multi-column row
 * (wider first track), then the legal line. Plain next/link for the column
 * links (no active state needed). */
export function Footer({
  brand,
  tagline,
  columns = [],
  legal,
  className,
}: FooterProps) {
  const hasBrand = Boolean(brand || tagline);
  // Total grid tracks = brand cell (if any) + one per link column.
  const trackCount = (hasBrand ? 1 : 0) + columns.length;

  return (
    <footer className={cx(styles.footer, className)}>
      <Container>
        {(hasBrand || columns.length > 0) && (
          <div
            className={cx(
              styles.grid,
              styles[`cols-${trackCount}`],
              hasBrand && styles.withBrand,
            )}
          >
            {hasBrand && (
              <div className={styles.brandCol}>
                {brand && <div className={styles.brand}>{brand}</div>}
                {tagline && <p className={styles.tagline}>{tagline}</p>}
              </div>
            )}

            {columns.map(column => (
              <section key={column.heading}>
                <h2 className={styles.heading}>{column.heading}</h2>
                <ul className={styles.list}>
                  {column.links.map(link => (
                    // Key on href + label: hrefs can repeat (placeholder `#`,
                    // or two labels pointing at the same destination).
                    <li key={`${link.href}-${link.label}`}>
                      <Link href={link.href} className={styles.link}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {legal && <div className={styles.legal}>{legal}</div>}
      </Container>
    </footer>
  );
}
