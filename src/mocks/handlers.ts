import { http, HttpResponse } from 'msw';

export const mockPosts = [
  {
    id: 1,
    userId: 1,
    title: 'Mock Post One',
    body: 'This is the first mock post body.',
  },
  {
    id: 2,
    userId: 1,
    title: 'Mock Post Two',
    body: 'This is the second mock post body.',
  },
];

export const mockComments = [
  {
    postId: 1,
    id: 1,
    name: 'Mock Commenter',
    email: 'mock@example.com',
    body: 'Great mock post!',
  },
];

export const handlers = [
  http.get('https://jsonplaceholder.typicode.com/posts', ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('_limit');
    const posts = limit ? mockPosts.slice(0, Number(limit)) : mockPosts;
    return HttpResponse.json(posts);
  }),

  http.get(
    'https://jsonplaceholder.typicode.com/posts/:postId/comments',
    ({ params }) => {
      const postId = Number(params.postId);
      return HttpResponse.json(mockComments.filter((c) => c.postId === postId));
    },
  ),
];
