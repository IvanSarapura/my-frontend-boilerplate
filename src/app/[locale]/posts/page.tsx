import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPosts, PostComments, PostList } from '@/features/posts';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

import styles from './posts.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return { title: dict.posts.title };
}

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const posts = await getPosts();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{dict.posts.title}</h1>
      <p className={styles.description}>{dict.posts.description}</p>
      <PostList
        posts={posts}
        getHref={(post) => `/${locale}/posts/${post.id}`}
      />
      <PostComments posts={posts} />
    </main>
  );
}
