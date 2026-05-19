import type { Post } from '../types';
import { PostCard } from './post-card';
import styles from './post-list.module.css';

type PostListProps = {
  posts: Post[];
  getHref?: (post: Post) => string;
};

export function PostList({ posts, getHref }: PostListProps) {
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard
            title={post.title}
            body={post.body}
            {...(getHref ? { href: getHref(post) } : {})}
          />
        </li>
      ))}
    </ul>
  );
}
