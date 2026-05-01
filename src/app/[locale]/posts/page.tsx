import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { notFound } from 'next/navigation';

import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';

import styles from '../../posts/posts.module.css';
import { getDictionary } from '../dictionaries';

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

export default async function LocalePostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  const [posts, dict] = await Promise.all([
    getPosts(),
    getDictionary(locale as Locale),
  ]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{dict.posts.title}</h1>
      <p className={styles.description}>
        {dict.posts.description} · cached ~1 minute via <code>use cache</code>
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
