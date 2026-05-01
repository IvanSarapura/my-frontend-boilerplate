import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PostList } from '@/features/posts';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';

import { getDictionary } from '../../dictionaries';
import styles from '../posts.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return { title: `${dict.posts.title} (Mock)` };
}

export default async function MockPostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  const mockPosts = [
    {
      id: 1,
      userId: 1,
      title: 'Getting started with Next.js',
      body: 'Next.js is a React framework that gives you building blocks to create web applications.',
    },
    {
      id: 2,
      userId: 1,
      title: 'TypeScript best practices',
      body: 'TypeScript adds static types to JavaScript, helping you catch errors at compile time.',
    },
    {
      id: 3,
      userId: 2,
      title: 'Testing with Vitest',
      body: 'Vitest is a blazing fast unit-test framework powered by Vite, compatible with Jest.',
    },
    {
      id: 4,
      userId: 2,
      title: 'CSS architecture with @layer',
      body: 'The @layer at-rule lets you define cascade layers for explicit specificity control.',
    },
    {
      id: 5,
      userId: 3,
      title: 'Accessibility in React',
      body: 'Building accessible applications means everyone can use your product, regardless of ability.',
    },
  ];

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{dict.posts.title} (Mock)</h1>
      <p className={styles.description}>
        Rendered from local static data · no network request
      </p>
      <PostList posts={mockPosts} />
    </main>
  );
}
