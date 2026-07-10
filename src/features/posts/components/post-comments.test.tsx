import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import type { Messages } from '@/i18n/config';
import en from '@/i18n/messages/en.json';
import es from '@/i18n/messages/es.json';
import { mockPosts } from '@/mocks/handlers';
import { server } from '@/mocks/node';

import type { Post } from '../types';
import { PostComments } from './post-comments';

function renderWithQueryClient(
  posts: Post[],
  labels: Messages['posts']['comments'] = en.posts.comments,
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <PostComments posts={posts} labels={labels} />
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

  it('initializes with an empty selection when no posts are provided', () => {
    renderWithQueryClient([]);

    expect(
      screen.getByRole('heading', { name: /comments/i }),
    ).toBeInTheDocument();
  });

  it('renders the error state when the comments request fails', async () => {
    server.use(
      http.get(
        'https://jsonplaceholder.typicode.com/posts/:postId/comments',
        () => new HttpResponse('boom', { status: 500 }),
      ),
    );
    renderWithQueryClient(mockPosts);

    expect(
      await screen.findByText('Failed to load comments.'),
    ).toBeInTheDocument();
  });

  it('renders all UI strings in Spanish when given the es labels', async () => {
    // mockPosts[1] (id: 2) has no comments, so the empty state also renders.
    renderWithQueryClient([mockPosts[1]!], es.posts.comments);

    expect(
      screen.getByRole('heading', { name: es.posts.comments.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(es.posts.comments.selectLabel)).toBeInTheDocument();
    expect(
      await screen.findByText(es.posts.comments.empty),
    ).toBeInTheDocument();
  });
});
