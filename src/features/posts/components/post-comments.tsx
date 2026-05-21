'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

import { getComments } from '../api/comments.service';
import type { Post } from '../types';
import styles from './post-comments.module.css';

type PostCommentsProps = {
  posts: Post[];
};

export function PostComments({ posts }: PostCommentsProps) {
  const [selectedPostId, setSelectedPostId] = useState<string>(
    String(posts[0]?.id ?? ''),
  );

  const postId = Number(selectedPostId);

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });

  const options = posts.map(post => ({
    value: String(post.id),
    label: post.title,
  }));

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Comments (Client-side fetching)</h2>
      <div className={styles.selectWrapper}>
        <Select
          label="Select a post"
          options={options}
          value={selectedPostId}
          onChange={setSelectedPostId}
          placeholder="Choose a post..."
        />
      </div>

      {isLoading && <Spinner />}
      {error && <p className={styles.empty}>Failed to load comments.</p>}
      {comments && comments.length === 0 && (
        <p className={styles.empty}>No comments for this post.</p>
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
