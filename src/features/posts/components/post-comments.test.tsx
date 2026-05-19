import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mockPosts } from '@/mocks/handlers';

import type { Post } from '../types';
import { PostComments } from './post-comments';

function renderWithQueryClient(posts: Post[]) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <PostComments posts={posts} />
    </QueryClientProvider>,
  );
}

describe('PostComments', () => {
  it('renders the section title and a Select with the provided posts', () => {
    renderWithQueryClient(mockPosts);

    expect(
      screen.getByRole('heading', { name: /comments/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Select a post')).toBeInTheDocument();
  });

  it('loads and displays comments from MSW for the first post', async () => {
    renderWithQueryClient(mockPosts);

    // Mock handler for /posts/1/comments returns one comment by "Mock Commenter".
    expect(await screen.findByText('Mock Commenter')).toBeInTheDocument();
    expect(screen.getByText('mock@example.com')).toBeInTheDocument();
    expect(screen.getByText('Great mock post!')).toBeInTheDocument();
  });

  it('renders the empty state when the selected post has no comments', async () => {
    // mockPosts[1] (id: 2) has no entries in mockComments.
    renderWithQueryClient([mockPosts[1]!]);

    expect(
      await screen.findByText('No comments for this post.'),
    ).toBeInTheDocument();
  });
});
