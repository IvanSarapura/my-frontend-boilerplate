import type { Metadata } from 'next';

import styles from '../posts.module.css';
import { mockPosts } from './mock-data';

export const metadata: Metadata = {
  title: 'Posts (Mock)',
};

export default function MockPostsPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Posts (Mock)</h1>
      <p className={styles.description}>
        Rendered from local static data · no network request
      </p>
      <ul className={styles.list}>
        {mockPosts.map((post) => (
          <li key={post.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{post.title}</h2>
            <p className={styles.cardBody}>{post.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
