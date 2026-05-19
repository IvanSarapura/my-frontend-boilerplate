import Link from 'next/link';

import { cx } from '@/lib/utils';

import styles from './post-card.module.css';

type PostCardProps = {
  title: string;
  body: string;
  className?: string | undefined;
  href?: string | undefined;
};

export function PostCard({ title, body, className, href }: PostCardProps) {
  const article = (
    <article className={cx(styles.card, className)}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.body}>{body}</p>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className={styles.link}>
        {article}
      </Link>
    );
  }

  return article;
}
