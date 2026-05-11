import type { Post } from '../types';
import { PostCard } from './post-card';
import styles from './post-list.module.css';

type PostListProps = {
  posts: Post[];
};

export function PostList({ posts }: PostListProps) {
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard title={post.title} body={post.body} />
        </li>
      ))}
    </ul>
  );
}
