import { z } from 'zod';

import { apiClient } from '@/lib/api/client';

const JSONPLACEHOLDER_API = 'https://jsonplaceholder.typicode.com';

const commentSchema = z.object({
  postId: z.number(),
  id: z.number(),
  name: z.string(),
  email: z.string(),
  body: z.string(),
});

export type Comment = z.infer<typeof commentSchema>;

export async function getComments(postId: number): Promise<Comment[]> {
  return apiClient(`${JSONPLACEHOLDER_API}/posts/${postId}/comments`, {
    schema: z.array(commentSchema),
  });
}
