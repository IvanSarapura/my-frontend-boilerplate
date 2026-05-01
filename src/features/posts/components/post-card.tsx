import { cx } from '@/lib/utils';

import styles from './post-card.module.css';

type PostCardProps = {
  title: string;
  body: string;
  className?: string;
};

export function PostCard({ title, body, className }: PostCardProps) {
  return (
    <article className={cx(styles.card, className)}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.body}>{body}</p>
    </article>
  );
}
