import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';

import styles from './posts.module.css';

export const metadata: Metadata = {
  title: 'Posts',
};

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

async function getPosts(): Promise<Post[]> {
  'use cache';
  cacheLife('minutes');
  const res = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=10',
  );
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json() as Promise<Post[]>;
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Posts</h1>
      <p className={styles.description}>
        Fetched from JSONPlaceholder API · cached ~1 minute via{' '}
        <code>use cache</code>
      </p>
      <ul className={styles.list}>
        {posts.map((post) => (
          <li key={post.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{post.title}</h2>
            <p className={styles.cardBody}>{post.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
