'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { Messages } from '@/i18n/config';

import { getComments } from '../api/comments.service';
import type { Post } from '../types';
import styles from './post-comments.module.css';

// Only the fields the <Select> needs — avoids re-serializing post bodies into
// the RSC payload just to render the dropdown options.
type PostOption = Pick<Post, 'id' | 'title'>;

type PostCommentsProps = {
  posts: PostOption[];
  labels: Messages['posts']['comments'];
};

export function PostComments({ posts, labels }: PostCommentsProps) {
  const [selectedPostId, setSelectedPostId] = useState<string>(
    String(posts[0]?.id ?? ''),
  );

  const postId = Number(selectedPostId);

  // This is the intentional client-side fetching demo, so getComments stays a
  // plain browser fetch (no `'use cache'`). Caching lives where it belongs for
  // this layer: React Query keeps each post's comments fresh for staleTime.
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
    staleTime: 60_000,
  });

  const options = posts.map(post => ({
    value: String(post.id),
    label: post.title,
  }));

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{labels.title}</h2>
      <div className={styles.selectWrapper}>
        <Select
          label={labels.selectLabel}
          options={options}
          value={selectedPostId}
          onChange={setSelectedPostId}
          placeholder={labels.selectPlaceholder}
        />
      </div>

      {isLoading && <Spinner />}
      {error && <p className={styles.empty}>{labels.error}</p>}
      {comments && comments.length === 0 && (
        <p className={styles.empty}>{labels.empty}</p>
      )}
      {comments && comments.length > 0 && (
        <ul className={styles.list}>
          {comments.map(comment => (
            <li key={comment.id} className={styles.comment}>
              <p className={styles.commentName}>{comment.name}</p>
              <p className={styles.commentEmail}>{comment.email}</p>
              <p className={styles.commentBody}>{comment.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
