import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getPostById, getPosts } from '@/features/posts';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { truncate } from '@/lib/string';

const META_DESCRIPTION_MAX = 160;

import styles from './post-detail.module.css';

// Cache Components composes [locale] from the parent layout's generateStaticParams
// automatically — this child only needs to enumerate [id]. Build output: 2 × 10 = 20 paths.
// Sitemap intentionally omits these URLs: JSONPlaceholder posts are demo data, not real
// content (see Round 6 / C17). When replacing the demo source with real content, add the
// URLs to src/app/sitemap.ts.
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ id: String(post.id) }));
}

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  if (!(locales as readonly string[]).includes(locale)) return {};

  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) return {};

  const [dict, post] = await Promise.all([
    getDictionary(locale as Locale),
    getPostById(numericId),
  ]);

  if (!post) return {};

  const description = truncate(post.body, META_DESCRIPTION_MAX);

  return {
    title: `${post.title} | ${dict.posts.title}`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      locale,
    },
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  const post = await getPostById(numericId);
  if (!post) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <main className={styles.main}>
      <Link href={`/${locale}/posts`} className={styles.back}>
        ← {dict.posts.title}
      </Link>
      <article className={styles.article}>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.body}>{post.body}</p>
      </article>
    </main>
  );
}
