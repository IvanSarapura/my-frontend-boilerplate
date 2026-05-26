import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getPostById, getPosts } from '@/features/posts';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { env } from '@/lib/env';
import {
  generateArticleJsonLd,
  generateBreadcrumbListJsonLd,
  serializeJsonLd,
} from '@/lib/json-ld';
import { buildAlternates, localeToOgLocale } from '@/lib/seo';
import { truncate } from '@/lib/string';

import styles from './post-detail.module.css';

const META_DESCRIPTION_MAX = 160;

type ValidParams = { locale: Locale; numericId: number };

function parseParams(locale: string, id: string): ValidParams | null {
  if (!(locales as readonly string[]).includes(locale)) return null;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) return null;
  return { locale: locale as Locale, numericId };
}

// [locale] is composed from the parent layout's generateStaticParams, so this
// child only enumerates [id]. Sitemap omits these URLs (demo data); when wiring
// a real source, add them to src/app/sitemap.ts.
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ id: String(post.id) }));
}

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const raw = await params;
  const parsed = parseParams(raw.locale, raw.id);
  if (!parsed) return {};

  const [dict, post] = await Promise.all([
    getDictionary(parsed.locale),
    getPostById(parsed.numericId),
  ]);

  if (!post) return {};

  const description = truncate(post.body, META_DESCRIPTION_MAX);

  return {
    title: `${post.title} | ${dict.posts.title}`,
    description,
    alternates: buildAlternates(parsed.locale, `/posts/${parsed.numericId}`),
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      locale: localeToOgLocale[parsed.locale],
    },
  };
}

// Reads the per-request nonce via headers(), so it must stay inside <Suspense>
// to keep the page's static shell prerenderable. Mirrors HeadScripts.
async function PostStructuredData({
  locale,
  title,
  body,
  numericId,
  homeTitle,
  postsTitle,
}: {
  locale: Locale;
  title: string;
  body: string;
  numericId: number;
  homeTitle: string;
  postsTitle: string;
}) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const base = `${env.NEXT_PUBLIC_APP_URL}/${locale}`;
  const url = `${base}/posts/${numericId}`;

  const article = generateArticleJsonLd({
    headline: title,
    description: truncate(body, META_DESCRIPTION_MAX),
    url,
    inLanguage: locale,
  });
  const breadcrumb = generateBreadcrumbListJsonLd([
    { name: homeTitle, url: base },
    { name: postsTitle, url: `${base}/posts` },
    { name: title, url },
  ]);

  return (
    <>
      <script
        nonce={nonce}
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(article) }}
      />
      <script
        nonce={nonce}
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
      />
    </>
  );
}

export default async function PostDetailPage({ params }: PageProps) {
  const raw = await params;
  const parsed = parseParams(raw.locale, raw.id);
  if (!parsed) notFound();

  const [post, dict] = await Promise.all([
    getPostById(parsed.numericId),
    getDictionary(parsed.locale),
  ]);
  if (!post) notFound();

  return (
    <main className={styles.main}>
      <Suspense fallback={null}>
        <PostStructuredData
          locale={parsed.locale}
          title={post.title}
          body={post.body}
          numericId={parsed.numericId}
          homeTitle={dict.home.title}
          postsTitle={dict.posts.title}
        />
      </Suspense>
      <Link href={`/${parsed.locale}/posts`} className={styles.back}>
        ← {dict.posts.title}
      </Link>
      <article className={styles.article}>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.body}>{post.body}</p>
      </article>
    </main>
  );
}
